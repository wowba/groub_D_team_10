// 로그인 함수
function login() {
            let username = $("#input-username").val()
            let password = $("#input-password").val()

            if (username === "") {
                $("#help-id").removeClass("is-hidden")
                $("#input-username").focus()
                return;
            } else {
                $("#help-id").addClass("is-hidden")
            }

            if (password === "") {
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
                    username_give: username,
                    password_give: password
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