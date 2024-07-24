window.onload = function() {
  // 현재 페이지 URL을 가져옴
  const currentPath = window.location.pathname;

  // 결제 페이지의 경우 main 함수 실행
  if (currentPath.includes('payment.html')) {
    main();
  }

  // 결제 완료 페이지의 경우 완료 함수 실행
  if (currentPath.includes('paymentCompleted.html')) {
    handlePaymentCompletion();
  }
};

async function main() {
  const button = document.getElementById("payment-button");

  // ------  결제위젯 초기화 ------
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
    value: 50000,
  });

  await Promise.all([
    // ------  결제 UI 렌더링 ------
    widgets.renderPaymentMethods({
      selector: "#payment-method",
      variantKey: "DEFAULT",
    }),
    // ------  이용약관 UI 렌더링 ------
    widgets.renderAgreement({
      selector: "#agreement",
      variantKey: "AGREEMENT",
    }),
  ]);

  // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
  button.addEventListener("click", async function() {
    await widgets.requestPayment({
      orderId: "Ep2yZQD4N_0Swa_eA-v0F",
      orderName: "토스 티셔츠 외 2건",
      successUrl: window.location.origin + "/WebContent/payment/paymentCompleted.html",
      failUrl: window.location.origin + "/WebContent/payment/fail.html",
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
      customerMobilePhone: "01012341234",
    });
  });

  // 취소 버튼 기능 추가
  const cancelButton = document.getElementById("cancel-button");
  cancelButton.addEventListener("click", function() {
    if (confirm("선택하신 승차권 예약내역을 취소하시겠습니까?") == true) {
      //확인
      // document.removefrm.submit();
    } else {
      //취소
      return false;
    }
  });
}

// 결제 완료 후 값 받아오기
function handlePaymentCompletion() {
  const urlParams = new URLSearchParams(window.location.search);
  const amount = urlParams.get("amount");
  const date = new Date();
  const today = date.toLocaleString();

  // 결제 금액을 표의 승인 금액 <td>에 출력
  document.getElementById('approved-amount').textContent = amount + '원';
  document.getElementById('approved-date').textContent = today;
}
