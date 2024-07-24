$(document).ready(function() {
    let adult = document.getElementById('adult');
    // 기존 옵션 제거
    while (adult.firstChild) {
        adult.removeChild(adult.firstChild);
    }
    // 새로운 옵션 추가
    for (let i = 0; i <= 9; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = '어른(만 13세 이상) ' + i + '명';
        adult.appendChild(option);
    }

    let child1 = document.getElementById('child1');
    // 기존 옵션 제거
    while (child1.firstChild) {
        child1.removeChild(child1.firstChild);
    }
    // 새로운 옵션 추가
    for (let j = 0; j <= 9; j++) {
        let option1 = document.createElement('option');
        option1.value = j;
        option1.text = '어린이(만 6~12세 이상) ' + j + '명';
        child1.appendChild(option1);
    }
});
