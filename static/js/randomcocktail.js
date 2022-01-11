function randomRecommend() {
    $.ajax({
        type: "GET",
        url: "/api/randomrecommend",
        data: {},
        success: function (response) {
            const likeList = response['result']

            for (let i = 0; i < 9; i++) {
                const name = likeList[i]['name']
                // const stars = likeList[i]['stars']
                const likeCount = likeList[i]['like']
                const imgsrc = likeList[i]['imgsrc']

                let temp_html =`<div class="item">
                                    <img class="card-img-top" src="${imgsrc}" alt="Card image cap">
                                        <div class="item-wrapper">
                                            <div class="title">${name}</div>
                                            <div class="address">좋아요: ${likeCount}</div>
                                        </div>
                                    </div>
                                 </div>`

                $("#main-random-list").append(temp_html)
            }
        }
    })
}