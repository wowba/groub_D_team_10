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
db = client.logintest




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
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    else:
        return jsonify({'result': 'fail', 'msg': '아이디 / 비밀번호가 일치하지 않거나 정보가 없습니다'})


@app.route('/sign_up', methods=['GET', 'POST'])
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
@app.route('/mypage', methods=['GET'])
def to_mypage():
    return render_template('mypage.html')


# TODO 리스트 페이지 API
@app.route('/listpage', methods=['GET'])
def to_listpage():
    return render_template('listpage.html')


# TODO 게시글 작성 API
@app.route('/write', methods=['GET', 'POST'])
def to_write_page():
    if request.method == 'GET':
        return render_template('write.html')


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
