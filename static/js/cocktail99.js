
// 회원 가입 시 검증을 위한 정규식
const VALID = {
    ID: /^[a-z]+[a-z0-9\-_]{4,19}$/,
    PW: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
    EMAIL: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
}

// 중복 확인 버튼을 누른 후 다시 아이디를 바꾸고 회원가입을 하는 경우를 막기 위해
// 중복 확인 버튼 클릭 시 아이디 저장하는 변수
let id_save = ''

// 회원가입 함수
function sign_up() {
    let id_box = $("#input-id-register")
    let pw_box = $("#input-password-register")
    let email_box = $("#input-email")
    let id = id_box.val()
    let pw = pw_box.val()
    let email = email_box.val()
    let check_password = $("#input-check-password").val()

    // 아이디 검사
    if (!VALID.ID.test(id)) {
        $("#help-id-register").text("아이디는 영어 소문자로 시작하는 5~20자 영문자 또는 숫자와 특수기호 (-),(_)만 사용 가능합니다!")
            .removeClass("is-hidden")
            .addClass("is-danger")
            .removeClass("is-safe")
        id_box.focus()
        return;
        // 중복 확인 여부 검사
    } else if(!$('#help-id-register').hasClass('is-check') || id_save !== id) {
        $("#help-id-register").text("중복 확인을 해주세요!").removeClass("is-hidden").addClass("is-danger").removeClass("is-safe")
        return;
        // 비밀번호 검사
    } else if (!VALID.PW.test(pw)) {
        $("#help-id-register").addClass("is-hidden")
        $("#help-pw-register").removeClass("is-hidden")
        pw_box.focus()
        return;
        // 입력한 비밀번호와 재입력한 비밀번호가 같은지 검사
    } else if (pw !== check_password) {
        $("#help-pw-register").addClass("is-hidden")
        $("#help-pw-re").removeClass("is-hidden")
        $('#input-check-password').focus()
        return;
        // 이메일 형식 검사
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
            swal("회원 가입을 축하드립니다!", "당신도 이제 칵테일 러버!")
            .then((value) => {window.location.replace('../')});
        }
    });
}

// 아이디 중복 확인 여부 검사 함수
function is_dup(id) {
    let id_box = $("#input-id-register")
    // 아이디 검사
    if (!VALID.ID.test(id)) {
        $("#help-id-register").removeClass("is-hidden")
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
            // 받은 json 데이터의 is_dup 값이 true 이면 경고 메세지 및 통과 x , false 면 id_save 에 해당 id 추가 후 통과 (is-check class 여부)
            if (response['is_dup']) {
                $("#help-id-register").text("이미 존재하는 아이디입니다!").removeClass("is-hidden").addClass("is-danger").removeClass("is-safe")
                id_box.focus()
            } else {
                $("#help-id-register").text("멋진 아이디네요!").addClass("is-safe").addClass("is-check").removeClass("is-danger").removeClass("is-hidden")
                id_save = id
            }
        }
    });
}

// 로그인 함수
function login() {
    let id = $("#input-username").val()
    let pw = $("#input-password").val()

    // 공백 확인
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
            // 로그인 성공일 시 쿠키 발급 , 아닐 시 알럿으로 실패 알림
            if (response['result'] === 'success') {
                $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace('../')
            } else {
                alert(response['msg'])
            }
        }
    });
}

// 로그아웃 함수 (쿠키 제거)
function sign_out() {
    $.removeCookie('mytoken', {path: '/'})
    window.location.href = '/'
}

// 댓글 등록 함수
function post_comment(id, comment_list) {

    // 쿠키 여부를 통해 로그인 여부 확인
    if ($.cookie('mytoken') === undefined || id === undefined) {
        swal("로그인이 필요합니다!")
        return;
    }

    // 한 유저당 한 칵테일에 리뷰 수 1개 제한을 위한 검사
    if (comment_list !== undefined) {
        for (let comment of comment_list) {
            if (comment['name'] === id) {
                swal("리뷰는 한 칵테일당 하나만 작성 가능합니다!")
                return;
            }
        }
    }

    let name = id
    let cocktail_name = $('#cocktail-name').text()
    let content = $('#write_reply_text').val()
    let stars = $('input[name=rating]:checked').val();

    // 공백 검사
    if (is_blank(content)) {
        swal("내용을 입력하세요!")
        return;
    } else if (stars === undefined) {
        swal("별점은 1개 이상 주어야 합니다!")
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
            // 성공 시 새로고침
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

    // 공백 검사
    if(is_blank(name, ingredient, method, garnish) === 1) {
        swal("이미지를 제외한 모든 내용은 필수입니다!")
        return
    }


    let form_data = new FormData()
    form_data.append("id_give", id)
    form_data.append("name_give", name)
    form_data.append("ingredient_give", ingredient)
    form_data.append("method_give", method)
    form_data.append("garnish_give", garnish)

    // 파일이 있을 시에만 form 에 넣어줌
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
                swal(response['msg'])
                .then((value) => {window.location.replace('../')});
            }
        }
    })
}

// 게시글 삭제 함수
function delete_article(user_id, cocktail_idx) {
    $.ajax({
        type: "DELETE",
        url: "/api/custom_delete",
        data: {
            id_give: user_id,
            idx_give: cocktail_idx
        },
        success: function (response) { // 성공하면
            swal(response["msg"])
            .then((value) => {window.location.replace('../')});
        }
    })
}

// 댓글 삭제 함수
function delete_comment(id, cocktail_name) {
    $.ajax({
        type: "DELETE",
        url: "/api/reply_delete",
        data: {
            name_give: id,
            cocktail_name_give: cocktail_name
        },
        success: function (response) { // 성공하면
            window.location.reload()
        }
    })
}

// 공백 검사 함수
function is_blank() {
    // 공백 검사 정규식
    let blank_pattern = '/^\\s+|\\s+$/g'

    // 들어온 파라미터들의 공백을 모두 제거했을 때 내용이 없다면 1 반환
    for (let arg of arguments) {
        if (arg.replace(blank_pattern, "") === '') {
            return 1
        }
    }
    return 0;
}

