function randomRecommend() {
    $.ajax({
        type: "GET",
        url: "/api/randomrecommend",
        data: {},
        success: function (response) {
            // db에서 cocktails 가져오기
            const likeList = response['result']
            // user가 좋아요 누른 리스트 가져오기
            const userLikeList = response['user_like_list'];

            for (let i = 0; i < 12; i++) {
                // 이미지가 서버에 저장된건지 주소를 가져온건지 확인
                let imgsrc = ''
                if (likeList[i]['id'] !== undefined) {
                    imgsrc = '/static/'+ likeList[i]['imgsrc']
                } else {
                    imgsrc = likeList[i]['imgsrc']
                }
                // 칵테일 정보 가져오기
                const name = likeList[i]['name']
                const cocktail_class = likeList[i]["class"]
                const likeCount = likeList[i]['like']

                //  for문으로 반복생성 및 토큰 여부에 따라 좋아요 버튼 다르게 생성
                let temp_html = ""

                if (userLikeList.includes(name)){
                    temp_html =`    <div class="item">
                                        <img class="card-img-top" src="${imgsrc}" alt="$">
                                        <div class="item-wrapper">
                                            <a href="/api/view?cocktailname=${name}"><div class="title">${name}</div></a>
                                            <div class="address">Recipe : ${cocktail_class}</div>
                                            <div onclick="handleClickLike('${name}')" class="click">
                                                <img src="/static/img/icon/suit-heart-fill.svg" class="${name} active" style="width: 20px; height: 20px"/>
                                                <span class="${name}" style="margin-left: 5px">${likeCount}</span>
                                            </div>
                                        </div>
                                    </div>`

                } else {
                    temp_html =`    <div class="item">
                                        <img class="card-img-top" src="${imgsrc}" alt="Card image cap">
                                        <div class="item-wrapper">
                                            <a href="/api/view?cocktailname=${name}"><div class="title">${name}</div></a>
                                            <div class="address">Recipe : ${cocktail_class}</div>
                                            <div onclick="handleClickLike('${name}')" class="click">
                                                <img src="/static/img/icon/suit-heart.svg" class="${name} active" style="width: 20px; height: 20px"/>
                                                <span class="${name}" style="margin-left: 5px">${likeCount}</span>
                                            </div>
                                        </div>
                                    </div>`
                }


                // html에 붙여주기
                $("#main-random-list").append(temp_html)

            }
        }
    })
}

// 좋아요 버튼을 클릭했을 때 발생하는 함수. 버튼의 arrribute 값을 가져와 쓴다.
function handleClickLike(name) {
    $.ajax({
        type: "POST",
        url: "/api/likeclick",
        data: {name_give: name},
        success: function (response){
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