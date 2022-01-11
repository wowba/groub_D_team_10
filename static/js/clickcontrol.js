function handleClickArrowBtn(direction, order) {
    const MAX = 3

    if (order === 'first') {
        const container = document.querySelector('#main-random-list');
        const next = document.querySelector('.arrow-btn.right.random');
        const prev = document.querySelector('.arrow-btn.left.random');
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
        if (firstNum === MAX) {
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