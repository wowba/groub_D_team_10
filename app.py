from pymongo import MongoClient
import jwt
import datetime
import hashlib
import secrets
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = secrets.token_hex(16)

client = MongoClient('localhost', 27017)
db = client.team10
is_login = False


@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]}, {'_id': False})
        return render_template('index.html', user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("home", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return render_template('index.html')


@app.route('/api/login', methods=['POST'])
def login():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']

    pw_encrypt = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    # 현재 설계에 맞는 코드, 테스트 DB 설계가 달라서 주석 처리함
    # result = db.users.find_one({'id': id_receive, 'pw': pw_encrypt})
    result = db.users.find_one({'username': id_receive, 'password': pw_encrypt})

    if result is not None:
        payload = {
            'id': id_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    else:
        return jsonify({'result': 'fail', 'msg': '아이디 / 비밀번호가 일치하지 않거나 정보가 없습니다'})


@app.route('/api/register', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'GET':
        return render_template('sign-up.html')
    else:
        username_receive = request.form['username_give']
        password_receive = request.form['password_give']
        password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
        doc = {
            "username": username_receive,
            "password": password_hash,
        }
        db.users.insert_one(doc)
    return jsonify({'result': 'success'})


# TODO 마이 페이지 API
@app.route('/api/mypage', methods=['GET'])
def to_my_page():
    return render_template('mypage.html')


# TODO 리스트 페이지 API
@app.route('/api/list_view', methods=['GET'])
def to_list_page():
    return render_template('listpage.html')


# TODO 상세 페이지 API
@app.route('/api/view', methods=['GET'])
def to_detail_page():
    cocktail_name = request.args.get('cocktailname')
    cocktail_info = db.cocktails.find_one({'name': cocktail_name}, {'_id': False})


    return render_template('details.html', cocktail_info=cocktail_info)


@app.route('/api/reply_write', methods=['POST'])
def reply_write():
    cocktail_name_receive = request.form['cocktail_name_give']
    content_receive = request.form['content_give']
    stars_receive = int(request.form['stars_give'])

    doc = {
        'cocktail_name': cocktail_name_receive,
        'content': content_receive,
        'stars': stars_receive
    }



    db.cocktails.update_one({'name': cocktail_name_receive}, {'$push': {'review': doc}})

    db.reviews.insert_one(doc)
    return jsonify({'result': "작성 완료!"})


# TODO 게시글 작성 API
@app.route('/api/custom_write', methods=['GET', 'POST'])
def to_write_page():
    if request.method == 'GET':
        return render_template('write.html')



if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
