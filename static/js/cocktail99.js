const VALID = {
    ID: /^[a-z]+[a-z0-9\-_]{4,19}$/,
    PW: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
    EMAIL: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
}
let id_save = ''

function sign_up() {
    let id_box = $("#input-id")
    let pw_box = $("#input-password")
    let email_box = $("#input-email")
    let id = id_box.val()
    let pw = pw_box.val()
    let email = email_box.val()
    let check_password = $("#input-check-password").val()


    if (!VALID.ID.test(id)) {
        $("#help-id").text("아이디는 영어 소문자로 시작하는 5~20자 영문자 또는 숫자와 특수기호 (-),(_)만 사용 가능합니다!")
            .removeClass("is-hidden")
            .addClass("is-danger")
            .removeClass("is-safe")
        id_box.focus()
        return;
    } else if(!$('#help-id').hasClass('is-check') || id_save !== id) {
        $("#help-id").text("중복 확인을 해주세요!").removeClass("is-hidden").addClass("is-danger").removeClass("is-safe")
        return;
    } else if (!VALID.PW.test(pw)) {
        $("#help-id").addClass("is-hidden")
        $("#help-pw").removeClass("is-hidden")
        pw_box.focus()
        return;
    } else if (pw !== check_password) {
        $("#help-pw").addClass("is-hidden")
        $("#help-pw-re").removeClass("is-hidden")
        $('#input-check-password').focus()
        return;
    } else if (!VALID.EMAIL.test(email)) {
        $("#help-pw-re").addClass("is-hidden")
        $("#help-email").removeClass("is-hidden")
        return;
    }

    $("#help-email").addClass("is-hidden")

    $.ajax({
        type: "POST",
        url: "/api/register",
        data: {
            id_give: id,
            pw_give: pw,
            email_give: email
        },
        success: function (response) {
            alert("회원가입을 축하드립니다!")
            window.location.replace('../')
        }
    });
}

function is_dup(id) {
    let id_box = $("#input-id")
    if (!VALID.ID.test(id)) {
        $("#help-id").removeClass("is-hidden")
            .text("아이디는 영어 소문자로 시작하는 5~20자 영문자 또는 숫자와 특수기호 (-),(_)만 사용 가능합니다!")
            .addClass("is-danger")
            .removeClass("is-safe")
        id_box.focus()
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/is_dup",
        data: {
            id_give: id,
        },
        success: function (response) {
            if (response['is_dup']) {
                $("#help-id").text("이미 존재하는 아이디입니다!").removeClass("is-hidden").addClass("is-danger").removeClass("is-safe")
                id_box.focus()
            } else {
                $("#help-id").text("멋진 아이디네요!").addClass("is-safe").addClass("is-check").removeClass("is-danger").removeClass("is-hidden")
                id_save = id
            }
        }
    });
}

// 로그인 함수
function login() {
    let id = $("#input-username").val()
    let pw = $("#input-password").val()

    if (is_blank(id)) {
        $("#help-id").removeClass("is-hidden")
        $("#input-username").focus()
        return;
    } else {
        $("#help-id").addClass("is-hidden")
    }

    if (is_blank(pw)) {
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
                alert("로그인 성공!")
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
function post_comment(id, comment_list) {

    if ($.cookie('mytoken') === undefined || id === undefined) {
        alert("로그인이 필요합니다")
        return;
    }

    if (comment_list !== undefined) {
        for (let comment of comment_list) {
            if (comment['name'] === id) {
                alert("리뷰는 한 칵테일당 하나만 작성 가능합니다!")
                return;
            }
        }
    }

    let name = id
    let cocktail_name = $('#cocktail-name').text()
    let content = $('#write_reply_text').val()
    let stars = $('input[name=rating]:checked').val();

    if (is_blank(content)) {
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
            name_give: name,
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

// 게시글 등록 함수
function post_article(id) {
    let name = $('#cocktail-name').val();
    let ingredient = $('#cocktail-ingredients').val();
    let method = $('#cocktail-method').val();
    let garnish = $('#cocktail-garnish').val();
    let file = $('#cocktail-imgsrc')[0].files[0];

    if (is_blank(name, ingredient, method, garnish) === 1) {
        alert("이미지를 제외한 모든 내용은 필수입니다!")
        return
    }

    if (file === undefined || file === " ") {
        file = "#"
    }

    let form_data = new FormData()
    form_data.append("id_give", id)
    form_data.append("name_give", name)
    form_data.append("ingredient_give", ingredient)
    form_data.append("method_give", method)
    form_data.append("garnish_give", garnish)
    if (file !== undefined && file !== " ") {
        form_data.append("file_give", file)
    }



    $.ajax({
        type: "POST",
        url: "/api/custom_write",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) { // 성공하면
            if (response["result"] === "success") {
                alert(response['msg'])
                window.location.replace('../')
            }
        }
    })
}


function delete_article(user_id, cocktail_idx) {
    $.ajax({
        type: "DELETE",
        url: "/api/custom_delete",
        data: {
            id_give: user_id,
            idx_give: cocktail_idx
        },
        success: function (response) { // 성공하면
            alert(response["msg"]);
            window.location.replace('../')
        }
    })
}

function delete_comment(id, cocktail_name) {
    $.ajax({
        type: "DELETE",
        url: "/api/reply_delete",
        data: {
            name_give: id,
            cocktail_name_give: cocktail_name
        },
        success: function (response) { // 성공하면
            alert(response["msg"]);
            window.location.reload()
        }
    })
}

function is_blank() {
    let blank_pattern = '/^\\s+|\\s+$/g'

    for (let arg of arguments) {
        if (arg.replace(blank_pattern, "") === '') {
            return 1
        }
    }
    return 0;
}

function is_valid(exp, reg) {
    return reg.test(exp)
}
