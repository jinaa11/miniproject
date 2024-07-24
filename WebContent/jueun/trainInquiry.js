$(function(){
  $.getJSON('/WebContent/json/trainTime.json', function(data){
    $("#caption").text("출발: "+data[0].출발역+ " > 도착: " +data[0].도착역);

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

    $(document).on('click', '.highlight', function() {
      window.location.href = '/WebContent/main.html';
    });
  })
  return false;
})

function updateSoldOut() {
  $('td').each(function() {
    if ($(this).text() === '매진') {
      $(this).css('color', 'red');
    }
  });
}