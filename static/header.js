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
    }
)
