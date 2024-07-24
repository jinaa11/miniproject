$(function(){
  $('#stage').load('/WebContent/common/stage.html', function () {
    $(this).find('span:eq(0)').addClass('on');
  });

  $.getJSON('/WebContent/json/trainTime.json', function(data){
    // $("#caption").text("출발: "+data[0].출발역+ " > 도착: " +data[0].도착역);

    $.each(data, function(index, item){
      let table = '<tr>';
      table += "<td>"+ (item.구분 ? item.구분 : "-") +"</td>";
      table += "<td><strong>" + item.열차+ "</strong></td>";
      table += "<td>"+item.출발시간+"</td>";
      table += "<td>"+item.도착시간+"</td>";
      table += "<td>"+(item.특실 == "예약 가능" ? "<strong class='highlight'>"+item.특실+ "</strong>" : item.특실)+"</td>";
      table += "<td>"+(item.일반실 == "예약 가능" ? "<strong class='highlight'>"+item.일반실+ "</strong>" : item.일반실)+"</td>";
      table += "<td> - </td>";
      table += "<td>"+ (item.자유석 == "역발매중" ? item.자유석 : item.자유석) +"</td>";
      table += "<td>"+ (item.예약대기 == "신청하기" ?"<strong class='highlight'>"+ item.예약대기+"</strong>" : item.예약대기 == "매진" ? item.예약대기 : "-") +"</td>";
      table += "<td>"+ (item.경유 ?"<strong>"+ item.경유+"</strong>" : "-") +"</td>";
      table += "<td>"+item.소요시간+"</td>";
      table += "</tr>";
      
      $('#trainList').append(table);
    });
    updateSoldOut();
    //예약 가능한 것들 클릭시 예약페이지로 이동하기
    $(document).on('click', '.highlight', function() {
      window.location.href = '/WebContent/reserve/Reservation.html';
    });
  })
  return false;
});
// 매진된 열차호실에 대해서 붉은 색을 표시하기
function updateSoldOut() {
  $('td').each(function() {
    if ($(this).text() === '매진') {
      $(this).css('color', 'red');
    }
  });
}
//-------------------------------------------------------------
$(function(){
  $.getJSON('/WebContent/json/fee_check.json', function(data){
    //해당 예매 페이지의 출발역과 도착역 표시
    $("#caption").text("출발: "+data[0].출발역+ " > 도착: " +data[0].도착역);

    $('#fee').hide();

    $.each(data, function(index, item){

      let fee = '<tr>';
      fee += "<td>운임 요금</td>";
      fee += "<td>"+item.특실어른+"</td>"
      fee += "<td>"+item.특실어린이+"</td>"
      fee += "<td>"+item.특실경로+"</td>"
      fee += "<td>"+item.일반실어른+"</td>"
      fee += "<td>"+item.일반실어린이+"</td>"
      fee += "<td>"+item.일반실경로+"</td>"
      fee += "<td>"+item.입석어른+"</td>"
      fee += "<td>"+item.입석어린이+"</td>"
      fee += "<td>"+item.입석경로+"</td>"
      fee += "</tr>";
      $('#feeList').append(fee);
    })

    //요금 , 원 표시하기
    $('#feeList td').each(function(){
      var text = $(this).text();
      // '운임 요금'이 아닌 셀의 텍스트를 처리
      if (text !== '운임 요금') {
        // 숫자인 경우 쉼표를 추가
        if (!isNaN(text)) {
          var formattedText = text.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          var formattText = formattedText + "원";
          $(this).text(formattText);
        }
      }
    });

  });
});

//운임요금 조회 토글
function toggleFee() {
  console.log(1);
  $('#fee').toggle();
}