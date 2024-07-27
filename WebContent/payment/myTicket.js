$(function() {
  var carouselInner = $('.carousel-inner');

  $.getJSON('/WebContent/json/payment-info.json', function(data) {
    $.each(data, function(index, item) {
      const ti = item.travelInfo;
      const payi = item.paymentInfo;

      $.each(item.passengerInfo, function(passengerIndex, pi) {
        var isActive = index === 0 && passengerIndex === 0 ? 'active' : '';

        var ticketHtml = `
          <div class="carousel-item ${isActive}">
            <div class="ticket-card">
              <div class="ticket-header">
                <h2 class="fw-bold">나의 티켓</h2>
              </div>
              <div class="ticket-date">
                <p class="date-info">${'2024.' + ti.date}</p>
              </div>
              <hr>
              <div class="ticket-details">
                <div class="ticket-section destination-section">
                  <div>
                    <p class="station-info">${ti.departureStation}</p>
                    <p class="time-info">${ti.departureTime}</p>
                  </div>
                  <img src="../images/payment/arrow.png" alt="오른쪽 화살표">
                  <div>
                    <p class="station-info">${ti.arrivalStation}</p>
                    <p class="time-info">${ti.arrivalTime}</p>
                  </div>
                </div>
                <hr>
                <div class="ticket-section">
                  <p class="train-number">${ti.trainType} ${ti.trainNumber}</p>
                </div>
                <hr>
                <div class="ticket-section table-section">
                  <div class="row">
                    <div class="col table-title">타는 곳 번호</div>
                    <div class="col table-title">호차 번호</div>
                    <div class="col table-title">좌석 번호</div>
                  </div>
                  <div class="row">
                    <div class="col table-data">
                      <img src="../images/payment/refresh.png" alt="새로고침">
                      <div>15분 전에 표시됩니다.</div>
                    </div>
                    <div class="col table-data car-number">${pi.seatInfo.split(' ')[0]}</div>
                    <div class="col table-data seat-number">${pi.seatInfo.split(' ')[1]}</div>
                  </div>
                </div>
                <hr>
                <div class="ticket-section">
                  <p>${pi.seatType} | ${pi.passengerType}</p>
                  <div class="ticket-info">
                    <div>
                      <p class="mb-0">승차권 번호</p>
                    </div>
                    <div>
                      <p class="mb-0">${pi.ticketNumber}</p>
                    </div>
                  </div>
                </div>
                <div class="ticket-footer">
                  <p>이런 서비스는 어떠세요?</p>
                  <div class="d-flex justify-content-around">
                    <div class="text-center">
                      <img src="../images/payment/alert.png" alt="철도범죄신고">
                      <p>철도범죄신고</p>
                    </div>
                    <div class="text-center">
                      <img src="../images/payment/handicap.png" alt="승하차 도우미 신청">
                      <p>승하차 도우미 신청</p>
                    </div>
                    <div class="text-center">
                      <img src="../images/payment/sms.png" alt="보호자 안심 SMS">
                      <p>보호자 안심 SMS</p>
                    </div>
                    <div class="text-center">
                      <img src="../images/payment/share.png" alt="일정공유">
                      <p>일정공유</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

        carouselInner.append(ticketHtml);
      });
    });

    // Carousel 초기화
    $('#carousel-control').carousel();
  });
});