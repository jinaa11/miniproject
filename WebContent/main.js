$(document).ready(function() {
    const dropdown = $("#menuDropdown");

    // 모든 메뉴 데이터
    const menuData = {
        '승차권': ['일반승차권 조회', '단체승차권 조회', '할인승차권 조회'],
        '관광열차': ['기차 여행 패키지', '레일 바이크', '테마 기차 여행'],
        '자유여행': ['자유 여행 패키지', '주말 여행 스페셜', '가족 여행 프로모션'],
        '여행상품': ['1박 2일 여행', '2박 3일 투어', '일일 투어'],
        '종합이용안내': ['이용 규칙', '티켓 예약 정보', '고객 지원'],
        '기차역정보/노선도': ['역 정보 조회', '노선도 확인', '역별 서비스']
    };

    // 메뉴 항목 호버 이벤트
    $('.menu-link').hover(function() {
        showAllMenus();
    });

    function showAllMenus() {
        dropdown.empty(); // 이전 내용 지우기
        Object.keys(menuData).forEach(key => {
            const section = $('<div>').addClass('menu-section');
            const title = $('<h3>').text(key);
            section.append(title);

            menuData[key].forEach(item => {
                const link = $('<a>').attr('href', '#').addClass('menu-link-sub').text(item);
                section.append(link);
            });

            dropdown.append(section);
        });
        dropdown.show(); // 드롭다운 표시
    }

    // 드롭다운 메뉴가 위치할 섹션을 벗어났을 때 메뉴 숨기기
    $('#menuDropdown').mouseleave(function() {
        $(this).hide();
    });
});


$(document).ready(function() {
    $('.dis_content_txt a').click(function () {
        $(this).siblings().removeClass('on');
        $(this).addClass('on');
      });
    
      let adult = document.getElementById('adult');
      for (let i = 1; i <= 9; i++) {
          let option = document.createElement('option');
          option.value = i;
          option.text = '어른(만 13세 이상) ' + i + '명';
          adult.appendChild(option);
      }
    
      let child = document.getElementById('child');
      for (let i = 1; i <= 9; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = '어른(만 13세 이상) ' + i + '명';
        child.appendChild(option);
      }
});