function likeRecommend() {
    $.ajax({
        type: "GET",
        url: "/api/likerecommend",
        data: {},
        success: function (response) {
            const likeList = response['result']
            const userLikeList = response['user_like_list'];

            for (let i = 0; i < 12; i++) {
                const name = likeList[i]['name']
                const cocktail_class = likeList[i]["class"]
                const likeCount = likeList[i]['like']
                const imgsrc = likeList[i]['imgsrc']

                let temp_html = ""

                if (userLikeList.includes(name)){
                    temp_html =`    <div class="item">
                                        <img class="card-img-top" src="${imgsrc}" alt="Card image cap">
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
                $("#main-like-list").append(temp_html)

            }
        }
    })
}

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

function changeLikeStatus(name) {
    const elements = document.getElementsByClassName(`${name}`);

    const countElement = elements.item(1);  // 카운트 element
    const iconElement = elements.item(0);  // 좋아요 아이콘 element

    const currentCount = countElement.innerText;
    const num = Number(currentCount);

    // const currentIcon = iconElement.classList.contains('active');
    console.log(countElement)
    const currentIcon = iconElement.getAttribute('src') === '/static/img/icon/suit-heart.svg';


    // console.log(currentIcon)

    if (currentIcon) {
        countElement.innerText = (num + 1).toString();
        iconElement.setAttribute('src', '/static/img/icon/suit-heart-fill.svg');
    } else {
        countElement.innerText = (num - 1).toString();
        iconElement.setAttribute('src', '/static/img/icon/suit-heart.svg');
    }
}
