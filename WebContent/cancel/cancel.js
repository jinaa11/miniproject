document.addEventListener('DOMContentLoaded', function() {
  fetch('/WebContent/common/stage.html')
    .then(res => res.text())
    .then(data => {
      const stage = document.getElementById('stage');
      stage.innerHTML = data;
      stage.querySelectorAll('span')[3].classList.add('on');
      stage.querySelector('.fw-bold-stage').textContent = "예약발매내역 반환요청";
    });

  fetch('/WebContent/json/reserveDetail.json')
    .then(response => response.json())
    .then(data => {
      document.querySelector('#passengerName').innerHTML = data[0].passengerInfo.passengerName;
      data.forEach(item => {
        let table = '<tr>';
        table += "<td><input type='checkbox'></td>";
        table += "<td>" + item.travelInfo.date + "</td>";
        table += "<td>" + item.travelInfo.trainType + "</td>";
        table += "<td>" + item.travelInfo.trainNumber + "</td>";
        table += "<td>" + item.travelInfo.departureStation + "</td>";
        table += "<td>" + item.travelInfo.arrivalStation + "</td>";
        table += "<td>" + item.travelInfo.departureTime + "</td>";
        table += "<td>" + item.travelInfo.arrivalTime + "</td>";
        table += "<td>" + item.passengerInfo.passengerName + "</td>";
        table += "<td>" + item.passengerInfo.seatType + "</td>";
        table += "<td>" + item.passengerInfo.passengerType + "</td>";
        table += "<td>" + item.passengerInfo.seatInfo + "</td>";
        table += "</tr>";

        document.getElementById('reserveList').insertAdjacentHTML('beforeend', table);
      });

      const tableList = document.getElementById('reserveList').querySelectorAll("tr");

      // 테이블 선택시 체크박스 toggle 되는 함수
      tableList.forEach((lst) => {
        lst.addEventListener('click', function() {
          this.querySelector('input').toggleAttribute('checked');
        });
      });

      // 반환 요청 버튼 클릭시 실행되는 함수
      document.getElementById('refundBtn').addEventListener('click', function() {
        let selectedList = [];

        tableList.forEach((lst) => {
          // classList.contains('checked') 대신 체크박스의 checked 속성을 직접 확인해야 제대로 확인이 된다.
          if (lst.querySelector('input').checked) {
            selectedList.push(lst);
          }
        });
        if (selectedList.length == 0) {
          fetch('/WebContent/cancel/noRefundModal.html')
            .then(res => res.text())
            .then(data => {
              // 모달 내용을 임시 요소에 저장
              const modalContainer = document.createElement('div');
              modalContainer.innerHTML = data;

              // 불러온 내용에서 실제 모달 요소 추출
              const modal = modalContainer.querySelector('#noSelected');
              document.body.appendChild(modal);
              
              // Bootstrap 사용 시 모달 표시 (적용 가능한 경우)
              const modalInstance = new bootstrap.Modal(modal);
              modalInstance.show();
            });
        } else {
          fetch('/WebContent/cancel/checkRefundModal.html')
            .then(res => res.text())
            .then(data => {
              const modalContainer = document.createElement('div');
              modalContainer.innerHTML = data;
              
              // 불러온 내용에서 실제 모달 요소 추출
              const modal1 = modalContainer.querySelector('#refundModal');
              const modal2 = modalContainer.querySelector('#refundModal2');
              
              document.body.appendChild(modal1);
              // document.body.appendChild(modal2);
                 
              fetch('/WebContent/json/cancel.json')
                .then(res => res.json())
                .then(data => {
                  let table1 = '<table class="table table-custom table-hover">';
                  table1 += '<thead class="top-border table-primary">';
                  table1 += '<tr>';
                  table1 += '<th>승차일자</th>';
                  table1 += '<th>열차번호</th>';
                  table1 += '<th>열차종별</th>';
                  table1 += '<th>출발역</th>';
                  table1 += '<th>출발시간</th>';
                  table1 += '<th>도착역</th>';
                  table1 += '<th>도착시간</th>';
                  table1 += '</tr>';
                  table1 += '</thead>';
                  table1 += '<tbody>';
                  
                  let table2 = '<table class="table table-custom table-hover">';
                  table2 += '<thead class="top-border table-secondary">';
                  table2 += '<tr>';
                  table2 += '<th>영수금액</th>';
                  table2 += '<th>반환 수수료</th>';
                  table2 += '<th>환급 금액</th>';
                  table2 += '</tr>';
                  table2 += '</thead>';
                  table2 += '<tbody>';

                  data.forEach(item => {
                    table1 += '<tr>';
                    table1 += '<td>' + item.travelInfo.date + '</td>';
                    table1 += '<td>' + item.travelInfo.trainNumber + '</td>';
                    table1 += '<td>' + item.travelInfo.trainType + '</td>';
                    table1 += '<td>' + item.travelInfo.departureStation + '</td>';
                    table1 += '<td>' + item.travelInfo.departureTime + '</td>';
                    table1 += '<td>' + item.travelInfo.arrivalStation + '</td>';
                    table1 += '<td>' + item.travelInfo.arrivalTime + '</td>';
                    table1 += '</tr>';
                    
                    table2 += '<tr>';
                    table2 += '<td>' + item.passengerInfo.totalFare + '</td>';
                    table2 += '<td>' + item.charge + '</td>';
                    table2 += '<td>' + item.passengerInfo.totalFare + '</td>';
                    table2 += '</tr>';
                  });
                  
                  table1 += '</tbody>';
                  table1 += '</table>';

                  table2 += '</tbody>';
                  table2 += '</table>';

                  modal1.querySelector('.cancelData').insertAdjacentHTML('beforeend', table1);
                  modal1.querySelector('.cancelData').insertAdjacentHTML('beforeend', table2);

                  // 첫 번째 모달 표시
                  const modalInstance1 = new bootstrap.Modal(modal1);
                  modalInstance1.show();

                  // 첫 번째 모달의 반환 버튼 클릭 시 두 번째 모달 표시
                  const refundButton = modal1.querySelector('[data-bs-target="#refundModal2"]');
                  refundButton.addEventListener('click', function() {
                    const modalInstance2 = new bootstrap.Modal(modal2);
                    modalInstance2.show();

                    modal2.querySelector('.btn-secondary').addEventListener('click', function() {
                      const canceled = document.querySelector('#reserveList').querySelector('tr');
                      canceled.style.display = 'none';
                    });
                  });
                });
            });
        }
      });
    });
});