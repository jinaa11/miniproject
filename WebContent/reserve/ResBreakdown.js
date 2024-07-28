$(function() {
    const trainNumber = '101';
    let userChoice = '일반실';
    let trainData; // 열차 데이터를 저장할 변수

    let cars;
    if (userChoice === '특실') {
        cars = [2, 3, 4];
    } else if (userChoice === '일반실') {
        cars = [1, 5, 6, 7, 8, 9];
    }

    $.getJSON("../json/reserve_layout.json", function(data) {
        trainData = data.KTX.find(train => train.trainNumber === trainNumber);
    });


    $.ajax({
        url: '../json/reserve-detail.json', // JSON 파일 위치
        dataType: 'json',
        success: function(data) {
            data.forEach(function(reservation) {
                var paymentHtml = '';
                var currentTime = new Date();
                var paymentDueTime = new Date(reservation.paymentDue);
                if (reservation.paymentDue && currentTime < paymentDueTime) {
                    paymentHtml = '<div>' +
                                    formatTime(reservation.paymentDue) + '까지' +  
                                  '</div>' +
                                  '<div><button class="pay-button">결제하기</button></div>';
                } else if (reservation.payment) {
                    paymentHtml = '발권완료';
                } else {
                    paymentHtml = '예약취소';
                }

                var $row = $('<tr>').append(
                    $('<td rowspan="2">').text(reservation.reservationId),
                    $('<td rowspan="2">').text(reservation.journeyType),
                    $('<td>').text(reservation.trainType),
                    $('<td>').text(reservation.departureStation),
                    $('<td>').text(reservation.arrivalStation),
                    $('<td rowspan="2">').text(reservation.ticketPrice),
                    $('<td rowspan="2">').text(reservation.ticketCount),
                    $('<td rowspan="2">').text(reservation.reservationType)
                );

                var $secondRow = $('<tr>').append(
                    $('<td>').text(reservation.trainNumber),
                    $('<td>').text(reservation.departureTime),
                    $('<td>').text(reservation.arrivalTime)
                );

                var $paymentTd = $('<td rowspan="2">').html(paymentHtml);
                $row.append($paymentTd);
                $('#seat-info').append($row, $secondRow);

                // 상세 정보 생성
                var $detailsRow = $('<tr class="details" style="display: none;">').append(
                    $('<td colspan="9">').html(createDetailsHtml(reservation))
                );
                $secondRow.after($detailsRow);

                // 예약번호(td:first-child) 클릭 이벤트를 통한 상세 정보 토글
                $row.find('td:first-child').on('click', function() {
                    $detailsRow.toggle();
                });
            });
        },
        error: function() {
            alert('Failed to retrieve reservation data.');
        }
    });

    function createDetailsHtml(reservation) {
        let passengerDetails = '';
        
        // Generate passenger details dynamically
        for (let key in reservation.passengers) {
            if (reservation.passengers.hasOwnProperty(key)) {
                passengerDetails += `<tr>
                                        <td>${reservation.passengers[key].name}</td>
                                        <td>${reservation.passengers[key].count}명</td>
                                        <td>${reservation.passengers[key].fare.toLocaleString()}원</td>
                                    </tr>`;
            }
        }
    
        // Details HTML using Bootstrap's card
        let html = `
            <div class="mt-3">
                <div>
                    <h4 class="fw-bold">예약 상세</h5>
                    <table class="table">
                        <tbody>
                            <tr><th>출발일자</th><td colspan="2">${reservation.departureDate}</td></tr>
                            <tr><th>운행시간</th><td colspan="2">${reservation.departureTime} ~ ${reservation.arrivalTime}</td></tr>
                            <tr><th>소요시간</th><td colspan="2">${reservation.duration}</td></tr>
                            <tr><th colspan="3">승객 정보</th></tr>
                            ${passengerDetails}
                            <tr><th>예매 좌석 번호</th><td class="selectSeats" colspan="2">${reservation.seats ? reservation.seats.join(', ') : 'N/A'}` + 
                            `<button id="check-seats-button" class="btn btn-light border border-3 btn-sm ms-2">좌석 확인하기</button></td></tr>`
                            + `
                        </tbody>
                    </table>
                </div>
            </div>`;
        
        return html;
    }

    $(document).on('click', '#check-seats-button', function() {
        let selectedSeats = $('.selectSeats').text().split(', ');
        selectedSeats[3] = selectedSeats[3].substring(0, 5);
        console.log(selectedSeats);
        displaySeats(selectedSeats[0].substring(0, 1), selectedSeats); // 좌석 배치도 생성 및 표시
        $('#seatModal').modal('show'); // 모달 표시
    });

    function formatTime(dateString) {
        var date = new Date(dateString);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
    }

    // 결제 버튼 이벤트
    $(document).on('click', '.pay-button', function() {
        window.location.href = '../payment/payment.html';
    });

    function displaySeats(coachNumber, selectedSeats) {
        // 선택된 호차의 좌석 정보 가져오기
        let coach = trainData.coaches.find(coach => coach.coachNumber.includes(coachNumber));
        coach = trainData.coaches[2];
        
        const container = $('#train-seats');
        const windows_1 = $('#windows-1');
        const windows_2 = $('#windows-2');
        const maxWindow = 14;
    
        // 기존 좌석 정보 삭제
        windows_1.empty();
        windows_2.empty();
        container.empty();
    
        // 최대 좌석 수와 창문 수 계산
        let maxSeats = 0;
        Object.values(coach.seats).forEach(seatArray => {
            maxSeats = Math.max(maxSeats, seatArray.length);
        });
        let numWindows = maxSeats <= maxWindow ? 7 : 8;
        let windowWidth = maxSeats <= 8 ? '140px' : '130px';
    
        // 창문 표시
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
    
        // 좌석 표시
        Object.keys(coach.seats).forEach(row => {
            coach.seats[row].forEach(seat => {
                let seatDiv;
                let seatNumber = `${row}${seat.number < 10 ? `0${seat.number}` : seat.number}`;
                if (seat.direction === 'forward') {
                    seatDiv = $(`<div class="p-2 ${seat.reserved ? 'seat-off' : 'seat'}" id="${coachNumber}-${seatNumber}">${seatNumber}</div>`);
                } else {
                    seatDiv = $(`<div class="p-2 ${seat.reserved ? 'seat-off-reverse' : 'seat-reverse'}" id="${coachNumber}-${seatNumber}">${seatNumber}</div>`);
                }

                // 예약한 좌석 표시
                if (selectedSeats.includes(`${coachNumber}-${row}0${seat.number}`)) {
                    if (seat.direction === 'forward') {
                        seatDiv.addClass('seat-blue').css('color', 'white');
                    } else {
                        seatDiv.addClass('seat-blue-reverse').css('color', 'white');
                    }
                }

                if (maxSeats === 15) {
                    if (seat.number === 9) {
                        container.append('<span class="passage">통로</span>');
                        container.append('&nbsp;');
                    } else {
                        container.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    }
                    seatDiv.css({'width': '40px'});
                } else if (maxSeats === 14) {
                    if (seat.number === 9) {
                        container.append('<span class="passage">통로</span>');
                        container.append('&nbsp;');
                    } else {
                        container.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    }
                    seatDiv.css('margin-right', '10px'); // 기본 간격
                } else {
                    container.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    container.append('&nbsp;&nbsp;&nbsp;&nbsp;');
                    
                    seatDiv.css('margin-right', '20px'); // 기본 간격
                }                

                container.append(seatDiv);

                const nbspCount = 12; // 필요한 공백 수
                const nbspString = '&nbsp;'.repeat(nbspCount); // nbsp 문자를 반복
                if (row === 'B' && seat.number === maxSeats) {
                    container.append(
                    '<div class="seat-center d-flex justify-content-evenly align-items-center">' + 
                    '<span class="loc-seat">' + $('#startLoc').text() + '</span><span style="color: #3769e5; font-weight: bold;"> ' + 
                    '> ' + nbspString + '> ' + nbspString + '> ' + nbspString + '> ' + nbspString + '> ' + nbspString + '> ' + nbspString + 
                    '> ' + nbspString + '> ' + nbspString + '> ' + nbspString + '> ' + nbspString + '> ' + nbspString + '> ' + nbspString +
                    '> ' + nbspString + '> ' + nbspString + '> ' + nbspString + '> ' + nbspString + '> ' + nbspString + '> ' + nbspString +
                    '</span>' +
                     '<span class="loc-seat">' + $('#endLoc').text() + '</span>' +
                    '</div>'); // A열 다음에 줄바꿈 추가
                } else if (seat.number === maxSeats) {
                    container.append('<br>');
                }
            });
        });
    }
});
