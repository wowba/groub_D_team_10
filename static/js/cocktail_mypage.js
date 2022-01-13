//좋아요 리스트 요청
function likeListUp(id){

    //.card-deck 자식요소 초기화
    $(".card-deck").empty();

    //함수 인자값으로 유저id값을 받아 username에 저장
    var username = id;


    //POST로 username을 서버로 전달
    $.ajax({
        type: "POST",
        url: "/api/mypage/likelistup",
        data: {sample_give:username},
        //username값을 키 값으로, db.users['id']에 접근하여 like_list 값 수신,
        //like_list['id']값을 키 값으로, 반복문을 통해 db.cocktails에서 같은 id값을 같는 객체 목록 수신
        success: function (response) {

            //like_list를 for 반복문을 통해 순회
            let cocktaillist = response['like_cocktails']
            for (let i = 0; i < cocktaillist.length; i++) {
                //사용할 값들(imgsrc, name, cocktailclass, like, stars)을 변수에 저장
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
                //저장한 변수값과 함께, 게시할 태그를 temp_html에 넣어 저장.
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
                                                <div onclick="handleClickLike('${name}');" class="click">
                                                    <img src="/static/img/icon/suit-heart-fill.svg" class="${name} active" style="width: 20px; height: 20px"/>
                                                    <span class="${name}" style="margin-left: 5px; margin-right: 20px">${like}</span>
                                                    <span class="stars">⭐${stars}</span>
                                                </div>                                                        
                                            </div>
                                        </div>`
            //.append()내장함수로 목록 출력
            $('.card-deck').append(temp_html);


            }
        }
    })
}

// 내가 쓴 댓글 요청
function reviewListUp(id){

    //.card-deck 자식요소 초기화
    $(".card-deck").empty();

    //함수 인자값으로 유저id값을 받아 username에 저장
    var username = id;

    //POST로 username을 서버로 전달
    $.ajax({
        type: "POST",
        url: "/api/mypage/reviewlistup",
        data: {name_give: username},
        success: function (response) {

            //username값을 키 값으로, db.reviews['review']에 접근하여 review 목록 값 수신,
            let reviewlist = response['all_reviews']

            //review 목록을 for 반복문을 통해 순회
            for (let i = 0; i < reviewlist.length; i++) {
                let cocktail_name = reviewlist[i]['cocktail_name']
                let content = reviewlist[i]['content']
                let stars = reviewlist[i]['stars']

                //저장한 변수값과 함께, 게시할 태그를 temp_html에 넣어 저장.
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

                //.append()내장함수로 목록 출력
                $('.card-deck').append(temp_html);


            }
        }
    })
}



// 나의 레시피 요청
function recipeListUp(id){

    //.card-deck 자식요소 초기화
    $(".card-deck").empty();

    //함수 인자값으로 유저id값을 받아 username에 저장
    var username = id;

    //POST로 username을 서버로 전달
    $.ajax({
        type: "POST",
        url: "/api/mypage/recipelistup",
        data: {name_give:username},
        success: function (response) {

            //username값을 키 값으로, db.cocktails['id']에 접근하여, 동일한 밸류값을 가진 객체 목록 값 수신,
            let cocktaillist = response['all_cocktails']

            for (let i = 0; i < cocktaillist.length; i++) {
                console.log(cocktaillist[i])
                let name = cocktaillist[i]['id']
                const imgsrc = '/static/'+ cocktaillist[i]['imgsrc']
                let cocktailname = cocktaillist[i]['name']
                let cocktailclass = cocktaillist[i]['class']
                let like = cocktaillist[i]['like']
                let stars = cocktaillist[i]['stars']

                //저장한 변수값과 함께, 게시할 태그를 temp_html에 넣어 저장.
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

                //.append()내장함수로 목록 출력
                $('.card-deck').append(temp_html);

            }
        }
    })
}