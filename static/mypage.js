$(document).ready(function limitText() {
    $('.myProfile textarea').on('keyup', function limitTextarea() {
        $('.textareaCnt').text("(" + $(this).val().length + " / 50)")
        if($(this).val().length > 50) {
            $(this).val($(this).val().substring(0, 50))
            $('.textareaCnt').text("(50 / 50)")
        }
    })
})


function profileModify() {
    $('.profileFont').toggleClass('mp_hide')
    $('.has-name').toggleClass('mp_hide')
    $('.profileBtn').toggleClass('mp_hide')
    $('.modifyBtn').toggleClass('mp_hide')
    if($('.myProfile textarea').attr('disabled') == 'disabled') {
        $('.myProfile textarea').attr('disabled', false)
        $('.myProfile textarea').focus()
    }
    else {
        $('.myProfile textarea').attr('disabled', true)
    }
}

function modifyComplete() {
    let file = $('#input-pic')[0].files[0]
    let about = $(".myProfile textarea").val()
    if (file == undefined && about == ''){
        alert('프로필을 수정 후 완료 버튼을 눌러주세요!')
        return
    }

    let form_data = new FormData()
    form_data.append("file_give", file)
    form_data.append("about_give", about)

    $.ajax({
        type: "POST",
        url: "/update_profile",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response["result"] == "success") {
                alert(response["msg"])
                $('.profileFont').toggleClass('mp_hide')
                $('.has-name').toggleClass('mp_hide')
                $('.profileBtn').toggleClass('mp_hide')
                $('.modifyBtn').toggleClass('mp_hide')
                $('.myProfile textarea').attr('disabled', true)
                window.location.reload()
            }
        }
    });
}