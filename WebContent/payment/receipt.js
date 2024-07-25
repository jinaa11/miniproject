$(function () {
  $.getJSON("/WebContent/json/payment-info.json", function (data) {
    console.log(data);
    $.each(data, function (index, item) {
      console.log(item.travelInfo.date);
      $(".receipt-item").eq(0).find(".item-value").text(item.travelInfo.date);
      const train = item.travelInfo.trainType + ' ' + item.travelInfo.trainNumber
      + ' | ' + item.passengerInfo[index].seatType + ' | ' + item.passengerInfo[index].seatInfo;

      $(".receipt-item").eq(1).find(".item-value").text(train);
      $(".receipt-item").eq(0).find(".item-value").text(item.travelInfo.date);
      
    });
  });
});
