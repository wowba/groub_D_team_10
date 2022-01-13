// 좋아요 버튼을 클릭했을 때 발생하는 함수. 버튼의 arrribute 값을 가져와 쓴다.
function handleClickLike(name) {
    $.ajax({
        type: "POST",
        url: "/api/likeclick",
        data: {name_give: name},
        success: function (response) {
            changeLikeStatus(name)
        }
    })
}

// 좋아요 버튼을 클릭했을 시 새로고침 하지 않고도 좋아요 버튼의 모양을 바꿀 수 있게 함.
// 이 함수는 handleClickLike가 return값을 가져오지 못하면 발동되지 않는다. 비로그인 접촉 차단.
function changeLikeStatus(name) {
    // name 값을 가진 태그들을 확인
    const elements = document.getElementsByClassName(`${name}`);

    const countElement = elements.item(1);  // 카운트 element
    const iconElement = elements.item(0);  // 좋아요 아이콘 element

    const currentCount = countElement.innerText;
    const num = Number(currentCount); // 좋아요의 데이터 타입을 숫자로 변환

    // const currentIcon = iconElement.classList.contains('active');
    console.log(countElement)
    const currentIcon = iconElement.getAttribute('src') === '/static/img/icon/suit-heart.svg';


    // console.log(currentIcon)
    // 현재 아이콘의 상태에 따라 발동되는 함수가 다름.
    if (currentIcon) {
        countElement.innerText = (num + 1).toString();
        iconElement.setAttribute('src', '/static/img/icon/suit-heart-fill.svg');
    } else {
        countElement.innerText = (num - 1).toString();
        iconElement.setAttribute('src', '/static/img/icon/suit-heart.svg');
    }
}

// 리스트 페이지의 sort by 분류 시, 카테고리에 맞는 리스트를 출력하는 기능
// value : shop-grid.html 의 select 태그 옵션 값
function selectCate(value) {
    // 옵션 값이 정해지지 않았을 때 (리스트 페이지로 처음 접속 시) 전체 옵션과 같은 값인 0으로 설정
    if (value === undefined || value === 'None') {
        value = 0
    }

    $('#item-list').empty()

    // value 값을 post로 전달해서 db에서 리스트와 유저 정보를 가져옴
    $.ajax({
        type: "POST",
        url: "/api/list_view",
        data: {val_give: value},
        success: function (response) {
            // results와 is_login를 app.py에서 가져옴
            const lists = response['results']
            const user = response['is_login']
            let name = ''
            let imgsrc = ''
            let like = ''
            let temp_html = ''
            console.log(user)
            // 비로그인으로 접속
            if (user === 0) {
                for (let i = 0; i < lists.length; i++) {
                    // 유저가 작성한 레시피가 아닐 때 (기본 레시피) 이미지 static으로 경로 설정 추가
                    if (lists[i]['id'] !== undefined) {
                        imgsrc = '/static/' + lists[i]['imgsrc']
                    } else {
                        // 유저가 작성한 이미지
                        imgsrc = lists[i]['imgsrc']
                    }
                    name = lists[i]['name']
                    like = lists[i]['like']

                    temp_html = `
                                            <div class="col-lg-4 col-md-6 col-sm-6">
                                            <div class="product__item">
                                                <div class="product__item__pic set-bg">
                                                    <img src="${imgsrc}" alt="${imgsrc}"/>
                                                    <ul class="product__item__pic__hover">
                                                        <div onclick="handleClickLike('${name}')" class="click" style="margin-left: 15px">
                                                            <img src="/static/img/icon/suit-heart.svg" class="${name} active" style="width: 40px; height: 40px"/>
                                                            <span class="${name}" style="margin-left: 5px">${like}</span>
                                                        </div>
                                                    </ul>
                                                </div>
                                                <div class="product__item__text">
                                                    <h6>
                                                        <a href="/api/view?cocktailname=${name}" onclick="">${name}</a>
                                                    </h6>
                                            </div>
                                        </div>
                                            `
                    $('#item-list').append(temp_html)
                }
                // 로그인으로 접속했을 때
            } else {
                for (let i = 0; i < lists.length; i++) {
                    // 유저가 작성한 레시피가 아닐 때 (기본 레시피) 이미지 static으로 경로 설정 추가
                    if (lists[i]['id'] !== undefined) {
                        imgsrc = '/static/' + lists[i]['imgsrc']
                    } else {
                        // 유저가 작성한 이미지
                        imgsrc = lists[i]['imgsrc']
                    }
                    name = lists[i]['name']
                    like = lists[i]['like']
                    // 유저가 좋아요 한 리스트가 있을 경우
                    if (name in user['like_list']) {
                        temp_html = `
                                            <div class="col-lg-4 col-md-6 col-sm-6">
                                            <div class="product__item">
                                                <div class="product__item__pic set-bg">
                                                    <img src="${imgsrc}"/>
                                                    <ul class="product__item__pic__hover">
                                                        <div onclick="handleClickLike('${name}')" class="click" style="margin-left: 15px">
                                                            <img src="/static/img/icon/suit-heart-fill.svg" class="${name} active" style="width: 40px; height: 40px; "/>
                                                            <span class="${name}" style="margin-left: 5px">${like}</span>
                                                        </div>
                                                    </ul>
                                                </div>
                                                <div class="product__item__text">
                                                    <h6>
                                                        <a href="/api/view?cocktailname=${name}" onclick="">${name}</a>
                                                    </h6>
                                            </div>
                                        </div>
                                            `
                        $('#item-list').append(temp_html)
                        // 유저가 좋아요 한 리스트가 없을 경우
                    } else {
                        temp_html = `
                                            <div class="col-lg-4 col-md-6 col-sm-6">
                                            <div class="product__item">
                                                <div class="product__item__pic set-bg">
                                                    <img src="${imgsrc}"/>
                                                    <ul class="product__item__pic__hover">
                                                        <div onclick="handleClickLike('${name}')" class="click" style="margin-left: 15px">
                                                            <img src="/static/img/icon/suit-heart.svg" class="${name} active" style="width: 40px; height: 40px"/>
                                                            <span class="${name}" style="margin-left: 5px">${like}</span>
                                                        </div>
                                                    </ul>
                                                </div>
                                                <div class="product__item__text">
                                                    <h6>
                                                        <a href="/api/view?cocktailname=${name}" onclick="">${name}</a>
                                                    </h6>
                                            </div>
                                        </div>
                                            `
                        $('#item-list').append(temp_html)
                    }
                }
            }
        }
    })
}
