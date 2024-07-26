$(function() {
  $.getJSON('/WebContent/json/payment-info.json', function(data) {
    $.each(data, function(index, item) {
      const ti = item.travelInfo;
      const pi = item.passengerInfo;
      const payi = item.paymentInfo;

      $('.station-info').eq(0).text(ti.departureStation);
      $('.station-info').eq(1).text(ti.arrivalStation);

      $('.time-info').eq(0).text(ti.departureTime);
      $('.time-info').eq(1).text(ti.arrivalTime);

      $('.train-number').text(ti.trainType + ' ' + ti.trainNumber);

      $('.car-number').text(pi[index].seatInfo.split(' ')[0]);
      $('.seat-number').text(pi[index].seatInfo.split(' ')[1]);

      $('.ticket-section > p').eq(1).text(pi[index].seatType + ' | ' + pi[index].passengerType);
      $('.ticket-info').find('p').eq(1).text(payi.ticketNumber);

      $('.date-info').text('2024.' + ti.date);
    });
  });
}); 