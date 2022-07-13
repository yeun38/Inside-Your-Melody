from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
app = Flask(__name__)

client = MongoClient('mongodb+srv://test:sparta@cluster0.m59gg.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/post", methods=["POST"])
def web_post_post():
    url_receive = request.form['url_give']    #서버로써 받아오는 값 3개
    comment_receive = request.form['comment_give']
    category_receive = request.form['category_give']
    doc = {     #그 값3개를 doc에 딕셔너리형태로 넣고 db에 저장.
        'url': url_receive,
        'category' : category_receive,
        'comment': comment_receive,
    }
    db.musics.insert_one(doc)
    return jsonify({'msg': '작성 완료!'})

@app.route("/musics", methods=["GET"])
def musics_get():
    music_list = list(db.musics.find({},{'_id':False}))
    return jsonify({'musics':music_list})

def getviewcount():

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get('https://www.youtube.com/watch?v=CS7ZmPGixjQ', headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')
    viewcount = soup.selectOne('#formatted-snippet-text > span:nth-child(1)')
    print(viewcount)




if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)