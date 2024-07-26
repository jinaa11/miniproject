$(document).ready(function() {
    const departure = $('#departure');
    const arrival = $('#arrival');

    $.getJSON('/WebContent/json/station_info.json', function(data) {
        $.each(data.stations, function(index, item) {
            const start_option = $('<option></option>').val(item).text(item);
            const end_option = $('<option></option>').val(item).text(item);
            departure.append(start_option);
            arrival.append(end_option);
        });
    });

    $('.round-train_area').hide();

    // 직통/왕복/환승 클릭
    $('.dis_content_txt a').click(function () {
        $(this).siblings().removeClass('on');
        $(this).addClass('on');
        if ($(this).text() == '왕복') {
            $('.round-train_area').show();
        } else {
            $('.round-train_area').hide();
        }
    });

    let adult = document.getElementById('adult');
    // 기존 옵션 제거
    while (adult.firstChild) {
        adult.removeChild(adult.firstChild);
    }
    for (let i = 0; i <= 9; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = '어른(만 13세 이상) ' + i + '명';
        adult.appendChild(option);
        $(adult).val('1').attr('selected', true);
    }

    let child1 = document.getElementById('child1');
    // 기존 옵션 제거
    while (child1.firstChild) {
        child1.removeChild(child1.firstChild);
    }
    for (let j = 0; j <= 9; j++) {
        let option1 = document.createElement('option');
        option1.value = j;
        option1.text = '어린이(만 6~12세 이상) ' + j + '명';
        child1.appendChild(option1);
    }

    // 지역 선택 지도 모달
    $("#map_info").load("/WebContent/trainInfo/mapInfo.html", function() {});

    // 현재 시간으로 기본 설정
    let date = new Date();
    let h = date.getHours();
    $("#time").val(h).attr('selected', true);
    $("#time1").val(h).attr('selected', true);

    // 현재 날짜로 기본 설정
    let today = date.toISOString().substring(0, 10);
    $('#date').val(today);

    // 왕복시 가는 날짜는 오늘 날짜 / 오는 날짜는 하루 뒤로 기본 설정
    let newdate = new Date(date);
    newdate.setDate(newdate.getDate() + 1);
    let new_date = newdate.toISOString().substring(0, 10);
    $('#date1').val(new_date);
});
