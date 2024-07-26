$(function() {
    $.ajax({
        url: '../json/reserve-detail.json', // JSON 파일 위치
        dataType: 'json',
        success: function(data) {
            console.log(data);
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
                            <tr><th>예매 좌석 번호</th><td colspan="2">${reservation.seats ? reservation.seats.join(', ') : 'N/A'}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>`;
        
        return html;
    }

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
});
