function is_nickname(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}

function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

function check_dup() {
    let username = $("#input-signup-username").val()
    console.log(username)
    if (username == "") {
        $("#help-signup-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-signup-username").focus()
        return;
    }
    if (!is_nickname(username)) {
        $("#help-signup-id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-signup-username").focus()
        return;
    }
    $("#help-signup-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_dup",
        data: {
            username_give: username
        },
        success: function (response) {

            if (response["exists"]) {
                $("#help-signup-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-signup-username").focus()
            } else {
                $("#help-signup-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-signup-id").removeClass("is-loading")

        }
    });
}

function sign_up() {
    let username = $("#input-signup-username").val()
    let password = $("#input-signup-password").val()
    let password2 = $("#input-signup-password2").val()
    console.log(username, password, password2)


    if ($("#help-signup-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-signup-id").hasClass("is-success")) {
        alert("아이디 중복확인을 해주세요.")
        return;
    }

    if (password == "") {
        $("#help-signup-password").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-signup-password").focus()
        return;
    } else if (!is_password(password)) {
        $("#help-signup-password").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
        $("#input-signup-password").focus()
        return
    } else {
        $("#help-signup-password").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    }
    if (password2 == "") {
        $("#help-signup-password2").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-signup-password2").focus()
        return;
    } else if (password2 != password) {
        $("#help-signup-password2").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
        $("#input-signup-password2").focus()
        return;
    } else {
        $("#help-signup-password2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
    }
    $.ajax({
        type: "POST",
        url: "/sign_up/save",
        data: {
            username_give: username,
            password_give: password
        },
        success: function (response) {
            alert("회원가입을 축하드립니다!")
            window.location.replace("/login")
        }
    });

}

function sign_in() {
    let username = $("#input-login-username").val()
    let password = $("#input-login-password").val()

    if (username == "") {
        $("#help-login-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-login-username").focus()
        return;
    } else {
        $("#help-login-id").text("")
    }

    if (password == "") {
        $("#help-login-password").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-login-password").focus()
        return;
    } else {
        $("#help-login-password").text("")
    }
    $.ajax({
        type: "POST",
        url: "/sign_in",
        data: {
            username_give: username,
            password_give: password
        },
        success: function (response) {
            if (response['result'] == 'success') {
                $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace("/")
            } else {
                alert(response['msg'])
            }
        }
    });
}

function sign_out() {
    $.removeCookie('mytoken', {path: '/'});
    alert('로그아웃!')
    window.location.replace("/")
}

function delete_user() {
    let username = $("#input-delete-username").val()
    let password = $("#input-delete-password").val()
    let password2 = $("#input-delete-password2").val()

    if (username == "") {
        $("#help-delete-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-delete-username").focus()
        return;
    } else {
        $("#help-delete-id").text("")
    }

    if (password == "") {
        $("#help-delete-password").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-delete-password").focus()
        return;
    } else {
        $("#help-delete-password").text("")
    }
    if (password2 != password) {
        $("#help-delete-password2").text("비밀번호를 재 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-delete-password2").focus()
        return;
    } else {
        $("#help-delete-password2").text("")
    }

    $.ajax({
        type: "POST",
        url: "/delete_user",
        data: {
            username_give: username,
            password_give: password
        },
        success: function (response) {
            if (response['result'] == 'success') {
                $.removeCookie('mytoken', {path: '/'});
                alert('탈퇴가 완료되었습니다!')
                window.location.replace("/")
            } else {
                alert(response['msg'])
            }
        }
    });
}