$(function(){
  $('#stage').load('/WebContent/common/stage.html', function () {
    $(this).find('span:eq(3)').addClass('on');
    $(this).find('.fw-bold-stage').text("예약발매내역 반환요청")
  });
})