$(document).ready(function() {
    const departure = $('#departure');
    const arrival = $('#arrival');

    $.getJSON('/WebContent/json/station_info.json', function(data) {
        $.each(data.stations, function(index, item) {
            let start_option = $('<option></option>').val(item).text(item);
            let end_option = $('<option></option>').val(item).text(item);
            departure.append(start_option);
            arrival.append(end_option);
        });
    });

    $('.round-train_area').hide();

    // 직통/왕복/환승 클릭
    $('.dis_content_txt a').click(function () {
        $(this).siblings().removeClass('on');
        $(this).addClass('on');
        if ($(this).text() == '왕복') {
            $('.round-train_area').show();
        } else {
            $('.round-train_area').hide();
        }
    });

    let adult = document.getElementById('adult');
    // 기존 옵션 제거
    while (adult.firstChild) {
        adult.removeChild(adult.firstChild);
    }
    for (let i = 0; i <= 9; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = '어른(만 13세 이상) ' + i + '명';
        adult.appendChild(option);
        $(adult).val('1').attr('selected', true);
    }

    let child1 = document.getElementById('child1');
    // 기존 옵션 제거
    while (child1.firstChild) {
        child1.removeChild(child1.firstChild);
    }
    for (let j = 0; j <= 9; j++) {
        let option1 = document.createElement('option');
        option1.value = j;
        option1.text = '어린이(만 6~12세 이상) ' + j + '명';
        child1.appendChild(option1);
    }

    // 지역 선택 지도 모달
    $("#map_info").load("/WebContent/trainInfo/mapInfo.html", function() {});

    // 현재 시간으로 기본 설정
    let date = new Date();
    let h = date.getHours();
    $("#time").val(h).attr('selected', true);
    $("#time1").val(h).attr('selected', true);

    // 현재 날짜로 기본 설정
    let today = date.toISOString().substring(0, 10);
    $('#date').val(today);

    // 왕복시 가는 날짜는 오늘 날짜 / 오는 날짜는 하루 뒤로 기본 설정
    let newdate = new Date(date);
    newdate.setDate(newdate.getDate() + 1);
    let new_date = newdate.toISOString().substring(0, 10);
    $('#date1').val(new_date);



    // 경상권 버튼 클릭 시 모달 열기
  $('.btn-container a').on('click', function(e) {
    e.preventDefault();
    if ($(this).find('.btn-text').text() === '경상권') {
        // JSON 데이터를 가져와서 리스트에 바인딩
        $.getJSON('/WebContent/json/package.json', function(data) {
            var packageList = $('#packageList');
          packageList.empty(); // 기존 내용 삭제
          $.each(data, function(index, item) {

              var listItem = `
                <a href="#" class="list-group-item list-group-item-action">
                  <div class="d-flex w-100">
                    <img src="${item.image}" class="img-thumbnail" alt="${item.title}">
                    <small id="Map" style="display:none;">${item.map}</small>
                    <small id="main" style="display:none;">${item.image}</small>
                    <div class="ms-3">
                      <h5 class="mb-1">${item.city} : ${item.title}</h5>
                      <p class="mb-1">${item.content}</p>
                      <strong>${item.pay}</strong>
                    </div>
                  </div>
                </a>`;
              packageList.append(listItem);
          });
          $('#packageModal').modal('show');
        // 리스트 항목에 hover 이벤트 추가
        $('.list-group-item').hover(function() {
            var title = $(this).find('h5').text();
            var content = $(this).find('p').text();
            var pay = $(this).find('strong').text();
            var image = $(this).find('#Map').text();
            var mainiImage = $(this).find('#main').text();
            var packageInfo = `

                <img id="MainMap" src="${image}" alt="${title}">
                <div style="height : 400px">
                <img id="MainImg" src="${mainiImage}" alt="${title}">
                <br><br>
                <h1 style="font-size:2rem; font-weight: 'bold'">${title}</h1>
                <br><br>
                <h4 style="font-size:1.5rem">요금: ${pay}</h4>
                </div>
            `;
            $('#packageMap').empty();
            $('#packageMap').append(packageInfo);
          });
        $('.list-group-item').click(function() {
            window.location.href = '/WebContent/trainSelect/train.html';
          });
        });
      }
    });
  });