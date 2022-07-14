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



function post() {
    let url = $('#url').val()
    let category = $('#category').val()
    let comment = $('#comment').val()
    $.ajax({
        type: 'POST',
        url: '/post',
        data: {url_give: url, comment_give: comment, category_give: category},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
    console.log(url, comment)
}

$(document).ready(function () {
            show_musics();
        });

        function show_musics() {
            $('#cards-box').empty()
            $.ajax({
                type: 'GET',
                url: '/musics',
                data: {},
                success: function (response) {
                    console.log(response)
                    let rows = response['musics']
                    for (let i = 0; i < rows.length; i++) {
                        let url = rows[i]['url']
                        let comment = rows[i]['comment']
                        let like = rows[i]['like']
                        let aa = url.split('/',4)[3]
                        let temp_html = `<div class="col">
                                            <div class="card">
                                                
                                                <a href="posts.html"> <img src="https://i.ytimg.com/vi_webp/${aa}/maxresdefault.webp"
                                                                            class="card-img-top" width="300px" alt="..."> </a>
                                                <iframe width="560" height="315" src="https://www.youtube.com/embed/${aa}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                                <div class="card-body">
                                                    <h5 class="card-title">${url}</h5>
                                                    <p class="card-text">${comment}</p>
                                                    <div class ="wrap2">
                                                        <span class="material-symbols-outlined">favorite</span>
                                                        <p class="like">${like}</p>
                                                    </div>
                                                </div>
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
    if(urlParams.get('msg') != null) {
        alert(urlParams.get('msg'))
    }
}

