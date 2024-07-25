$(function () {
    $('#departure').val('서울');
    $('#arrival').val('부산');

    $('.tabs .tab-btn').click(function () {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
    });

    $('#change_station img').click(function () {
      const dep_val = $('#departure').val();
      const arr_val = $('#arrival').val();
      $('#departure').val( arr_val );
      $('#arrival').val( dep_val );
    });

    //지역 선택 지도 모달 load
    $("#map_info").load("/WebContent/trainInfo/mapInfo.html", function() {});

    //인원 정보 선택 START
    // 어른
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
        $("#adult").val(2).attr("selected", "selected");
    }

    // 어린이
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
        $("#child1").val(2).attr("selected", "selected");
    }

    // 경로
    let oldPerson = document.getElementById('oldPerson');
    // 기존 옵션 제거
    while (oldPerson.firstChild) {
      oldPerson.removeChild(oldPerson.firstChild);
    }
    // 새로운 옵션 추가
    for (let j = 0; j <= 9; j++) {
        let option2 = document.createElement('option');
        option2.value = j;
        option2.text = '경로(만 65세 이상) ' + j + '명';
        oldPerson.appendChild(option2);
    }

    // 중증장애인
    let disabledPerson = document.getElementById('disabledPerson');
    // 기존 옵션 제거
    while (disabledPerson.firstChild) {
      disabledPerson.removeChild(disabledPerson.firstChild);
    }
    // 새로운 옵션 추가
    for (let j = 0; j <= 9; j++) {
        let option1 = document.createElement('option');
        option1.value = j;
        option1.text = '중증장애인 ' + j + '명';
        disabledPerson.appendChild(option1);
    }
    //인원 정보 선택 END

});