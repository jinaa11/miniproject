// 발권 내역 조회
$(function() {
  const idKey = "USER-ID";
  const loginInfo = localStorage.getItem(idKey);

  console.log(loginInfo);
  const defaultText = $('.customer-name').text();
  console.log(defaultText);
  $('.customer-name').text(loginInfo + ' ' + defaultText);
  $.getJSON("/WebContent/json/payment-info.json", function (data) {
    $.each(data, function (index, item) {
      let getTicket = "<tr>";
      getTicket += '<td><input type="radio" name="select-ticket" value="' + index + '"></td>';
      getTicket += '<td>편도</td>';
      getTicket += '<td>' + item.travelInfo.date + '</td>';
      getTicket += '<td>' + item.travelInfo.trainType + '<br>' + item.travelInfo.trainNumber + '</td>';
      getTicket += '<td>' + item.travelInfo.departureStation + '<br>' + item.travelInfo.departureTime + '</td>';
      getTicket += '<td>' + item.travelInfo.arrivalStation + '<br>' + item.travelInfo.arrivalTime + '</td>';
      getTicket += '<td>' + totalFare + '</td>';
      getTicket += '<td>' + item.passengerInfo.length + '</td>';
      getTicket += '<td>' + item.passengerInfo[index].seatType + '</td>';
      getTicket += '<td>결제완료</td>';
      getTicket += '<td>발권완료</td>';
      getTicket += '<td><button class="refund-button btn btn-primary me-2">환불하기</button></td>'

      $('#issued-ticket').append(getTicket);

      $('.refund-button').on('click', function() {
        window.location.href = '/WebContent/cancel/cancel.html';  
      });
    });
  });
});