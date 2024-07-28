$(function () {
  let startStation = false;
  let endStation = false;

  // 출발역 위치 이미지 클릭
  $('.sta-map-start').click(function () {
    startStation = true;
  });
  $('.station_start_map').click(function () {
    startStation = true;
  });

  // 도착역 위치 이미지 클릭
  $('.sta-map-end').click(function () {
    endStation = true;
  });
  $('.station_end_map').click(function () {
    endStation = true;
  });

  $('.clsMapKtx').hide();
  $('#all_station_info').hide();
  $('#mapktx1').show(); // 경부선 기본 노출

  $('.route-tabs .btn-route').click(function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });

  // KTX 버튼 클릭 시 
  $('.ktx-station').click(function () {
    $('#all_station_info').hide();
    $('#ktx_station_info').show();
  });

  // 전체역 버튼 클릭 시
  $('.all-station').click(function () {
    $('#ktx_station_info').hide();
    $('#all_station_info').show();
  });

  // KTX 노선 이미지 노출
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

  // 도착역 지도 클릭시 도착역 이미지부터 표시하기 위해 1이 기본값
  $('.station_end_map .btn').click(function () {
    imageCount ++;
  })

  // KTX 노선 선택
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
      insert_effect();
    } else if (imageCount == 1) {
      if ($(this).find('span').hasClass('map-mark-start')) {
        $('.map-mark-start').remove();
      }
      $(this).append('<span class="map-mark-end"><img src="'+ endMarkImg +'"></span>');
      $(this).addClass('fixColor');
      insert_effect();
    }
  });

  function insert_effect() {
    $('.ul-map-list li a').find('img').css('z-index','100');
    imageCount++;
  }

  /*전체역 START*/
  // 주요역 리스트
  $.getJSON('/WebContent/json/station_basic_info.json', function(data) {
    $('.ul-ktx-station').empty();
    $.each(data.stations, function(index, item) {
        $('.ul-ktx-station').append('<li><a href="#">'+ item +'</a></li>');
    });
  });

  // 철도역 리스트
  let all_station_arr = [];
  $.getJSON('/WebContent/json/station_all_info.json', function(data) {
    $('.ul-all-station').empty();

    $.each(data.stations, function(index, item) {
        $(item).each(function (idx, res) {
          $('.ul-all-station').append('<li class="'+ index +'"><a href="#">'+ res +'</a></li>');
          $('.ul-all-station li').hide();
          $('.ul-all-station li.st1').show();
          all_station_arr.push(res);
        });
    });
  });

  // 역 검색
  $('#search_station_area').hide();
  $("#input_search_station").keyup(function() {
    let keyword = $(this).val();
    $('.search-station').remove();
    if (keyword == '') {
      $('#search_station_area').hide();
      return;
    }
    $.each(all_station_arr, function (index, item) {
      if (item.includes(keyword)) {
        $('#search_station_area').append( '<span class="search-station">'+ item +'</span>' );
        $('#search_station_area').show();
      }
    });

  });

  $('#search_station_area').hide();

  $("#input_search_station").blur(function() {
    setTimeout(() => {
      $('.search-station').remove();
      $('#search_station_area').hide();
    }, 100);
  });

  // 가~하 클릭 시 선택한 역만 노출
  $('.station-sort a').click(function () {
      let searchStation = $(this).attr("class");
      getStationName(searchStation);
  });

  function getStationName(station) {
    const selectStation = '.' + station;
    $('#station_none').remove();
    $('.ul-all-station li').each(function () {
      $(this).not('.' + station).hide();
      $('.' + station).show();
    });
    if (station == 'st4' || station == 'st11') {
      $('.ul-all-station').append('<p id="station_none">등록된 기차역이 존재하지 않습니다.</p>');
    }
  }

  /* 역 선택시 출발역/도착역 적용 */
  // 검색된 역
  $(document).on('click', '.search-station', function() {
    let station_val = $(this).text();
    select_station(station_val);
  });

  // 기본 버튼 역
  $(document).on('click', '.ul-station-info li a', function() {
    let station_val = $(this).text();
    select_station(station_val);
  });

  function select_station(station) {
    if (startStation) {
      $("#departure").val(station).prop("selected", true);
      $("#departure").val(station);
    }
    if (endStation) {
      $("#arrival").val(station).prop("selected", true);
      $("#arrival").val(station);
    }
    $('.map-btn-close').trigger('click');
    modal_close();
  }
  // 전체역 END


  // 선택 버튼 클릭 시
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
    modal_close();
  });

  // 배경 클릭 모달 닫기
  $('#exampleModal').on('hide.bs.modal', function (e) {
    if ($(e.target).hasClass('modal')) {
      modal_close();
    }
  });

  function modal_close() {
    startStation = false;
    endStation = false;
    imageCount = 0;
    $("#input_search_station").val('');
    setTimeout(() => {
      $('.map-mark-start').remove();
      $('.map-mark-end').remove();
      $('.ul-map-list li a').removeClass('fixColor');
      $('.route-options .btn-line:eq(0)').trigger('click'); // 경부선으로 초기화
    }, 200);
  }

});