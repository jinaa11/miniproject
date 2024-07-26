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
