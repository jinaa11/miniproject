$(document).ready(function() {
  $("#header1").load("../WebContent/header.html", function() {
      $(document).trigger("headerLoaded");
  });
  
  $("#footer1").load("../WebContent/footer.html", function() {
      
  });
});


$(document).on("headerLoaded", function() {
  $("#header1").on("mouseenter", ".menu-link", function() {
      showAllMenus($(this));
  }).on("mouseleave", ".menu-link", function() {
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
          const link = $('<a>').attr('href', '#').addClass('menu-link-sub').text(item);
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
