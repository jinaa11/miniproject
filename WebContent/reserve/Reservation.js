$(function() {
    sessionStorage.clear(); // 세션 스토리지 초기화
    const trainNumber = '101';
    let userChoice = '일반실';
    let trainData; // 열차 데이터를 저장할 변수

    let cars;
    if (userChoice === '특실') {
        cars = [2, 3, 4];
    } else if (userChoice === '일반실') {
        cars = [1, 5, 6, 7, 8, 9];
    }
    
    const $container = $('.train-top');
    $container.empty(); // 기존의 내용을 지웁니다.

    cars.forEach(function(carNumber) {
        $('<button>', {
            id: 'rail-' + carNumber,
            class: 'train-top-rail d-flex justify-content-center align-items-center',
            text: carNumber + '호차'
        }).appendTo($container);
    });

    function updateSeatDisplay() {
        // 탑승 인원 업데이트
        $('#adult').text($('#count-adult').text() + '명');
        $('#child').text($('#count-child').text() + '명');
        $('#senior').text($('#count-senior').text() + '명');
        $('#disabled').text($('#count-disabled').text() + '명');
    }

    $('.seat-btn').on('click', function() {
        // 좌석 버튼 클릭 후 딜레이를 주어 DOM 업데이트 후 값을 읽음
        setTimeout(updateSeatDisplay, 50);
    });

    $('.train-top-rail').eq(0).css({
        'background-image': 'url(../images/reserve/scar-blue.png)',
        'color': 'white'
    });

    updateSeatDisplay();

    // AJAX로 JSON 데이터 가져오기
    $.getJSON("../json/reserve_layout.json", function(data) {
        trainData = data.KTX.find(train => train.trainNumber === trainNumber);
        if (userChoice === '특실') {
            displaySeats(2); // 초기에 2호차 좌석 표시
        } else if (userChoice === '일반실') {
            displaySeats(1); // 초기에 1호차 좌석 표시
        }
    });

    $('.train-top-rail').click(function() {
        // 호차 버튼 스타일 초기화
        $('.train-top-rail').css({
            'background-image': 'url(../images/reserve/scar.png)',
            'color': 'black'
        });
        $(this).css({
            'background-image': 'url(../images/reserve/scar-blue.png)',
            'color': 'white'
        });

        let coachNumber = parseInt($(this).text().replace('호차', '').trim()); // 버튼에서 호차 번호 추출
        displaySeats(coachNumber); // 선택된 호차의 좌석 표시
    });

    function updateControls(labelId, valueId) {
        sessionStorage.setItem(labelId, parseInt($(`#${valueId}`).text()));
    
        // 증가 버튼 이벤트
        $(`#${labelId} ~ .controls .increment`).click(function() {
            let count = parseInt($(`#${valueId}`).text());
            $(`#${valueId}`).text(count + 1);
            sessionStorage.setItem(labelId, count + 1); // 세션에 새 값 저장
        });
    
        // 감소 버튼 이벤트
        $(`#${labelId} ~ .controls .decrement`).click(function() {
            let count = parseInt($(`#${valueId}`).text());
            if (count > 0) {
                $(`#${valueId}`).text(count - 1);
                sessionStorage.setItem(labelId, count - 1); // 세션에 새 값 저장
                resetControls();
            }
        });
    }

    function resetControls() {
        // 선택 인원 초기화
        sessionStorage.setItem('selectedSeats', '[]');
        sessionStorage.setItem('total', 0);
        const selectedSeats = $('#selected-seats').text().split(',').map(s => s.trim());
        selectedSeats.forEach(seat => {
            $(`#${seat}`).removeClass('seat-blue').addClass('seat').css('color', 'black');
        });
        $('#selected-seats').text('');
    }

    // 각 컨트롤에 이벤트 할당
    updateControls('label-adult', 'count-adult');
    updateControls('label-child', 'count-child');
    updateControls('label-senior', 'count-senior');
    updateControls('label-disabled', 'count-disabled');    

    function displaySeats(coachNumber) {
        // 선택된 호차의 좌석 정보 가져오기
        let selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats') || '[]');
        let coach = trainData.coaches.find(coach => coach.coachNumber.includes(coachNumber));

        const container = $('#train-seats');
        const windows_1 = $('#windows-1');
        const windows_2 = $('#windows-2');
    
        // 기존 좌석 정보 삭제
        windows_1.empty();
        windows_2.empty();
        container.empty();
    
        // 최대 좌석 수와 창문 수 계산
        let maxSeats = 0;
        Object.values(coach.seats).forEach(seatArray => {
            maxSeats = Math.max(maxSeats, seatArray.length);
        });
        let numWindows = maxSeats <= 8 ? 7 : 8;
        let windowWidth = maxSeats <= 8 ? '140px' : '130px';
    
        // 창문 표시
        for (let j = 1; j <= numWindows; j++) {
            windows_1.append('<span class="window"></span>');
            windows_2.append('<span class="window"></span>');
        }
    
        $('.window').css({
            'width': windowWidth,
            'height': '3px',
            'background-color': '#b0e0e6',
            'margin': '6px'
        });
    
        // 좌석 표시
        Object.keys(coach.seats).forEach(row => {
            coach.seats[row].forEach(seat => {
                let seatDiv;
                let seatNumber = `${row}${seat.number < 10 ? `0${seat.number}` : seat.number}`;
                if (seat.direction === 'forward') {
                    seatDiv = $(`<div class="p-2 ${seat.reserved ? 'seat-off' : 'seat'}" id="${coachNumber}-${seatNumber}">${seatNumber}</div>`);
                } else {
                    seatDiv = $(`<div class="p-2 ${seat.reserved ? 'seat-off-reverse' : 'seat-reverse'}" id="${coachNumber}-${seatNumber}">${seatNumber}</div>`);
                }
                if (selectedSeats.includes(`${coachNumber}-${row}0${seat.number}`)) {
                    if (seat.direction === 'forward') {
                        seatDiv.addClass('seat-blue').css('color', 'white');
                    } else {
                        seatDiv.addClass('seat-blue-reverse').css('color', 'white');
                    }
                }

                if (maxSeats === 15) {
                    if (seat.number === 9) {
                        container.append('<span class="passage">통로</span>');
                        container.append('&nbsp;');
                    } else {
                        container.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    }
                    seatDiv.css({'width': '40px'});
                } else if (maxSeats === 14) {
                    if (seat.number === 9) {
                        container.append('<span class="passage">통로</span>');
                        container.append('&nbsp;');
                    } else {
                        container.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    }
                    seatDiv.css('margin-right', '10px'); // 기본 간격
                } else {
                    container.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    container.append('&nbsp;&nbsp;&nbsp;&nbsp;');
                    
                    seatDiv.css('margin-right', '20px'); // 기본 간격
                }

                

                container.append(seatDiv);

                if (row === 'B' && seat.number === maxSeats) {
                    container.append(
                    '<div class="seat-center d-flex justify-content-evenly align-items-center">' + 
                    '<span class="loc-seat">' + $('#startLoc').text() + '</span><span style="color: #3769e5; font-weight: bold;"> ' + 
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
                     '<span class="loc-seat">' + $('#endLoc').text() + '</span>' +
                    '</div>'); // A열 다음에 줄바꿈 추가
                } else if (seat.number === maxSeats) {
                    container.append('<br>');
                }
            });
        });
    }
    
    $('#train-seats').on('click', '.seat, .seat-reverse, .seat-blue, .seat-blue-reverse', function() {
        if (!$(this).hasClass('seat-off') || !$(this).hasClass('seat-off-reverse')) {
            let total = parseInt(sessionStorage.getItem('total') || 0); // 현재 저장된 total 값 가져오기, 없으면 0으로 초기화
    
            if ($(this).hasClass('seat-blue') || $(this).hasClass('seat-blue-reverse')) {
                // 좌석이 이미 선택된 상태이면 해제
                if ($(this).hasClass('seat-blue')) {
                    $(this).removeClass('seat-blue').addClass('seat');
                } else {
                    $(this).removeClass('seat-blue-reverse').addClass('seat-reverse');
                }
                $(this).css('color', 'black'); // 텍스트 색상 검은색으로 변경
                sessionStorage.setItem('total', total - 1); // total 감소
                removeSelectSessionStorage($(this).attr('id'));
            } else {
                // 선택 가능한 좌석 수와 비교
                if (calculateTotalSeats() > total) {
                    // 좌석 선택
                    if ($(this).hasClass('seat-reverse')) {
                        $(this).removeClass('seat-reverse').addClass('seat-blue-reverse');
                    } else {
                        $(this).removeClass('seat').addClass('seat-blue');
                    }
                    $(this).css('color', 'white'); // 텍스트 색상 하얀색으로 변경
                    sessionStorage.setItem('total', total + 1); // total 증가
                    InsertSelectSessionStorage($(this).attr('id'));
                } else {
                    const exceedModal = new bootstrap.Modal(document.getElementById('exceedLimitModal'));
                    exceedModal.show();
                }
            }
            
        }
    });

    function calculateTotalSeats() {
        let totalSeats = 0;

        // 세션 스토리지에서 모든 관련 항목 가져오기
        ['label-adult', 'label-child', 'label-senior', 'label-disabled'].forEach(item => {
            let count = parseInt(sessionStorage.getItem(item) || 0);
            totalSeats += count;
        });

        return totalSeats;
    }

    function removeSelectSessionStorage(id) {
        let selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats') || '[]');
        let index = selectedSeats.indexOf(id);
        if (index > -1) {
            selectedSeats.splice(index, 1);
        }
        sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
        $('#selected-seats').text(sortSeats(selectedSeats).join(', '));
    }

    function InsertSelectSessionStorage(id) {
        let selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats') || '[]');
        selectedSeats.push(id);
        sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
        $('#selected-seats').text(sortSeats(selectedSeats).join(', '));
    }  
    
    // 예시로 사용하기 위해 이벤트 리스너에 연결
    $('#btn-reserve').on('click', function() {
        const selectedSeats = JSON.parse(sessionStorage.getItem('total'));
    
        // 탑승 인원 데이터 수집
        const passengerData = {
            adult: parseInt($('#count-adult').text()),
            child: parseInt($('#count-child').text()),
            senior: parseInt($('#count-senior').text()),
            disabled: parseInt($('#count-disabled').text())
        };
    
        // 전체 인원 계산
        const totalPassengers = passengerData.adult + passengerData.child + passengerData.senior + passengerData.disabled;
    
        // JSON 객체 생성
        const dataToSave = {
            seats: selectedSeats,
            passengers: passengerData
        };
    
        // 인원수와 좌석 선택 수 검증
        if (selectedSeats !== totalPassengers) {
            // 모달 창을 표시
            $('#exceedLimitModal').modal('show');
            $('#exceedLimitModal .modal-body').text('선택된 좌석 수와 탑승 인원 수가 일치하지 않습니다.');
        } else {
            // JSON을 문자열로 변환하여 콘솔에 출력
            console.log(JSON.stringify(dataToSave));
    
            // 실제로 서버에 데이터를 전송할 때 사용할 코드
            // $.post('URL_TO_SEND_DATA', dataToSave, function(response) {
            //     console.log('Data saved:', response);
            // });

            window.location.href = 'reservation_complete.html';
        }
    });

    function sortSeats(seats) {
        return seats.sort((a, b) => {
            // 좌석 번호를 코치 번호, 열, 그리고 숫자 부분으로 분리
            let seatA = a.split('-');
            let seatB = b.split('-');
            let coachA = parseInt(seatA[0], 10);
            let coachB = parseInt(seatB[0], 10);
            let rowA = seatA[1].charAt(0);
            let rowB = seatB[1].charAt(0);
            let numA = parseInt(seatA[1].slice(1), 10);
            let numB = parseInt(seatB[1].slice(1), 10);
    
            // 코치 번호로 먼저 정렬
            if (coachA !== coachB) {
                return coachA - coachB;
            }
            // 같은 코치 내에서 열 이름으로 정렬
            if (rowA !== rowB) {
                return rowA.localeCompare(rowB);
            }
            // 같은 열 내에서 좌석 번호 순으로 정렬
            return numA - numB;
        });
    }

    $('#openSchedule').on('click', function() {
        var newWindow = window.open('schedule.html', 'ScheduleWindow', 'width=270,height=310');

        // 데이터 로드를 위해 새 창이 충분히 로드된 후 실행
        $(newWindow).on('load', function() {
            $.ajax({
                url: '../json/schedule.json',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    var tbodyHtml = '';
                    data.forEach(function(row) {
                        tbodyHtml += '<tr>' +
                            '<td>' + row.stationName + '</td>' +
                            '<td>' + (row.arrivalTime || '-') + '</td>' +
                            '<td>' + row.departureTime + '</td>' +
                            '</tr>';
                    });
                    newWindow.document.getElementById('train-schedule-body').innerHTML = tbodyHtml;
                },
                error: function(error) {
                    console.log('Error loading data', error);
                }
            });
        });
    });
});
