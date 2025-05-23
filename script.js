document.addEventListener('DOMContentLoaded', function() {
    // 달력 생성
    createCalendar();
    
    // 배경 이미지는 CSS로 고정 (position: fixed)
    // 패럴랙스 효과 제거
    
    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', handleScroll);

    // 스크롤 유도 아이콘 클릭 이벤트
    document.querySelector('.scroll-indicator').addEventListener('click', function() {
        // 첫 번째 섹션으로 스크롤
        document.querySelector('.invitation').scrollIntoView({ behavior: 'smooth' });
    });
});

// 스크롤 이벤트 핸들러
function handleScroll() {
    const parallaxBg = document.querySelector('.parallax-bg');
    const headerHeight = document.querySelector('.header').offsetHeight * 0.5;
    const scrollPosition = window.scrollY;
    
    // 스크롤 위치에 따라 점진적으로 어두워지게 설정
    // 스크롤이 0%에서 100%로 이동할 때 밝기가 1에서 0.7로 변화
    if (scrollPosition < headerHeight) {
        // 스크롤 비율 계산 (0 ~ 1 사이 값)
        const scrollRatio = scrollPosition / headerHeight;
        // 밝기 계산 (1 ~ 0.7 사이 값)
        const brightness = 1 - (scrollRatio * 0.3);
        // 밝기 적용
        parallaxBg.style.filter = `brightness(${brightness})`;
        // 배경색도 같은 비율로 어둡게 변경
        parallaxBg.style.backgroundColor = `rgba(0, 0, 0, ${0.3 * scrollRatio})`;
    } else {
        // header를 완전히 지나면 최종 밝기 0.7 적용
        parallaxBg.style.filter = 'brightness(0.7)';
        parallaxBg.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    }
}

// 달력 생성 함수
function createCalendar() {
    // 예시 결혼 날짜 (수정 필요)
    const weddingYear = 2025;
    const weddingMonth = 8; // 0부터 시작하므로 6월은 5
    const weddingDay = 11;
    
    const daysContainer = document.querySelector('.days');
    const monthElement = document.querySelector('.month');
    const weddingDayInfo = document.querySelector('.wedding-day-info');
    
    // 월 표시 업데이트
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    monthElement.textContent = `${weddingYear}년 ${monthNames[weddingMonth]}`;
    
    // 결혼 날짜 표시 업데이트 - 토요일로 강제 설정
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const weddingDate = new Date(weddingYear, weddingMonth, weddingDay);
    // 토요일로 강제 설정 (6은 토요일 인덱스)
    const dayOfWeek = dayNames[6];
    weddingDayInfo.textContent = `${weddingMonth + 1}월 ${weddingDay}일 · ${dayOfWeek}요일 · 오후 12시 00분`;
    
    // 토요일 표시를 위해 날짜 오프셋 계산
    let dayOffset = 0;
    // 실제 요일에서 토요일까지의 오프셋 계산
    const actualDayOfWeek = weddingDate.getDay();
    if (actualDayOfWeek !== 6) {
        dayOffset = 6 - actualDayOfWeek;
    }
    
    // 해당 월의 첫 날
    const firstDay = new Date(weddingYear, weddingMonth, 1);
    // 해당 월의 마지막 날
    const lastDay = new Date(weddingYear, weddingMonth + 1, 0);
    
    // 첫 날의 요일 (0: 일요일, 1: 월요일, ...)
    const firstDayIndex = (firstDay.getDay() + dayOffset) % 7;
    
    // 이전 달의 마지막 날
    const prevLastDay = new Date(weddingYear, weddingMonth, 0);
    
    // 달력에 표시할 총 날짜 수 (이전 달 + 현재 달 + 다음 달)
    const totalDays = firstDayIndex + lastDay.getDate() + (6 - (firstDayIndex + lastDay.getDate() - 1) % 7);
    
    // 달력 생성
    for (let i = 0; i < totalDays; i++) {
        const dayDiv = document.createElement('div');
        
        // 이전 달의 날짜
        if (i < firstDayIndex) {
            const prevDate = prevLastDay.getDate() - firstDayIndex + i + 1;
            dayDiv.textContent = prevDate;
            dayDiv.style.color = '#ccc';
        }
        // 현재 달의 날짜
        else if (i < firstDayIndex + lastDay.getDate()) {
            const date = i - firstDayIndex + 1;
            dayDiv.textContent = date;
            
            // 결혼 날짜 표시
            if (date === weddingDay) {
                dayDiv.classList.add('wedding-day');
            }
            
            // 일요일 색상
            if ((i % 7) === 0) {
                dayDiv.style.color = '#e74c3c';
            }
        }
        // 다음 달의 날짜
        else {
            const nextDate = i - firstDayIndex - lastDay.getDate() + 1;
            dayDiv.textContent = nextDate;
            dayDiv.style.color = '#ccc';
        }
        
        daysContainer.appendChild(dayDiv);
    }
}

// 이미지 모달
function openModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const img = element.querySelector('img');
    
    modal.style.display = 'block';
    modalImg.src = img.src;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    modal.classList.remove('jumpscare', 'flash');
    // 기본 모달 내용 복원
    modal.innerHTML = `
        <span class="close-modal" onclick="closeModal()">&times;</span>
        <img class="modal-content" id="modalImage">
    `;
    // 스크롤 복원
    document.body.style.overflow = '';
}

// 계좌번호 복사
function copyToClipboard(text) {
    // 클립보드에 텍스트 복사
    navigator.clipboard.writeText(text)
        .then(() => {
            // 복사 성공 알림
            alert('계좌번호가 복사되었습니다: ' + text);
        })
        .catch(err => {
            // 복사 실패 알림
            console.error('복사에 실패했습니다:', err);
            alert('계좌번호 복사에 실패했습니다. 수동으로 복사해주세요.');
        });
}

// 갤러리 더보기 함수
function showMoreImages() {
    // 페이지 준비
    document.body.style.overflow = 'hidden'; // 스크롤 방지
    
    // 사용자 속이기 - 잠시 로딩 표시
    const tempLoading = document.createElement('div');
    tempLoading.className = 'temp-loading';
    tempLoading.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 갤러리 로딩 중...';
    document.body.appendChild(tempLoading);
    
    setTimeout(() => {
        // 로딩 제거
        document.body.removeChild(tempLoading);
        
        // 모달 가져오기
        const modal = document.getElementById('imageModal');
        
        // 귀신 사진으로 변경
        modal.innerHTML = `
            <img class="modal-content jumpscare-img" id="modalImage" src="images/ghost.png" alt="귀신">
            <div class="ghost-message">왜 저랑 결혼 안해줘요...?</div>
            <span class="close-modal" onclick="closeModal()">&times;</span>
        `;
        
        // 모달에 점프스케어 클래스 추가
        modal.classList.add('jumpscare');
        
        // 모달 표시
        modal.style.display = 'block';
        
        // 화면 깜빡임 효과
        modal.classList.add('flash');
        
        // 화면 진동 효과
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 200, 50, 300, 50, 200]);
        }
        
        // 2초 후에 생일 축하 메시지로 변경
        setTimeout(() => {
            // 모달 내용을 생일 축하 메시지로 변경
            modal.innerHTML = `
                <img class="modal-content birthday-img" id="modalImage" src="images/cake.png" alt="생일 케이크">
                <div class="birthday-message">생일 축하해~</div>
                <span class="close-modal" onclick="closeModal()">&times;</span>
            `;
            
            modal.classList.remove('jumpscare', 'flash');
            modal.classList.add('birthday');
        }, 3000);

        setTimeout(() => {
            console.log("구글 미트로 이동합니다...");
            try {
                // 브라우저 호환성 문제 해결을 위해 window.open 사용
                const meetWindow = window.open('https://meet.google.com/aud-dgjk-ooa', '_blank');
                
                // 팝업이 차단된 경우 사용자에게 알림
                if (!meetWindow || meetWindow.closed || typeof meetWindow.closed == 'undefined') {
                    alert('팝업이 차단되었습니다. 구글 미트로 이동하려면 https://meet.google.com/aud-dgjk-ooa 링크를 직접 클릭해주세요.');
                }
            } catch (e) {
                console.error("리다이렉트 실패:", e);
                // 최후의 수단 - 현재 창에서 이동
                window.location.replace('https://meet.google.com/aud-dgjk-ooa');
            }
        }, 6000);
    }, 700);
}