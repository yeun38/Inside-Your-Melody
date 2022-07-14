function save_reply(){
            let board_index = window.location.href
            board_index = board_index.split('posts/')[1].split('?')[0]
            let comment = $('#textarea-post').val()
            let today = new Date().toISOString()
            $.ajax({
                type: "POST",
                url: "/reply",
                data: {
                    comment_give: comment,
                    date_give: today,
                    board_index: board_index
                },
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

function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function show_reply() {
    $("#post-box").empty()
    let board_index = window.location.href
    board_index = board_index.split('posts/')[1].split('?')[0]
    console.log(board_index)
    $.ajax({
        type: "POST",
        url: "/reply_show",
        data: {board_give: board_index},
        success: function (response) {
            if(response["result"] == "success"){
                let replys = response["replys"]
                let profile_pic_real = response["profile_pic_real"]
                for (let i = 0; i < replys.length; i++) {
                    let reply = replys[i]
                    let time_post = new Date(reply["date"])
                    let time_before = time2str(time_post)
                    let class_heart = reply['heart_by_me'] ? "fa-heart": "fa-heart-o"
                    let count_heart = reply['count_heart']
                    let html_temp = `<div class="box" id="${reply["_id"]}">
                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="#">
                                                    <img class="is-rounded" src="/static/${profile_pic_real}"
                                                         alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <strong>@${reply['username']}</strong> <small>${time_before}</small>
                                                        <br>
                                                            ${reply['comment']}
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart"
                                                           onclick="toggle_like('${reply["_id"]}', 'heart')" style="margin: 0">
                                                            <span class="icon is-small"><strong style="color: red;">♥</strong></span>
                                                            <span class="like-num">${count_heart}</span>
                                                        </a>
                                                    </div>
                
                                                </nav>
                
                                            </div>
                                        </article>
                                    </div>`

                    $("#post-box").append(html_temp)
                }
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


function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    if ($i_like.hasClass("fa-heart")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(response["count"])
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass("fa-heart").removeClass("fa-heart-o")
                $a_like.find("span.like-num").text(response["count"])
            }
        })

    }
}

function getParam() {
    const url = new URL(window.location.href)
    const urlParams = url.searchParams
    const aa = urlParams.get('aa')

    $('#video').attr('src', `https://www.youtube.com/embed/${aa}`)
}

function getTime(wt) {
    let time_post = new Date(wt)
    let time_before = time2str(time_post)
    $('#wt').text('게시일: ' + `${time_before}`)
}