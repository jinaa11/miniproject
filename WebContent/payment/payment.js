let totalFare = 0; // 전체 요금을 저장할 변수

$(document).ready(function () {
  $("#stage").load("/WebContent/common/stage.html", function () {
    $(this).find(".fw-bold-stage").text("결제하기");
    $(this).find("span:eq(2)").addClass("on");
  });  

  // 현재 페이지 URL을 가져옴
  const currentPath = window.location.pathname;

  // 결제 페이지의 경우 main 함수 실행
  if (currentPath.includes("payment.html")) {
    main();
  }

  // 결제 완료 페이지의 경우 완료 함수 실행
  if (currentPath.includes("paymentCompleted.html")) {
    handlePaymentCompletion();
  }

  if(currentPath.includes("ticketIssuedDetail.html")) {
    getIssuedTickect();

  }
});

async function main() {
  const $button = $("#payment-button");

  // JSON 데이터 불러오기
  $.getJSON("/WebContent/json/payment-info.json", function (data) {
    totalFare = 0; // 전체 요금을 저장할 변수

    $.each(data, function (index, item) {
      let travel = "<tr>";
      travel += "<td>" + item.travelInfo.date + "</td>";
      travel += "<td>" + item.travelInfo.trainType + "</td>";
      travel += "<td>" + item.travelInfo.trainNumber + "</td>";
      travel += "<td>" + item.travelInfo.departureStation + "</td>";
      travel += "<td>" + item.travelInfo.arrivalStation + "</td>";
      travel += "<td>" + item.travelInfo.departureTime + "</td>";
      travel += "<td>" + item.travelInfo.arrivalTime + "</td>";
      travel += "<td>" + item.passengerInfo.length + "</td>";

      // passengerInfo 배열의 각 요금을 합산
      let travelTotalFare = item.passengerInfo.reduce((sum, passenger) => {
        return sum + parseInt(passenger.fare.replace(/[^0-9]/g, ""), 10); // 문자열을 10진수로 변환
      }, 0);
      travel += "<td>" + travelTotalFare.toLocaleString("ko-KR") + "원" + "</td>"; // 총 요금을 금액 형식으로 표시

      $("#travel-info").append(travel);

      // 전체 요금에 추가
      totalFare += travelTotalFare;

      $.each(item.passengerInfo, function (index, passenger) {
        let passengerRow = "<tr>";
        passengerRow += "<td>" + passenger.trainNumber + "</td>";
        passengerRow += "<td>" + passenger.seatType + "</td>";
        passengerRow += "<td>" + passenger.seatInfo + "</td>";
        passengerRow += '<td colspan="2">' + passenger.passengerType + "</td>";
        passengerRow += '<td colspan="2">' + parseInt(passenger.fare).toLocaleString('ko-KR') + '원' + "</td>";
        passengerRow += "<td>" + parseInt(passenger.totalFare).toLocaleString('ko-KR') + '원' + "</td>";
        passengerRow += "<td>" + passenger.passengerName + "</td>";
        passengerRow += "</tr>";

        $("#seat-info").append(passengerRow);
      });
    });

    // 전체 요금을 #payment-amount에 설정
    $("#payment-amount").text(totalFare.toLocaleString() + "원");

    // JSON 데이터 로드 후 토스 페이먼츠 API 초기화
    initializeTossPayments(totalFare);
    console.log('totalFare')
    console.log(totalFare)
    getIssuedTickect(totalFare);
  });
}

async function initializeTossPayments(totalFare) {
  console.log(totalFare)
  const $button = $("#payment-button");

  // ------ 결제위젯 초기화 ------
  const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  const tossPayments = TossPayments(clientKey);

  // 회원 결제
  const customerKey = "ekUoFjyqlAjK1hPTicP4r";
  const widgets = tossPayments.widgets({
    customerKey,
  });

  // ------ 주문의 결제 금액 설정 ------
  await widgets.setAmount({
    currency: "KRW",
    value: totalFare, // 결제 금액 설정
  });

  await Promise.all([
    // ------ 결제 UI 렌더링 ------
    widgets.renderPaymentMethods({
      selector: "#payment-method",
      variantKey: "DEFAULT",
    }),
    // ------ 이용약관 UI 렌더링 ------
    widgets.renderAgreement({
      selector: "#agreement",
      variantKey: "AGREEMENT",
    }),
  ]);

  // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
  $button.on("click", async function () {
    await widgets.requestPayment({
      orderId: "Ep2yZQD4N_0Swa_eA-v0F",
      orderName: "토스 티셔츠 외 2건",
      successUrl:
        window.location.origin + "/WebContent/payment/paymentCompleted.html",
      failUrl: window.location.origin + "/WebContent/payment/fail.html",
    });
  });

  // 취소 버튼 기능 추가
  const $cancelButton = $("#cancel-button");
  $cancelButton.on("click", function () {
    if (confirm("선택하신 승차권 예약내역을 취소하시겠습니까?") == true) {
      //확인
      // $("#removefrm").submit();
    } else {
      //취소
      return false;
    }
  });
}

// 결제 완료 후 값 받아오기
function handlePaymentCompletion() {
  $("#stage").load("/WebContent/common/stage.html", function () {
    $(this).find(".fw-bold-stage").text("결제완료");
    $(this).find("span:eq(3)").addClass("on");
  });

  const urlParams = new URLSearchParams(window.location.search);
  const amount = urlParams.get("amount");
  const date = new Date();
  const today = date.toLocaleString();

  // 결제 금액을 표의 승인 금액 <td>에 출력
  $(".amount-value").text(parseInt(amount).toLocaleString('ko-KR') + "원");
  $("#approved-amount").text(parseInt(amount).toLocaleString('ko-KR') + "원");
  $("#approved-date").text(today);

  // 발권내역 조회 버튼 클릭시
  $("#get-ticket-issued").on("click", function () {
    window.location.href = "ticketIssuedDetail.html";
  });
}

// 발권 내역 조회
function getIssuedTickect(totalFare) {
  const idKey = "USER-ID";
  const loginInfo = localStorage.getItem(idKey);

  const defaultText = $('.customer-name').text();

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
      getTicket += '<td><button class="refund-button btn btn-primary me-2">환불하기</button></td>';

      $('#issued-ticket').append(getTicket);

      $('.refund-button').on('click', function() {
        window.location.href = '/WebContent/cancel/cancel.html';  
      });
    });
  });
}