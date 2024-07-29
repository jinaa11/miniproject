$(document).ready(function() {
  // header 불러오기
  $("#header1").load("/WebContent/common/header.html", function() {
      $(document).trigger("headerLoaded");

      //로그인시 변경
      const idKey = "USER-ID";
      const loginInfo = localStorage.getItem(idKey);
      if (loginInfo != null) {
          console.log('저장된 아이디값 불러옴');
          $('.login-link').text('로그아웃');
          $('.login-user-info').html('<span class="user-name">이한희</span>님 환영합니다!');
          $('.user-name').css("font-weight", "bold");
          $('.login-user-info').css('margin-right', '50px');
          $(".login-link").parent().attr("href", "/WebContent/login/login.html?type=logout");
          $('.login-link').parent().next().hide();
      }
  });
  
  // footer 불러오기
  $("#footer1").load("/WebContent/common/footer.html", function() {});
});


$(document).on("headerLoaded", function() {
  $("#header1").on("mouseenter", ".menu-link", function() {
      showAllMenus($(this));
      // 지역 선택 modal 열기
      $('.main-map-info').click(function () {
        $('.station_start_map .btn-primary').trigger('click');
      });
  }).on("mouseleave", "#menuDropdown", function() {
      hideAllMenus();
  });
});

function showAllMenus(element) {
  const dropdown = $("#menuDropdown");
  dropdown.empty(); // 이전 내용 지우기

  const container = $('<div>').addClass('container d-flex justify-content-between'); // 새로운 컨테이너 div

  const menuData = {
      '승차권예약': ['일반승차권 조회', '단체승차권 조회', '할인승차권 조회'],
      '관광열차': ['기차 여행 패키지', '레일 바이크', '테마 기차 여행'],
      '자유여행': ['자유 여행 패키지', '주말 여행 스페셜', '가족 여행 프로모션'],
      '여행상품': ['1박 2일 여행', '2박 3일 투어', '일일 투어'],
      '종합이용안내': ['이용 규칙', '티켓 예약 정보', '고객 지원'],
      '기차역정보/노선도': ['역 정보 조회', '노선도 확인', '역별 서비스']
  };

  Object.keys(menuData).forEach(key => {
      const section = $('<div>').addClass('menu-section');
      const title = $('<h4>').text(key);
      section.append(title);

      menuData[key].forEach(item => {
          let search_link = '#';
          let train_search_link = '/WebContent/trainSelect/train.html?type=';
          if (item == '일반승차권 조회')  {
            search_link = train_search_link + 't1';
          } else if (item == '단체승차권 조회') {
            search_link = train_search_link + 't2';
          } else if (item == '할인승차권 조회') {
            search_link = train_search_link + 't3';
          }
          let search_add_class = (item == '역 정보 조회') ? 'menu-link-sub main-map-info' : 'menu-link-sub';
          const link = $('<a>').attr('href', search_link).addClass(search_add_class).text(item);
          section.append(link);
      });

      container.append(section); // 섹션을 컨테이너에 추가
  });

  dropdown.append(container); // 컨테이너를 드롭다운에 추가
  dropdown.show(); // 드롭다운 표시
}

function hideAllMenus() {
  $("#menuDropdown").hide();
}