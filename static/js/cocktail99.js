// 회원 가입
function sign_up() {
    let username = $("#input-username").val()
    let password = $("#input-password").val()
    let check_password = $("#input-check-password").val()

    if (password !== check_password) {
        alert("비밀번호 일치하지 않음")
        $('#input-check-password').focus()
        return
    }
    $.ajax({
        type: "POST",
        url: "/api/register",
        data: {
            username_give: username,
            password_give: password
        },
        success: function (response) {
            alert("회원가입을 축하드립니다!")
            window.location.replace('../')
        }
    });
}


// 로그인 함수
function login() {
            let id = $("#input-username").val()
            let pw = $("#input-password").val()

            if (id === "") {
                $("#help-id").removeClass("is-hidden")
                $("#input-username").focus()
                return;
            } else {
                $("#help-id").addClass("is-hidden")
            }

            if (pw === "") {
                $("#help-pw").removeClass("is-hidden")
                $("#input-password").focus()
                return;
            } else {
                $("#help-pw").addClass("is-hidden")
            }
            $.ajax({
                type: "POST",
                url: "/api/login",
                data: {
                    id_give: id,
                    pw_give: pw
                },
                success: function (response) {
                    if (response['result'] === 'success') {
                        $.cookie('mytoken', response['token'], {path: '/'});
                        window.location.reload()
                    } else {
                        alert(response['msg'])
                    }
                }
            });
        }

// 로그아웃 함수
function sign_out() {
    $.removeCookie('mytoken', {path: '/'})
    alert('로그아웃!')
    window.location.href = '/'
}

// 댓글 등록 함수
function post_comment(id) {

    // if ($.cookie('mytoken') === undefined) {
    //     alert("로그인이 필요합니다")
    //     return;
    // }
    let name = id
    let cocktail_name = $('#cocktail-name').text()
    let content = $('#write_reply_text').val()
    let stars = $('input[name=rating]:checked').val();
    console.log(stars)
    if (content === '') {
        alert("내용을 입력하세요!")
        return;
    } else if (stars === undefined) {
        alert("별점은 1개 이상 주어야 합니다!")
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/reply_write",
        data: {
            name_give : name,
            cocktail_name_give: cocktail_name,
            content_give: content,
            stars_give: stars
        },
        success: function (response) {
            alert(response['result'])
            window.location.reload()
        }
    })
}

