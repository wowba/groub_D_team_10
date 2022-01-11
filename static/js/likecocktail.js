function likeRecommend() {
    $.ajax({
        type: "GET",
        url: "/api/likerecommend",
        data: {},
        success: function (response) {
            const likeList = response['result']

            for (let i = 0; i < 12; i++) {
                const name = likeList[i]['name']
                const cocktail_class = likeList[i]["class"]
                const likeCount = likeList[i]['like']
                const imgsrc = likeList[i]['imgsrc']

                let temp_html =`    <div class="item">
                                        <img class="card-img-top" src="${imgsrc}" alt="Card image cap">
                                        <div class="item-wrapper">
                                            <a href="/api/view?cocktailname=${name}"><div class="title">${name}</div></a>
                                            <div class="address">Recipe : ${cocktail_class}</div>
                                            <div onclick="handleClickLike('${name}')" class="click">
                                                <img src="/static/img/icon/suit-heart-fill.svg" class="${name} active" style="width: 20px; height: 20px"/>
                                                 <span style="margin-left: 5px">${likeCount}</span>
                                            </div>
                                        </div>
                                    </div>`

                $("#main-like-list").append(temp_html)

            }
        }
    })
}