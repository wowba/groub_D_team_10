function handleClickArrowBtn(direction, order) {


    if (order === 'first') {
        const container = document.querySelector('#main-random-list');
        const next = document.querySelector('.arrow-btn.right.random');
        const prev = document.querySelector('.arrow-btn.left.random');
        if (direction === 'next' && firstNum < 3) {
            firstNum++;
            container.style.transform = `translateX(-${firstNum}00%)`;
            container.style.transition = `all .5s ease`;
        }
        if (direction === 'prev' && firstNum > 0) {
            firstNum--;
            container.style.transform = `translateX(-${firstNum}00%)`;
            container.style.transition = `all .5s ease`;
        }
        if (firstNum === 3) {
            next.style.opacity = `0`;
        } else if (firstNum === 0) {
            prev.style.opacity = `0`;
        } else {
            next.style.opacity = `1`;
            prev.style.opacity = `1`;
        }
    }
    if (order === 'second') {
        const container = document.querySelector('#main-like-list');
        const next = document.querySelector('.arrow-btn.right.like');
        const prev = document.querySelector('.arrow-btn.left.like');
        if (direction === 'next' && secondNum < 3) {
            secondNum++;
            container.style.transform = `translateX(-${secondNum}00%)`;
            container.style.transition = `all .5s ease`;
        }
        if (direction === 'prev' && secondNum > 0) {
            secondNum--;
            container.style.transform = `translateX(-${secondNum}00%)`;
            container.style.transition = `all .5s ease`;
        }
        if (secondNum === 3) {
            next.style.opacity = `0`;
        } else if (secondNum === 0) {
            prev.style.opacity = `0`;
        } else {
            next.style.opacity = `1`;
            prev.style.opacity = `1`;
        }
    }
}