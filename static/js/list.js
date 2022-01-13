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

        function changeLikeStatus(name) {
            const elements = document.getElementsByClassName(`${name}`);

            const countElement = elements.item(1);  // 카운트 element

            const iconElement = elements.item(0);  // 좋아요 아이콘 element

            const currentCount = countElement.innerText;
            const num = Number(currentCount);

            // const currentIcon = iconElement.classList.contains('active');

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

        function selectCate(value) {
            if (value === undefined || value === 'None') {
                value = 0
            }

            $('#item-list').empty()

            $.ajax({
                type: "POST",
                url: "/api/list_view",
                data: {val_give: value},
                success: function (response) {
                    const lists = response['results']
                    const user = response['is_login']
                    let name = ''
                    let imgsrc = ''
                    let like = ''
                    let temp_html = ''
                    console.log(user)
                    if (user === 0) {
                        for (let i = 0; i < lists.length; i++) {
                            if (lists[i]['id'] !== undefined) {
                                imgsrc = '/static/'+ lists[i]['imgsrc']
                            } else {
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
                    } else {
                        for (let i = 0; i < lists.length; i++) {
                            if (lists[i]['id'] !== undefined) {
                                imgsrc = '/static/'+ lists[i]['imgsrc']
                            } else {
                                imgsrc = lists[i]['imgsrc']
                            }
                            name = lists[i]['name']
                            like = lists[i]['like']
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
