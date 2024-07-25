$(function () {
  $('.clsMapKtx').hide();
  $('#mapktx1').show();

  $('.route-tabs .btn-route').click(function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });

  $('.ktx-station').click(function () {
    $('#all_station_info').hide();
    $('#ktx_station_info').show();
  });

  $('.all-station').click(function () {
    $('#ktx_station_info').hide();
    $('#all_station_info').show();
  });

  // 호선 이미지 노출
  $('.route-options .btn-line').click(function () {
    let lineName = $(this).text();
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    $('.clsMapKtx').hide();

    switch (lineName) {
      case '호남선':
        $('#mapktx2').show();
        break;
      case '전라선':
        $('#mapktx4').show();
        break;
      case '경전선':
        $('#mapktx3').show();
        break;
      default:
        $('#mapktx1').show();
        break;
    }
  });

  let imageCount = 0;

  $('.station_end_map .btn').click(function () {
    imageCount ++;
  })

  // 지역 선택
  $('.ul-map-list li a').click(function () {
    const startMarkImg = '/WebContent/trainInfo/images/ic_start_dpt.png';
    const endMarkImg = '/WebContent/trainInfo/images/ic_end_dpt.png';

    if (imageCount > 1) {
      imageCount = 0;
      $('.map-mark-start').remove();
      $('.map-mark-end').remove();
    }

    $('.ul-map-list li a').each(function (index, item) {
      if (!$(item).find('.map-mark-start').length && !$(item).find('.map-mark-end').length) {
        $(item).removeClass('fixColor'); 
      }
    });

    if (imageCount == 0) {
      $(this).append('<span class="map-mark-start"><img src="'+ startMarkImg +'"></span>');
      $(this).addClass('fixColor');
      imageCount++;
    } else if (imageCount == 1) {
      if ( $(this).find('span').hasClass('map-mark-start') ) {
        $('.map-mark-start').remove();
      }
      $(this).append('<span class="map-mark-end"><img src="'+ endMarkImg +'"></span>');
      $(this).addClass('fixColor');
      imageCount++;
    }

  });

  //선택
  $('.btn-select-station').click(function () {
    if (imageCount == 0) {
      alert('출발역과 도착역을 선택해주시길 바랍니다.');
      return false;
    }

    if ($('.map-mark-start').length > 0) {
      const mark_start_val = $('.map-mark-start').parent().text();
      $("#departure").val(mark_start_val).prop("selected", true);
    }

    if ($('.map-mark-end').length > 0) {
      const mark_end_val = $('.map-mark-end').parent().text();
      $("#arrival").val(mark_end_val).prop("selected", true);
    }

    $('.map-btn-close').trigger('click');
  });

  // 모달 닫기
  $('.map-btn-close').click(function () {
    imageCount = 0;
    modal_close();
  });

  // 배경 클릭 모달 닫기
  $('#exampleModal').on('hide.bs.modal', function (e) {
    if ($(e.target).hasClass('modal')) {
      imageCount = 0;
      modal_close();
    }
  });

  function modal_close() {    
    setTimeout(() => {
      $('.map-mark-start').remove();
      $('.map-mark-end').remove();
      $('.ul-map-list li a').removeClass('fixColor');
      $('.route-options .btn-line:eq(0)').trigger('click');
    }, 200);
  }

});