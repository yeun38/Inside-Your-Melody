msgCheck()
$(document).ready(
    function animated() {
        for (i = 0; i < $('.icos').length; i++) {
            let target = $('.icos')[i]
            let url = $(target).css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');
            url = url.split(window.origin)[1].split('.')[0]
            target.addEventListener('mouseover', function move() {
                let newUrl = '../' + url + '.gif'
                $(target).css('background-image', 'url(' + newUrl + ')')
            })
            target.addEventListener('mouseout', function hold() {
                let newUrl = '../' + url + '.png'
                $(target).css('background-image', 'url(' + newUrl + ')')
            })
        }
    },
)
$(document).ready(function () {
    show_musics();
});

function post(username) {
    let url = $('#url').val()
    let category = $('#category').val()
    let comment = $('#comment').val()
    if (url == '' || category == '--선택하기--' || comment == '') {
        alert('URL, 코멘트 입력 혹은 카테고리를 선택해주세요')
        return
    }
    let today = new Date().toISOString()
    $.ajax({
        type: 'POST',
        url: '/post',
        data: {
            url_give: url,
            comment_give: comment,
            category_give: category,
            username_give: username,
            today_give: today
        },
        success: function (response) {
            alert(response['msg'])
            window.location.replace('/')
        }
    });
}

function show_musics(category) {
    if (category == undefined) {
        category = 0
    }
    switch (category) {
        case 0 :
            removeBan()
            $('.bannerImg').addClass('bannerTotal')
            $('.bannerImg').text('#전체보기')
            break
        case 1 :
            removeBan()
            $('.bannerImg').addClass('bannerRain')
            $('.bannerImg').text('#비오는 날')
            break
        case 2 :
            removeBan()
            $('.bannerImg').addClass('bannerStudy')
            $('.bannerImg').text('#공부할 때')
            break
        case 3 :
            removeBan()
            $('.bannerImg').addClass('bannerHealth')
            $('.bannerImg').text('#운동할 때')
            break
        case 4 :
            removeBan()
            $('.bannerImg').addClass('bannerSleep')
            $('.bannerImg').text('#잠들기 전')
            break
    }
    $('#cards-box').empty()
    $.ajax({
        type: 'GET',
        url: `/musics/${category}`,
        data: {},
        success: function (response) {
            let rows = response['musics']
            for (let i = 0; i < rows.length; i++) {
                let url = rows[i]['url']
                let comment = rows[i]['comment']
                let like = rows[i]['like']
                let temp_html = `<div class="col">
                                            <div class="card">
                                                <a href="#"><img src="../static/profile_pics/default.jpg">
                                                <div class="card-body">
                                                    <h5 class="card-title">${url}</h5>
                                                    <p class="card-text">${comment}</p>
                                                    <span class="material-symbols-outlined">favorite</span>
                                                    <p class="like">${like}</p>
                                                </div>
                                                 </a>
                                            </div>
                                        </div>`
                $('#cards-box').append(temp_html)
            }
        }
    });
}

function msgCheck() {
    const url = new URL(window.location.href)
    const urlParams = url.searchParams
    if (urlParams.get('msg') != null) {
        alert(urlParams.get('msg'))
    }
}

function removeBan() {
    $('.bannerImg').removeClass('bannerTotal')
    $('.bannerImg').removeClass('bannerRain')
    $('.bannerImg').removeClass('bannerStudy')
    $('.bannerImg').removeClass('bannerHealth')
    $('.bannerImg').removeClass('bannerSleep')
}
