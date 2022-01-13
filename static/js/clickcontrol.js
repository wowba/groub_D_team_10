function handleClickArrowBtn(direction, order) {
    const MAX = 3 // 최대 클릭을 몇번 할 수 있는지 설정.
    
    // 메인페이지의 첫번째 줄 버튼 컨트롤
    if (order === 'first') {
        // selector로 버튼 가져오기
        const container = document.querySelector('#main-random-list');
        const next = document.querySelector('.arrow-btn.right.random');
        const prev = document.querySelector('.arrow-btn.left.random');
        // html에 let firstNUM = 0 입력.
        // transition을 사용해 버튼클릭시 넘기게 만듦.
        if (direction === 'next' && firstNum < MAX) {
            firstNum++;
            container.style.transform = `translateX(-${firstNum}00%)`;
            container.style.transition = `all .5s ease`;
        }
        if (direction === 'prev' && firstNum > 0) {
            firstNum--;
            container.style.transform = `translateX(-${firstNum}00%)`;
            container.style.transition = `all .5s ease`;
        }
        // 값에따라 버튼의 보이기 다르게.
        if (firstNum === MAX) {
            next.style.opacity = `0`;
        } else if (firstNum === 0) {
            prev.style.opacity = `0`;
        } else {
            next.style.opacity = `1`;
            prev.style.opacity = `1`;
        }
    } 
    // 메인페이지의 두번째 줄 버튼 컨트롤
    if (order === 'second') {
        const container = document.querySelector('#main-like-list');
        const next = document.querySelector('.arrow-btn.right.like');
        const prev = document.querySelector('.arrow-btn.left.like');
        // html에 let secondNUM = 0 입력.
        // transition을 사용해 버튼클릭시 넘기게 만듦.
        if (direction === 'next' && secondNum < MAX) {
            secondNum++;
            container.style.transform = `translateX(-${secondNum}00%)`;
            container.style.transition = `all .5s ease`;
        }
        if (direction === 'prev' && secondNum > 0) {
            secondNum--;
            container.style.transform = `translateX(-${secondNum}00%)`;
            container.style.transition = `all .5s ease`;
        }
        // 값에따라 버튼의 보이기 다르게.
        if (secondNum === MAX) {
            next.style.opacity = `0`;
        } else if (secondNum === 0) {
            prev.style.opacity = `0`;
        } else {
            next.style.opacity = `1`;
            prev.style.opacity = `1`;
        }
    }
}