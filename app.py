from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from googleapiclient.discovery import build

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'

import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://test:sparta@cluster0.m59gg.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

@app.route("/post", methods=["GET"])    #index.html에서 게시글작성 버튼 누르면 onclick 발동되면서 이 요청에 걸림.
def post():
    return render_template('post.html')

@app.route("/post", methods=["POST"])   #게시글 작성
def web_post_post():
    url_receive = request.form['url_give']    #서버로써 받아오는 값 3개
    comment_receive = request.form['comment_give']
    category_receive = request.form['category_give']
    aa = url_receive.split('/',4)[3]
    doc = {     #그 값3개를 doc에 딕셔너리형태로 넣고 db에 저장.
        'url': url_receive,
        'category' : category_receive,
        'comment': comment_receive,
        'like' : getlike(aa),
    }
    db.musics.insert_one(doc)
    return jsonify({'msg': '작성 완료!'})

@app.route("/musics", methods=["GET"])
def musics_get():
    music_list = list(db.musics.find({},{'_id':False}))

    return jsonify({'musics':music_list})

def getlike(aa):
    youtube = build('youtube', 'v3', developerKey='AIzaSyBYXINSpfN8PUzIbL78WWERYrjEa5MetuU')
    request = youtube.videos().list(id=aa,
                                    part='snippet, contentDetails, statistics')
    response = request.execute()

    title = response['items'][0]['snippet']['title']
    views = response['items'][0]['statistics']['viewCount']
    likes = response['items'][0]['statistics']['likeCount']
    #print(title, views, likes)
    return likes

@app.route('/')
def home():
    if(request.cookies.get('mytoken') == None):
        return render_template('index.html')
    else:
        return render_template('index.html', successLogin='success')



@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('index.html', msg=msg)

@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "username": username_receive,                               # 아이디
        "password": password_hash                                   # 비밀번호
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})


@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})

@app.route('/mypage')
def mypage():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        print(user_info)
        return render_template('mypage.html', user_info=user_info, successLogin='success')
    except jwt.ExpiredSignatureError:
        return redirect(url_for("/", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("/", msg="로그인 정보가 존재하지 않습니다."))

@app.route('/update_profile', methods=['POST'])
def save_img():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        username = payload["id"]
        about_receive = request.form["about_give"]
        new_doc = {
            "profile_info": about_receive
        }
        if 'file_give' in request.files:
            file = request.files["file_give"]
            filename = secure_filename(file.filename)
            extension = filename.split(".")[-1]
            file_path = f"profile_pics/{username}.{extension}"
            file.save("./static/"+file_path)
            new_doc["profile_pic"] = filename
            new_doc["profile_pic_real"] = file_path
        db.users.update_one({'username': payload['id']}, {'$set':new_doc})
        return jsonify({"result": "success", 'msg': '프로필을 업데이트했습니다.'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)

