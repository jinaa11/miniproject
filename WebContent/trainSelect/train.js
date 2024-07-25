$(function () {
  $('#departure').val('서울');
  $('#arrival').val('부산');

  $('.tabs .tab-btn').click(function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });

  $('#change_station img').click(function () {
    const dep_val = $('#departure').val();
    const arr_val = $('#arrival').val();
    $('#departure').val( arr_val );
    $('#arrival').val( dep_val );
  });

  //지역 선택 지도 모달 load
  $("#map_info").load("/WebContent/trainInfo/mapInfo.html", function() {});

  //인원 정보 선택 START
  // 어른
  let adult = document.getElementById('adult');
  // 기존 옵션 제거
  while (adult.firstChild) {
      adult.removeChild(adult.firstChild);
  }
  // 새로운 옵션 추가
  for (let i = 0; i <= 9; i++) {
      let option = document.createElement('option');
      option.value = i;
      option.text = '어른(만 13세 이상) ' + i + '명';
      adult.appendChild(option);
      $("#adult").val(2).attr("selected", "selected");
  }

  // 어린이
  let child1 = document.getElementById('child1');
  // 기존 옵션 제거
  while (child1.firstChild) {
      child1.removeChild(child1.firstChild);
  }
  // 새로운 옵션 추가
  for (let j = 0; j <= 9; j++) {
      let option1 = document.createElement('option');
      option1.value = j;
      option1.text = '어린이(만 6~12세 이상) ' + j + '명';
      child1.appendChild(option1);
      $("#child1").val(2).attr("selected", "selected");
  }

  // 경로
  let oldPerson = document.getElementById('oldPerson');
  // 기존 옵션 제거
  while (oldPerson.firstChild) {
    oldPerson.removeChild(oldPerson.firstChild);
  }
  // 새로운 옵션 추가
  for (let j = 0; j <= 9; j++) {
      let option2 = document.createElement('option');
      option2.value = j;
      option2.text = '경로(만 65세 이상) ' + j + '명';
      oldPerson.appendChild(option2);
  }

  // 중증장애인
  let disabledPerson = document.getElementById('disabledPerson');
  // 기존 옵션 제거
  while (disabledPerson.firstChild) {
    disabledPerson.removeChild(disabledPerson.firstChild);
  }
  // 새로운 옵션 추가
  for (let j = 0; j <= 9; j++) {
      let option1 = document.createElement('option');
      option1.value = j;
      option1.text = '중증장애인 ' + j + '명';
      disabledPerson.appendChild(option1);
  }
  //인원 정보 선택 END

});

$(function(){
  $('#stage').load('/WebContent/common/stage.html', function () {
    $(this).find('span:eq(0)').addClass('on');
    $(this).find('.fw-bold-stage').text("열차 시간 조회")
  });
  
  $('#timelst').hide();
  
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
  $('#fee').toggle();
}

function toggleTime(){
  console.log(1);
  event.preventDefault();
  $('#timelst').show();
}