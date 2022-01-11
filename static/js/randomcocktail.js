function randomRecommend() {
    $.ajax({
        type: "GET",
        url: "/api/randomrecommend",
        data: {},
        success: function (response) {
            const likeList = response['result']

            for (let i = 0; i < 12; i++) {
                const name = likeList[i]['name']
                const cocktail_class = likeList[i]["class"]
                const likeCount = likeList[i]['like']
                const imgsrc = likeList[i]['imgsrc']

                let temp_html =`<div class="item">
                                    <img class="card-img-top" src="${imgsrc}" alt="Card image cap">
                                        <div class="item-wrapper">
                                        
                                               <a href="/api/view?cocktailname=${name}"><div class="title">${name}</div></a>
                                            <div class="address">Recipe : ${cocktail_class}</div>
                                        </div>
                                    </div>
                                 </div>`

                $("#main-random-list").append(temp_html)
            }
        }
    })
}