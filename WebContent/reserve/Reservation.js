$(function() {
    const trainNumber = '101';
    var trainData; // 열차 데이터를 저장할 변수

    // AJAX로 JSON 데이터 가져오기
    $.getJSON("../json/reserve-seat.json", function(data) {
        trainData = data.KTX.find(train => train.trainNumber === trainNumber); // 101번 열차 데이터만 사용
        displaySeats(1); // 초기에 1호차 좌석 표시
    });

    // 호차 버튼 이벤트 리스너 설정
    $(".train-top-rail").click(function() {
        var coachNumber = parseInt($(this).text().replace('호차', '').trim()); // 버튼에서 호차 번호 추출
        displaySeats(coachNumber); // 선택된 호차의 좌석 표시
    });

    function displaySeats(coachNumber) {
        var coach = trainData.coaches.find(c => c.coachNumber === coachNumber); // 선택된 호차 데이터
        var container = $('#train-seats');
        container.empty(); // 기존에 표시된 좌석 제거
    
        container.append('<div class="window"></div>');
        Object.keys(coach.seats).forEach(row => {
            var rowSeats = coach.seats[row]; // 해당 줄의 좌석 수
            for (var i = 1; i <= rowSeats; i++) {
                var seatNumber = `${row}${i < 10 ? `0${i}` : i}`; // 좌석 번호 포맷팅
                var seatDiv = $(`<div class="seat p-2" id="${seatNumber}">${seatNumber}</div>`); // 좌석 div 생성
    
                // 좌석 수에 따른 스타일 조정
                if (rowSeats < 15) {
                    container.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    seatDiv.css({
                        'width': '40px' // 좌석 너비 조정
                    });
                } else {
                    container.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    seatDiv.css('margin-right', '10px'); // 기본 간격
                }
    
                container.append(seatDiv); // 컨테이너에 좌석 추가
            }
            container.append('<br>'); // 줄바꿈 추가
            if (row === 'B') {
                container.append('<br>'); // A열 다음에 줄바꿈 추가
            }
        });
        container.append('<div class="window"></div>');
    }    
});
