$(function() {
    sessionStorage.clear(); // 세션 스토리지 초기화
    const trainNumber = '101';
    let trainData; // 열차 데이터를 저장할 변수

    function updateSeatDisplay() {
        // 탑승 인원 업데이트
        $('#adult').text($('#count-adult').text() + '명');
        $('#child').text($('#count-child').text() + '명');
        $('#senior').text($('#count-senior').text() + '명');
        $('#disabled').text($('#count-disabled').text() + '명');
    }

    $('.seat-btn').on('click', function() {
        // 좌석 버튼 클릭 후 딜레이를 주어 DOM 업데이트 후 값을 읽음
        setTimeout(updateSeatDisplay, 50);
    });

    $('.train-top-rail').eq(0).css({
        'background-image': 'url(../images/reserve/scar-blue.png)',
        'color': 'white'
    });

    updateSeatDisplay();

    // AJAX로 JSON 데이터 가져오기
    $.getJSON("../json/reserve-layout.json", function(data) {
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

        let coachNumber = parseInt($(this).text().replace('호차', '').trim()); // 버튼에서 호차 번호 추출
        displaySeats(coachNumber); // 선택된 호차의 좌석 표시
    });

    function updateControls(labelId, valueId) {
        sessionStorage.setItem(labelId, parseInt($(`#${valueId}`).text()));
    
        // 증가 버튼 이벤트
        $(`#${labelId} ~ .controls .increment`).click(function() {
            let count = parseInt($(`#${valueId}`).text());
            $(`#${valueId}`).text(count + 1);
            sessionStorage.setItem(labelId, count + 1); // 세션에 새 값 저장
        });
    
        // 감소 버튼 이벤트
        $(`#${labelId} ~ .controls .decrement`).click(function() {
            let count = parseInt($(`#${valueId}`).text());
            if (count > 0) {
                $(`#${valueId}`).text(count - 1);
                sessionStorage.setItem(labelId, count - 1); // 세션에 새 값 저장
                resetControls();
            }
        });
    }

    function resetControls() {
        // 선택 인원 초기화
        sessionStorage.setItem('selectedSeats', '[]');
        sessionStorage.setItem('total', 0);
        const selectedSeats = $('#selected-seats').text().split(',').map(s => s.trim());
        selectedSeats.forEach(seat => {
            $(`#${seat}`).removeClass('seat-blue').addClass('seat').css('color', 'black');
        });
        $('#selected-seats').text('');
    }

    // 각 컨트롤에 이벤트 할당
    updateControls('label-adult', 'count-adult');
    updateControls('label-child', 'count-child');
    updateControls('label-senior', 'count-senior');
    updateControls('label-disabled', 'count-disabled');    

    function displaySeats(coachNumber) {
        const coach = trainData.coaches.find(coach => coach.coachNumber === coachNumber);
        const container = $('#train-seats');
        const windows_1 = $('#windows-1');
        const windows_2 = $('#windows-2');
    
        // Empty previous contents
        windows_1.empty();
        windows_2.empty();
        container.empty();
    
        // Determine the maximum number of seats to set window and passage layout
        let maxSeats = coach.seats.reduce((max, seat) => Math.max(max, seat.number), 0);
        let numWindows = maxSeats <= 8 ? 7 : 8;
        let windowWidth = maxSeats <= 8 ? '140px' : '130px';
    
        // Append windows based on the number of seats
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
    
        // Display seats with directional and reservation information
        coach.seats.forEach(seat => {
            let seatId = `seat-${coach.coachNumber}-${seat.number}`;
            let seatClass = `seat ${seat.direction} ${seat.reserved ? 'seat-off' : ''}`;
            let seatDiv = $(`<div class="${seatClass}" id="${seatId}">${seat.number}</div>`);
    
            // Append a spacer or passage indicator based on the seat number
            if (seat.number === 8) { // Assuming passage after 8th seat as per typical layout
                container.append('<div class="passage">Passage</div>');
            }
    
            container.append(seatDiv);
        });
    }
    
    $('#train-seats').on('click', '.seat', function() {
        if (!$(this).hasClass('seat-off')) { // 예약 불가 좌석이 아닐 경우에만 동작
            let total = parseInt(sessionStorage.getItem('total') || 0); // 현재 저장된 total 값 가져오기, 없으면 0으로 초기화
    
            if ($(this).hasClass('seat-blue')) {
                // 좌석이 이미 선택된 상태이면 해제
                $(this).removeClass('seat-blue');
                $(this).css('color', 'black'); // 텍스트 색상 검은색으로 변경
                sessionStorage.setItem('total', total - 1); // total 감소
                removeSelectSessionStorage($(this).attr('id'));
            } else {
                // 선택 가능한 좌석 수와 비교
                if (calculateTotalSeats() > total) {
                    // 좌석 선택
                    $(this).addClass('seat-blue');
                    $(this).css('color', 'white'); // 텍스트 색상 하얀색으로 변경
                    sessionStorage.setItem('total', total + 1); // total 증가
                    InsertSelectSessionStorage($(this).attr('id'));
                } else {
                    const exceedModal = new bootstrap.Modal(document.getElementById('exceedLimitModal'));
                    exceedModal.show();
                }
            }
            
        }
    });

    function calculateTotalSeats() {
        let totalSeats = 0;

        // 세션 스토리지에서 모든 관련 항목 가져오기
        ['label-adult', 'label-child', 'label-senior', 'label-disabled'].forEach(item => {
            let count = parseInt(sessionStorage.getItem(item) || 0);
            totalSeats += count;
        });

        return totalSeats;
    }

    function removeSelectSessionStorage(id) {
        let selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats') || '[]');
        let index = selectedSeats.indexOf(id);
        if (index > -1) {
            selectedSeats.splice(index, 1);
        }
        sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
        $('#selected-seats').text(selectedSeats.join(', '));
    }

    function InsertSelectSessionStorage(id) {
        let selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats') || '[]');
        selectedSeats.push(id);
        sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
        $('#selected-seats').text(selectedSeats.join(', '));
    }  
    
    // 예시로 사용하기 위해 이벤트 리스너에 연결
    $('#btn-reserve').on('click', function() {
        const selectedSeats = JSON.parse(sessionStorage.getItem('total'));
    
        // 탑승 인원 데이터 수집
        const passengerData = {
            adult: parseInt($('#count-adult').text()),
            child: parseInt($('#count-child').text()),
            senior: parseInt($('#count-senior').text()),
            disabled: parseInt($('#count-disabled').text())
        };
    
        // 전체 인원 계산
        const totalPassengers = passengerData.adult + passengerData.child + passengerData.senior + passengerData.disabled;
    
        // JSON 객체 생성
        const dataToSave = {
            seats: selectedSeats,
            passengers: passengerData
        };
    
        // 인원수와 좌석 선택 수 검증
        if (selectedSeats !== totalPassengers) {
            // 모달 창을 표시
            $('#exceedLimitModal').modal('show');
            $('#exceedLimitModal .modal-body').text('선택된 좌석 수와 탑승 인원 수가 일치하지 않습니다.');
        } else {
            // JSON을 문자열로 변환하여 콘솔에 출력
            console.log(JSON.stringify(dataToSave));
    
            // 실제로 서버에 데이터를 전송할 때 사용할 코드
            // $.post('URL_TO_SEND_DATA', dataToSave, function(response) {
            //     console.log('Data saved:', response);
            // });

            window.location.href = 'reservation_complete.html';
        }
    });
    
});
