$(function() {
    $.ajax({
        url: '../json/reserve-break.json', // JSON 파일 위치
        dataType: 'json',
        success: function(data) {
            data.forEach(function(reservation) {
                var paymentHtml = '';
                var currentTime = new Date();
                var paymentDueTime = new Date(reservation.paymentDue);
                console.log(currentTime, paymentDueTime);
                if (reservation.paymentDue && currentTime < paymentDueTime) {
                    paymentHtml = '<div>' +
                                    formatTime(reservation.paymentDue) + '까지' +  
                                  '</div>' +
                                  '<div><button id="pay-button">결제하기</button></div>';
                } else if (reservation.payment) {
                    paymentHtml = '발권완료';
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
            });
        },
        error: function() {
            alert('Failed to retrieve reservation data.');
        }
    });

    // 예약 파기 시간 가져오기
    let expiryTime = new Date($('#payment-status').data('expiry')).getTime();
    let currentTime = new Date().getTime();

    // 예약 파기 시간이 지났으면 예약 취소 처리
    if (currentTime > expiryTime) {
        $('#payment-status').html('예약취소').addClass('expired');
        $('#pay-button').remove();
    } else {
        // 타이머 설정으로 실시간 업데이트 (비동기 처리)
        let timer = setInterval(function() {
            currentTime = new Date().getTime();
            if (currentTime > expiryTime) {
                $('#payment-status').html('예약취소').addClass('expired');
                $('#pay-button').remove();
                clearInterval(timer);
            }
        }, 60000);
    }

    function formatTime(dateString) {
        var date = new Date(dateString); // 문자열을 Date 객체로 변환
        console.log(date); // 디버그를 위한 로그
    
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
    
        return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
    }
});