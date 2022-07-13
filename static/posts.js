function save_reply(){
            let comment = $('#textarea-post').val()
            $.ajax({
                type: "POST",
                url: "/reply",
                data: {comment_give:comment},
                success: function (response) {
                    $("#modal-post").removeClass("is-active")
                    alert(response["msg"])
                    window.location.reload()
                }
            });
        }

$(document).ready(function () {
            show_reply();
        });

function show_reply() {
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: "/reply",
        data: {},
        success: function (response) {
                let replys = response["reply_list"]
                for (let i = 0; i < replys.length; i++) {
                    let reply = replys[i]
                    // let time_post = new Date(post["date"])
                    // let time_before = time2str(time_post)
                    let html_temp = `<div class="box" id="">
                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="#">
                                                    <img class="is-rounded" src="http://via.placeholder.com/64"
                                                         alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <strong>홍길동</strong> <small>@username</small> <small>10분 전</small>
                                                        <br>
                                                            ${reply['comment']}
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart"
                                                           onclick="toggle_like('', 'heart')">
                                                            <span class="icon is-small"><i class="fa fa-heart"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span
                                                            class="like-num">2.7k</span>
                                                        </a>
                                                    </div>
                
                                                </nav>
                
                                            </div>
                                        </article>
                                    </div>`

                    $("#post-box").append(html_temp)
                }
        }
    })
}

function send(){
            let url = "https://www.youtube.com/watch?v=93CegcGzHyY"
            let like = 135
            let comment = "코멘트입니다. 코멘트"
            $.ajax({
                type: "POST",
                url: "/send",
                data: {url_give:url, like_give:like, comment_give:comment},
                success: function (response) {
                    alert(response["msg"])
                    window.location.reload()
                }
            });
        }


