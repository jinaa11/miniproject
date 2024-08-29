# 웹 미니 프로젝트 실행 과정 설명

## 기차 예약관리 시스템

- 조장: 이수호
- 팀원
  - 이한희
  - 김진아
  - 이주언

## 시연영상 실행 플로우

### 메인 페이지

1. WebContent안에 main.html을 Live Server를 사용해서 실행합니다.
2. 상단에 로그인버튼을 클릭하여 로그인 화면으로 넘어옵니다.
3. 아이디에 1004, 비밀번호로 1234!를 입력하고, 확인버튼을 클릭합니다.

### 열차 시간 조회

1. 메인 페이지 중간 색션에 지도 아이콘을 선택하여 서울을 출발역, 부산을 도착역으로 선택합니다.
2. 이후 중간 색션의 하단 버튼을 클릭하여 승차권을 검색합니다.
3. 열차 시간 조회 페이지에서 설정된 조건을 확인하고 조회하기 버튼을 클릭합니다.
4. 열차 목록을 확인하고, KTX 105 열차의 일반실을 예약하기위해 예약 가능 버튼을 클릭합니다.

### 열차 좌석 조회

1. 각 호차별로 기능을 테스트합니다.

   - 이미 예약된 좌석인 경우, 알림창으로 이미 예약되었다는 것을 알리고, 좌석의 상태를 예약할 수 없도록 비활성화 합니다.
   - 인원은 감소버튼을 클릭하면, 선택한 인원이 초기화 됩니다.
   - 호차별로 선택한 예약은 세션이 유지되는 동안은 저장됩니다.

2. 마지막 좌석 선택은 인원을 4인으로 맞추고 선택좌석 예약하기 버튼을 선택합니다.
   - "5-A03", "5-A04", "5-B03", "5-B04"
3. 중간에 열차 시간표 조회 버튼을 클릭하여 선택한 열차에 대한 열차 운행 시간표를 표로써 조회합니다.

### 예약 조회

1. 나의 예약 내역을 확인합니다.
2. 좌측에 첫번째 예약번호를 클릭합니다. 이후 해당 예약의 상세 내역이 조회됩니다.
3. 내역 하단에 좌석 확인하기 버튼을 클릭하여, 예약한 좌석을 배치도로 확인합니다.
4. 첫 번째 예약의 결제하기 버튼을 클릭합니다. (예약 제한시간은 편의를 위해 10분이 아닌 2027년으로 해두었습니다.)

### 결제 하기

1. 결제하기 페이지에서 예약 정보를 확인하고 편의를 위하여 토스 페이를 선택하여 결제를 진행합니다.
2. 핸드폰을 사용하여 결제를 완료합니다.(테스트 환경임으로 실제 돈이 나가지 않아 결제를 진행하셔도 무방합니다.)

### 승차권 조회

1. 결제 완료 페이지에서 결제 정보를 확인하고, 영수증 확인 버튼을 클릭하여 영수증의 정보를 확인합니다.
2. 상단의 승차권 확인 버튼을 클릭합니다.
3. 중간의 화살표를 클릭하여 케러셀 기능으로 여러 승차권이 발급된 것을 확인할 수 있습니다.
4. 상단에 뒤로가기 버튼을 클릭합니다.
5. 핸드폰을 사용하여 qr코드를 찍어, 모바일 화면으로 승차권을 확인합니다.
6. 발권 내역조회 버튼을 클릭하여 발권 페이지로 넘어옵니다.

### 승차권 환불

1. 좌측의 환불할 승차권 내역의 라디오 버튼을 클릭하고, 환불하기 버튼을 클릭합니다.
2. 환불은 승차권 단위로 가능하며, 좌측의 체크박스를 클릭하여 환불을 할 수 있습니다. 선택 후, 반환 요청 버튼을 클릭합니다.

### 메인페이지 패키지 상품 조회

1. 메인 페이지 하단에 지역별 여행 상품 란에서 경상권 이미지를 클릭합니다.
2. 모달로 표시되는 패키지 내역들은 호버로 정보들을 확인할 수 있습니다.
