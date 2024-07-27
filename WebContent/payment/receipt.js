$(function () {
  $.getJSON("/WebContent/json/payment-info.json", function (data) {
    console.log(data);
    $.each(data, function (index, item) {
      // 날짜
      $(".receipt-item").eq(0).find(".item-value").text(item.travelInfo.date);

      // 열차 정보
      const train = item.travelInfo.trainType + ' ' + item.travelInfo.trainNumber
      + ' | ' + item.passengerInfo[index].seatType + ' | ' + item.passengerInfo[index].seatInfo + ' 외 3건';
      $(".receipt-item").eq(1).find(".item-value").text(train);
      
      // 경로
      const path = item.travelInfo.departureStation + ' ' + item.travelInfo.departureTime + ' > '
                  + item.travelInfo.arrivalStation + ' ' + item.travelInfo.arrivalTime;
      $(".receipt-item").eq(2).find(".item-value").text(path);

      // 승객 타입별 수
      let adultCnt = 0;
      let childCnt = 0;

      $.each(item.passengerInfo, function(i, passenger) {
        if(passenger.passengerType === "어른") {
          adultCnt++;
        } else if(passenger.passengerType === '어린이') {
          childCnt++;
        }
      });
      $(".receipt-item").eq(3).find(".item-value").text('어른 ' + adultCnt + '매, 어린이 ' + childCnt + '매');
      // 결제방식
      $(".receipt-item").eq(4).find(".item-value").text(item.paymentInfo.paymentMethod);
      // 승인일자
      $(".receipt-item").eq(5).find(".item-value").text(item.paymentInfo.approvalDate);
      // 승인번호
      $(".receipt-item").eq(6).find(".item-value").text(item.paymentInfo.approvalNumber);
      // 결제금액
      $(".receipt-item").eq(7).find(".item-value").text(parseInt(item.paymentInfo.amount).toLocaleString('ko-KR') + '원');
      // 총 영수금액
      $(".receipt-item").eq(8).find(".item-value").text(parseInt(item.paymentInfo.amount).toLocaleString('ko-KR') + '원');
    });
  });
});

// QR 코드 생성
$(document).ready(function() {
  $.getJSON('/WebContent/json/receipt.json', function(data) {
    const qrCodeText = data.recepit.qrUrl; // QR 코드에 넣을 링크나 텍스트
    console.log(qrCodeText)
    const $qrcodeContainer = $('#qrcode');
    
    // QR 코드 생성
    // 텍스트를 QR코드로 변환하여 HTML '<canvas>' 요소에 그림
    // qrCodeText: QR코드로 변환할 텍스트, canvas: 생성된 QR코드가 그려진 '<canvas>' 요소로 QR코드를 시각적으로 표시
    QRCode.toCanvas(qrCodeText, { width: 100 }, function (error, canvas) {
        if (error) {
            console.error(error);
        } else {
          // QR코드가 성공적으로 생성
            $qrcodeContainer.append(canvas);
        }
    });
  });

   // 승차권 확인 버튼 클릭 이벤트
  $('#ticket-check').click(function() {
    window.location.href = 'myTicket.html'; // 티켓 확인 페이지로 이동
  });
});

