import hashlib
import random
import secrets
from datetime import datetime, timedelta
NoneType = type(None)

import jwt
from flask import Flask, render_template, jsonify, request, redirect, url_for
from pymongo import MongoClient

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"
app.jinja_env.add_extension('jinja2.ext.loopcontrols')

SECRET_KEY = secrets.token_hex(16)

client = MongoClient('localhost', 27017)
db = client.team10
is_login = False


@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"id": payload["id"]}, {'_id': False})
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

    result = db.users.find_one({'id': id_receive, 'pw': pw_encrypt})

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
        return render_template('signup.html')
    else:
        id_receive = request.form['id_give']
        pw_receive = request.form['pw_give']
        email_receive = request.form['email_give']
        pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

        doc = {
            "id": id_receive,
            "pw": pw_hash,
            "email": email_receive,
            "like_list": []
        }
        db.users.insert_one(doc)
        return jsonify({'result': 'success'})


@app.route('/api/is_dup', methods=['POST'])
def is_dup():
    id_receive = request.form['id_give']
    if db.users.find_one({'id': id_receive}) is not None:
        return jsonify({'is_dup': True})
    else:
        return jsonify({'is_dup': False})


@app.route('/api/list_view', methods=['GET', 'POST'])
def to_listpage():
    if request.method == 'GET':
        search_list = list(db.cocktails.find({}, {'_id': False}))
        return render_template('shop-grid.html', results=search_list)

    val_receive = request.form['val_give']
    query = {}

    print(val_receive)

    if val_receive == 0 or isinstance(val_receive, NoneType):
        search_list = list(db.cocktails.find({}, {'_id': False}))
    else:
        search_list = list(db.cocktails.find({'class': {"$regex": val_receive}}, {'_id': False}))

    # if len(search_list) > -2:
    #     query = {"$or": search_list}
    #
    # search = search
    # keyword = keyword
    #
    # results = db.cocktails.find(query)

    try:
        token_receive = request.cookies.get('mytoken')
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        id = db.users.find_one({"id": payload["id"]}, {'_id': False})
        print(id)
        return jsonify({'results':search_list, 'is_login': id})
    except:
        return jsonify({'results': search_list, 'is_login': 0})


# TODO 상세 페이지 API
@app.route('/api/view', methods=['GET'])
def to_detail_page():
    token_receive = request.cookies.get('mytoken')
    cocktail_name = request.args.get('cocktailname')
    cocktail_info = db.cocktails.find_one({'name': cocktail_name}, {'_id': False})
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"id": payload["id"]}, {'_id': False})
        return render_template('details.html', cocktail_info=cocktail_info, enumerate=enumerate, user_info=user_info)
    except:
        return render_template('details.html', cocktail_info=cocktail_info, enumerate=enumerate)


# 삭제 버튼을 누른 사람 기준 검증 or 현 페이지 접속자 기준 검증 ?
# 일단 전자
@app.route('/api/custom_delete', methods=['DELETE'])
def delete_article():
    id_receive = request.form['id_give']
    idx_receive = request.form['idx_give']

    db.cocktails.delete_one({'id': id_receive, 'idx': idx_receive})

    return jsonify({'msg': "게시글 삭제 완료"})


@app.route('/api/reply_delete', methods=['DELETE'])
def delete_comment():
    name_receive = request.form['name_give']
    cocktail_name_receive = request.form['cocktail_name_give']
    db.reviews.delete_one({'name': name_receive, 'cocktail_name': cocktail_name_receive})
    db.cocktails.update_one({'name': cocktail_name_receive}, {'$pull': {'review': {'name': name_receive}}})

    return jsonify({'msg': "댓글 삭제 완료"})


@app.route('/api/reply_write', methods=['POST'])
def write_comment():
    name_receive = request.form['name_give']
    cocktail_name_receive = request.form['cocktail_name_give']
    content_receive = request.form['content_give']
    stars_receive = int(request.form['stars_give'])

    doc = {
        'name': name_receive,
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
        user_info = get_user_info()
        if user_info is None:
            return render_template('index.html')
        return render_template('write.html', user_info=user_info)
    else:
        id_receive = request.form['id_give']
        name_receive = request.form['name_give']
        class_receive = "user_recipe"
        ingredient_receive = request.form['ingredient_give']
        method_receive = request.form['method_give']
        garnish_receive = request.form['garnish_give']
        imgsrc_receive = request.form['imgsrc_give']
        idx = str(datetime.now())
        doc = {
            "id": id_receive,
            "name": name_receive,
            "class": class_receive,
            "ingredient": ingredient_receive,
            "method": method_receive,
            "garnish": garnish_receive,
            "like": 0,
            "review": [],
            "imgsrc": imgsrc_receive,
            "stars": [],
            "idx": idx

        }

        db.cocktails.insert_one(doc)
        return jsonify({'msg': "등록 완료!"})


# 랜덤 칵테일 추천 API
@app.route('/api/randomrecommend', methods=['GET'])
def random_list():
    random_list = list(db.cocktails.find({}, {'_id': False}))
    random.shuffle(random_list)
    user_like_list = ''
    try:
        token_receive = request.cookies.get('mytoken')
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"id": payload["id"]})
        user_like_list = user_info["like_list"]
        return jsonify({'result': random_list, "user_like_list": user_like_list})
    except:
        return jsonify({'result': random_list, "user_like_list": user_like_list})


# 좋아요 순 칵테일 추천 API
@app.route('/api/likerecommend', methods=['GET'])
def like_list():
    like_list = list(db.cocktails.find({}, {'_id': False}).sort('like', -1))
    user_like_list = []
    try:
        token_receive = request.cookies.get('mytoken')
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"id": payload["id"]})
        user_like_list = user_info["like_list"]
        return jsonify({'result': like_list, "user_like_list": user_like_list})
    except:
        return jsonify({'result': like_list, "user_like_list": user_like_list})


@app.route('/api/likeclick', methods=["POST"])
def like_click():
    name_receive = request.form["name_give"]
    try:
        token_receive = request.cookies.get('mytoken')

        if token_receive is not None:
            payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
            user_info = db.users.find_one({"id": payload["id"]})
            user_like_list = user_info["like_list"]

            if name_receive in user_like_list:
                db.users.update_one({"id": payload["id"]}, {'$pull': {'like_list': name_receive}})
                db.cocktails.update_one({"name": name_receive}, {'$inc': {'like': -1}})
                print("좋아요 취소")
                return jsonify({'msg': '좋아요 취소'})
            elif name_receive not in user_like_list:
                db.users.update_one({"id": payload["id"]}, {'$push': {'like_list': name_receive}})
                db.cocktails.update_one({"name": name_receive}, {'$inc': {'like': 1}})
                print("좋아요")
                return jsonify({'msg': '좋아요!'})
        else:
            print("로그인 먼저")
            quit()
    except:
        quit()


@app.route('/api/mypage', methods=['GET'])
def to_my_page():
    return render_template('mypage.html')


@app.route('/api/mypage/listup', methods=['GET'])
def my_page_list():
    cocktails = list(db.cocktails.find({}, {'_id': False}))
    return jsonify({'all_cocktails': cocktails})


def get_user_info():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"id": payload["id"]}, {'_id': False})
        return user_info
    except:
        return None


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
