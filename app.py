import hashlib
import random
import secrets
from datetime import datetime, timedelta

import jwt
from flask import Flask, render_template, jsonify, request, redirect, url_for
from pymongo import MongoClient
from werkzeug.utils import secure_filename

NoneType = type(None)
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"
app.jinja_env.add_extension('jinja2.ext.loopcontrols')

SECRET_KEY = secrets.token_hex(16)

client = MongoClient('localhost', 27017)
db = client.team10


@app.route('/')
def home():
    # 로그인 했으면 토큰을 가져와 사용자 정보를 함께 렌더링 아닐 시 사용자 정보 제외
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"id": payload["id"]}, {'_id': False})
        return render_template('index.html', user_info=user_info)
    except jwt.ExpiredSignatureError:
        # 토큰 시간 만료 시 메세지와 함께 홈으로
        return redirect(url_for("home", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return render_template('index.html')


# 로그인
@app.route('/api/login', methods=['POST'])
def login():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']

    # DB 검색 위한 비밀 번호 암호화
    pw_encrypt = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    # DB 검색
    result = db.users.find_one({'id': id_receive, 'pw': pw_encrypt})

    # 검색 정보가 있을 시 payload에 정보 저장 후 JWT 발급
    if result is not None:
        payload = {
            'id': id_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        # 반환 값으로 사용자에게 토큰 할당
        return jsonify({'result': 'success', 'token': token})
    else:
        # 검색 정보 없을 시 에러 메세지 리턴
        return jsonify({'result': 'fail', 'msg': '아이디 / 비밀번호가 일치하지 않거나 정보가 없습니다'})


# 회원 가입
@app.route('/api/register', methods=['GET', 'POST'])
def sign_up():
    # 페이지 접속 시
    if request.method == 'GET':
        return render_template('signup.html')
    # 가입 버튼 누를 시
    else:
        # 받은 유저 정보 (비밀 번호는 암호화) db에 저장
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


# 아이디 중복 확인
@app.route('/api/is_dup', methods=['POST'])
def is_dup():
    # 사용자가 적은 아이디가 유저 정보에 있는지 체크 있으면 true 없으면 false 리턴
    id_receive = request.form['id_give']
    if db.users.find_one({'id': id_receive}) is not None:
        return jsonify({'is_dup': True})
    else:
        return jsonify({'is_dup': False})

# 리스트 페이지
@app.route('/api/list_view', methods=['GET', 'POST'])
def to_listpage():
    # 리스트페이지 호출
    if request.method == 'GET':
        # 전체 칵테일 리스트 전달
        search_list = list(db.cocktails.find({}, {'_id': False}))

        # 사용자가 로그인 했는지 여부 확인. 리스트와 로그인 시 유저 정보 넘김
        try:
            token_receive = request.cookies.get('mytoken')
            payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
            id = db.users.find_one({"id": payload["id"]}, {'_id': False})
            return render_template('shop-grid.html', results=search_list, user_info=id)
        except:
            return render_template('shop-grid.html', results=search_list)

    # Sort by 분류값이 선택 되었을 경우 val_receive로 해당 값을 받음
    val_receive = request.form['val_give']

    # 전체 리스트 선택시 전체 리스트 출력
    if val_receive == '0' or isinstance(val_receive, NoneType):
        search_list = list(db.cocktails.find({}, {'_id': False}))
    # 카테고리가 있을 시 db에서 카테고리별 리스트 출력
    else:
        search_list = list(db.cocktails.find({'class': {"$regex": val_receive}}, {'_id': False}))

    # 사용자가 로그인 했는지 여부 확인. 리스트와 로그인 시 유저 정보 넘김
    try:
        token_receive = request.cookies.get('mytoken')
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        id = db.users.find_one({"id": payload["id"]}, {'_id': False})
        return jsonify({'results': search_list, 'is_login': id})
    except:
        return jsonify({'results': search_list, 'is_login': 0})


# 칵테일 상세 페이지
@app.route('/api/view', methods=['GET'])
def to_detail_page():
    # 쿼리로 받은 칵테일 이름을 통해 db 검색
    token_receive = request.cookies.get('mytoken')
    cocktail_name = request.args.get('cocktailname')
    cocktail_info = db.cocktails.find_one({'name': cocktail_name}, {'_id': False})
    try:
        # 로그인 했다면 각테일 정보, 사용자 정보를 함께 렌더링, 상세 페이지 작성 중 배열 탐색을 위해 enumerate 도 같이 넘김
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"id": payload["id"]}, {'_id': False})
        return render_template('details.html', cocktail_info=cocktail_info, enumerate=enumerate, user_info=user_info)
    except:
        # 로그인 안했다면 사용자 정보 제외
        return render_template('details.html', cocktail_info=cocktail_info, enumerate=enumerate)


# 게시글 삭제
@app.route('/api/custom_delete', methods=['DELETE'])
def delete_article():
    # 받은 아이디와 게시글 id 를 통해 db 에서 게시글 삭제
    id_receive = request.form['id_give']
    idx_receive = request.form['idx_give']

    db.cocktails.delete_one({'id': id_receive, 'idx': idx_receive})

    return jsonify({'msg': "게시글 삭제 완료"})


# 댓글 삭제
@app.route('/api/reply_delete', methods=['DELETE'])
def delete_comment():
    # 사용자 id와 칵테일 이름을 통해 db 검색 후 삭제
    name_receive = request.form['name_give']
    cocktail_name_receive = request.form['cocktail_name_give']
    db.reviews.delete_one({'name': name_receive, 'cocktail_name': cocktail_name_receive})
    db.cocktails.update_one({'name': cocktail_name_receive}, {'$pull': {'review': {'name': name_receive}}})

    return jsonify({'msg': "댓글 삭제 완료"})


# 댓글 등록
@app.route('/api/reply_write', methods=['POST'])
def write_comment():
    # 사용자 id, 칵테일 이름, 내용, 별점을 받아 칵테일 db의 리뷰에 업데이트
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


# 게시글 작성
@app.route('/api/custom_write', methods=['GET', 'POST'])
def to_write_page():
    # 게시글 작성 페이지로 들어올 시 페이지 렌더링 로그인을 안했을 시 home으로 돌려보냄
    if request.method == 'GET':
        user_info = get_user_info()
        if user_info is None:
            return render_template('index.html')
        return render_template('write.html', user_info=user_info)
    else:
        # 입력 정보를 취합 후 시간 정보를 id로 삼아 db 등록
        id_receive = request.form['id_give']
        name_receive = request.form['name_give']
        class_receive = "user_recipe"
        ingredient_receive = request.form['ingredient_give']
        method_receive = request.form['method_give']
        garnish_receive = request.form['garnish_give']
        idx = str(datetime.now())

        # 유저가 올린 이미지 파일이 있을 때 서버에 저장 후 상대 경로 저장
        if "file_give" in request.files:
            file = request.files["file_give"]
            filename = secure_filename(file.filename)
            extension = filename.split(".")[-1]
            file_path = f"pics/{name_receive}.{extension}"
            file.save("./static/" + file_path)
        else:
            filename = secure_filename("default")
            file_path = "#"

        doc = {
            "id": id_receive,
            "name": name_receive,
            "class": class_receive,
            "ingredient": ingredient_receive,
            "method": method_receive,
            "garnish": garnish_receive,
            "like": 0,
            "review": [],
            "img_name": filename,
            "imgsrc": file_path,
            "stars": [],
            "idx": idx

        }

        db.cocktails.insert_one(doc)
        return jsonify({'msg': "등록 완료!", 'result': "success"})


# 랜덤 칵테일 추천 API
@app.route('/api/randomrecommend', methods=['GET'])
def random_list():
    # db에서 리스트를 가지고 와 셔플로 랜덤리스트 발생. 좋아요 리스트 초기화
    random_list = list(db.cocktails.find({}, {'_id': False}))
    random.shuffle(random_list)
    user_like_list = ''
    try:
        # 토큰 값으로 로그인 여부 확인 후 랜덤 리스트 및 좋아요 리스트 전달
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
    # 좋아요 순으로 db 정보 가져옴
    like_list = list(db.cocktails.find({}, {'_id': False}).sort('like', -1))
    user_like_list = []
    try:
        # 로그인 했으면 그 유저의 좋아요 리스트와 함께 리턴
        token_receive = request.cookies.get('mytoken')
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"id": payload["id"]})
        user_like_list = user_info["like_list"]
        return jsonify({'result': like_list, "user_like_list": user_like_list})
    except:
        # 아닐 시 유저의 좋아요 리스트엔 빈 배열 넣어주고 리턴
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


# mypage 접근 api
@app.route('/api/mypage', methods=['GET'])
def to_my_page():
    # 클라이언트에서 토큰정보 받기
    token_receive = request.cookies.get('mytoken')
    try:

        # jwt에서 복호화 된 token 정보를 id값으로 변환
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        # 유저id값으로 db에서 유저정보 확인
        user_info = db.users.find_one({"id": payload["id"]}, {'_id': False})

        # 유저 정보를 mypage로 넘기면서, mypage.html으로 연결
        return render_template('mypage.html', user_info=user_info)

    # 토큰 인증 만료시, home함수 실행
    except jwt.ExpredSignatureError:
        return redirect(url_for("home", msg="로그인 시간이 만료되었습니다."))

    # 토큰 복호화 에러시 index.html으로 연결
    except jwt.exceptions.DecodeError:
        return render_template('index.html')


# 좋아요 리스트 출력 API
@app.route('/api/mypage/likelistup', methods=['POST'])
def my_page_list():
    # 클라이언트에서 로그인한 유저의 id값 수신
    name_receive = request.form['sample_give']

    # id 값을 키로 db에서 유저 정보 확인
    userinfo = db.users.find_one({'id': name_receive}, {'_id': False})

    # 유저 정보의 like_list에 담긴 name값을 순환
    cocktails = []
    for i in userinfo['like_list']:
        # name 값으로 db의 cocktails에서 딕셔너리 값 확인
        cocktail_dic = db.cocktails.find_one({'name': i}, {'_id': False})

        # 찾은 값을 cocktails 리스트에 넣기
        cocktails.append(cocktail_dic)

        # 리스트를 json형식으로 변환하여 발송
    return jsonify({'like_cocktails': cocktails})


# 내가 쓴 댓글 리스트 출력 API
@app.route('/api/mypage/reviewlistup', methods=['POST'])
def my_page_review_list():
    # 클라이언트에서 로그인한 유저의 id값 수신
    name_receive = request.form['name_give']

    # id값으로 db의 reviews 값에서 name에 동일한 value로 갖는 딕셔너리들을 리스트에 담아 추출
    reviews = list(db.reviews.find({'name': name_receive}, {'_id': False}))

    # 리스트를 json형식으로 변환하여 발송
    return jsonify({'all_reviews': reviews})


# 나만의레시피 출력 API
@app.route('/api/mypage/recipelistup', methods=['POST'])
def my_page_recipe_list():
    # 클라이언트에서 로그인한 유저의 id값 수신
    name_receive = request.form['name_give']

    # id값으로 db의 cocktails 값에서 동일한 값을 작성자 값으로 갖는 딕셔너리들을 리스트에 담아 추출
    cocktails = list(db.cocktails.find({'id': name_receive}, {'_id': False}))

    # 리스트를 json형식으로 변환하여 발송 
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
