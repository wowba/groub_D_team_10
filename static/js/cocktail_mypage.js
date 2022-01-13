//좋아요 리스트 요청
function likeListUp(id){
        $(".card-deck").empty();
            var username = id;
            $.ajax({
                type: "POST",
                url: "/api/mypage/likelistup",
                data: {sample_give:username},
                success: function (response) {
                    let cocktaillist = response['like_cocktails']
                    for (let i = 0; i < cocktaillist.length; i++) {
                        let imgsrc = ''
                        if (cocktaillist[i]['id'] !== undefined) {
                            imgsrc = '/static/'+ cocktaillist[i]['imgsrc']
                        } else {
                            imgsrc = cocktaillist[i]['imgsrc']
                        }
                        let name = cocktaillist[i]['name']
                        let cocktailclass = cocktaillist[i]['class']
                        let like = cocktaillist[i]['like']
                        let stars = cocktaillist[i]['stars']

                        let temp_html = `
                                                <div class="card">
                                                  <div style="height:350px" class="card-img-box">
                                                  <img class="card-img-top"  src="${imgsrc}" alt="Card image cap">
                                                  </div>
                                                    <div class="card-body" style="padding:20px">
                                                        <h5 class="card-title">${name}</h5>
                                                        <p class="card-text reply-content">${cocktailclass}</p>
                                                    </div>
                                                    <div class="card-footer">
                                                        <span class="like">${like}</span>
                                                        <span class="stars">⭐${stars}</span>
                                                    </div>
                                                </div>`

                    $('.card-deck').append(temp_html);


                }
            }
        })
}

// 내가 쓴 댓글 요청
function reviewListUp(id){
        $(".card-deck").empty();
            var username = id;

    $.ajax({
        type: "POST",
        url: "/api/mypage/reviewlistup",
        data: {name_give:username},
        success: function (response) {
            let reviewlist = response['all_reviews']


            for (let i = 0; i < reviewlist.length; i++) {
                let cocktail_name = reviewlist[i]['cocktail_name']
                let content = reviewlist[i]['content']
                let stars = reviewlist[i]['stars']

                let temp_html = `
                                                <div class="card">
                                                    <div class="review-box style="padding:20px">
                                                        <h5 class="card-title">${cocktail_name}</h5>
                                                        <p class="card-text reply-content">Comment : ${content}</p>
                                                    </div>
                                                    <div class="card-footer">
                                                        <span class="like"><img src="/static/img/icon/suit-heart.svg" class="Dry Martini active" style="width: 20px; height: 20px"></span>
                                                        <span class="stars">⭐${stars}</span>
                                                    </div>
                                                </div>`

                    $('.card-deck').append(temp_html);


                }
            }
        })
}



// 나의 레시피 요청

function recipeListUp(id){
        $(".card-deck").empty();
            var username = id;


    $.ajax({
        type: "POST",
        url: "/api/mypage/recipelistup",
        data: {name_give:username},
        success: function (response) {
            let cocktaillist = response['all_cocktails']

            for (let i = 0; i < cocktaillist.length; i++) {
                console.log(cocktaillist[i])
                let name = cocktaillist[i]['id']
                const imgsrc = '/static/'+ cocktaillist[i]['imgsrc']
                let cocktailname = cocktaillist[i]['name']
                let cocktailclass = cocktaillist[i]['class']
                let like = cocktaillist[i]['like']
                let stars = cocktaillist[i]['stars']

                let temp_html = `
                                                <div class="card">
                                                  <div style="height:350px" class="card-img-box">
                                                  <img class="card-img-top"  src="${imgsrc}" alt="Card image cap">
                                                  </div>
                                                    <div class="card-body">
                                                    <a href="/api/view?cocktailname=${cocktailname}">
                                                        <h5 class="card-title">${cocktailname}</h5>
                                                        <p class="card-text reply-content">${cocktailclass}</p>
                                                    </a>
                                                    </div>
                                                    <div class="card-footer">
                                                        <span class="like"><img src="/static/img/icon/suit-heart.svg" class="Dry Martini active" style="width: 20px; height: 20px"> ${like}</span>
                                                        <span class="stars">⭐${stars}</span>
                                                    </div>
                                                </div>`

                if (username === name) {
                    $('.card-deck').append(temp_html);
                    }


                }
            }
        })
}