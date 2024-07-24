$(function() {
    const trainNumber = '101';
    let trainData; // 열차 데이터를 저장할 변수

    // AJAX로 JSON 데이터 가져오기
    $.getJSON("../json/reserve-seat-off.json", function(data) {
        trainData = data.KTX.find(train => train.trainNumber === trainNumber);
        displaySeats(1); // 초기에 1호차 좌석 표시
    });

    $('.train-top-rail').click(function() {
        // 호차 버튼 스타일 초기화
        $('.train-top-rail').css({
            'background-image': 'url(../images/reserve/scar.png)',
            'color': 'black'
        });
        $(this).css({
            'background-image': 'url(../images/reserve/scar-blue.png)',
            'color': 'white'
        });
    });

    // 호차 버튼 이벤트 리스너 설정
    $(".train-top-rail").click(function() {
        let coachNumber = parseInt($(this).text().replace('호차', '').trim()); // 버튼에서 호차 번호 추출
        displaySeats(coachNumber); // 선택된 호차의 좌석 표시
    });

    // 인원 수 증가 버튼을 누를 때의 동작
    $('.increment').click(function() {
        var count = parseInt($(this).prev('.seat-count-display').text()); // 현재 값을 가져옴
        $(this).prev('.seat-count-display').text(count + 1); // 현재 값에 1을 더해 다시 설정
    });

    // 감소 버튼을 누를 때의 동작
    $('.decrement').click(function() {
        var count = parseInt($(this).next('.seat-count-display').text()); // 현재 값을 가져옴
        if (count > 0) { // 0 이하로 내려가지 않도록 체크
            $(this).next('.seat-count-display').text(count - 1); // 현재 값에서 1을 빼고 다시 설정
        }
    });

    function displaySeats(coachNumber) {
        const coach = trainData.coaches.find(c => c.coachNumber === coachNumber); // 선택된 호차 데이터
        const container = $('#train-seats');
        const windows_1 = $('#windows-1');
        const windows_2 = $('#windows-2');
    
        // 초기화
        windows_1.empty();
        windows_2.empty();
        container.empty(); // 기존에 표시된 좌석 제거
    
        // 창문 생성 및 스타일 설정
        let maxSeats = 0; // 최대 좌석 수 초기화
        Object.values(coach.seats).forEach(seats => {
            maxSeats = Math.max(maxSeats, seats.length); // 최대 좌석 수 계산
        });

        // 창문 수와 크기 결정
        let numWindows = maxSeats < 15 ? 7 : 8; // 좌석 수에 따른 창문 수
        let windowWidth = maxSeats < 15 ? '140px' : '130px'; // 창문 크기

        for (let j = 1; j <= numWindows; j++) {
            windows_1.append('<span class="window"></span>');
            windows_2.append('<span class="window"></span>');
        }

        $('.window').css({
            'width': windowWidth,
            'height': '3px',
            'background-color': '#b0e0e6',
            'margin': '6px'
        });

        // 좌석 생성
        Object.keys(coach.seats).forEach(row => {
            coach.seats[row].forEach(seat => {
                const seatNumber = `${row}${seat.number < 10 ? `0${seat.number}` : seat.number}`;
                const seatDiv = $(`<div class="p-2 ${seat.reserved ? 'seat-off' : 'seat'}" id="${seatNumber}">${seatNumber}</div>`);

                if (maxSeats < 15) {
                    container.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    seatDiv.css({'width': '40px'});
                } else {
                    container.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    seatDiv.css('margin-right', '10px'); // 기본 간격
                }
                container.append(seatDiv);
                if (row === 'B' && seat.number === maxSeats) {
                    container.append('<br><br>'); // A열 다음에 줄바꿈 추가
                }
            });
            container.append('<br>');
        });
    }    
});
