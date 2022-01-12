# # TODO 랜덤 칵테일 추천 API
# @app.route('/api/randomrecommend', methods=['GET'])
# def random_list():
#     random_list = list(db.cocktails.find({}, {'_id': False}))
#     random.shuffle(random_list)
#     try:
#         token_receive = request.cookies.get('mytoken')
#     except:
#         pass
#
#     user_like_list = ''
#
#     if token_receive is not None:
#         payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
#         user_info = db.users.find_one({"username": payload["id"]})
#         user_like_list = user_info["like_list"]
#
#     return jsonify({'result': random_list,"user_like_list":user_like_list})
#
#
# # TODO 좋아요 순 칵테일 추천 API
# @app.route('/api/likerecommend', methods=['GET'])
# def like_list():
#     like_list = list(db.cocktails.find({}, {'_id': False}).sort('like', -1))
#     try:
#         token_receive = request.cookies.get('mytoken')
#     except:
#         pass
#
#     user_like_list = ''
#
#     if token_receive is not None:
#         payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
#         user_info = db.users.find_one({"username": payload["id"]})
#         user_like_list = user_info["like_list"]
#
#     return jsonify({'result': like_list, "user_like_list": user_like_list})
#
#
# # TODO 좋아요 버튼 기능 추가
# @app.route('/api/likeclick', methods=["POST"])
# def like_click():
#     name_receive = request.form["name_give"]
#     token_receive = request.cookies.get('mytoken')
#
#     if token_receive is not None:
#
#         payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
#         user_info = db.users.find_one({"username": payload["id"]})
#         user_like_list = user_info["like_list"]
#
#         if name_receive in user_like_list:
#             db.users.update_one({"username":payload["id"]},{'$pull': {'like_list': name_receive}})
#             db.cocktails.update_one({"name":name_receive},{'$inc': {'like': -1}})
#             print("좋아요 취소")
#             return jsonify({'msg': '좋아요 취소'})
#         elif name_receive not in user_like_list:
#             db.users.update_one({"username": payload["id"]}, {'$push': {'like_list': name_receive}})
#             db.cocktails.update_one({"name": name_receive}, {'$inc': {'like': 1}})
#             print("좋아요")
#             return jsonify({'msg': '좋아요!'})
#     else:
#         print("로그인 먼저")
#         quit()