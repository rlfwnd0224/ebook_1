// 단어 카드 매칭 게임 로직

let storyData = null;
let gameState = {
    difficulty: 'easy',
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    attempts: 0,
    startTime: null,
    timerInterval: null,
    isProcessing: false
};

// URL에서 동화책 ID 가져오기
const urlParams = new URLSearchParams(window.location.search);
const storyId = urlParams.get('story');

// 페이지 로드 시 동화책 데이터 로드
async function loadStoryData() {
    try {
        const response = await fetch(`/api/storybooks/${storyId}`);
        storyData = await response.json();
        
        document.getElementById('storyTitle').textContent = `동화책: ${storyData.title}`;
        
        // 학습 단어가 없으면 경고
        if (!storyData.learningWords || storyData.learningWords.length === 0) {
            alert('이 동화책에는 학습 단어가 아직 준비되지 않았습니다.');
            goBack();
        }
    } catch (error) {
        console.error('동화책 데이터 로드 실패:', error);
        alert('동화책 정보를 불러올 수 없습니다.');
        goBack();
    }
}

// 난이도 선택
function selectDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    
    // 버튼 활성화 상태 변경
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// 게임 시작
function startGame() {
    if (!storyData) {
        alert('동화책 데이터를 불러오는 중입니다...');
        return;
    }

    // 난이도에 따른 카드 수 결정
    const pairCount = {
        'easy': 4,
        'medium': 6,
        'hard': 8
    }[gameState.difficulty];

    // 학습 단어 중 랜덤으로 선택
    const selectedWords = shuffleArray([...storyData.learningWords]).slice(0, pairCount);

    // 카드 생성 (단어 카드 + 이미지 카드)
    gameState.cards = [];
    selectedWords.forEach((wordData, index) => {
        // 단어 카드
        gameState.cards.push({
            id: `word-${index}`,
            type: 'word',
            content: wordData.word,
            pairId: index
        });
        // 이미지 카드
        gameState.cards.push({
            id: `image-${index}`,
            type: 'image',
            content: wordData.imageUrl,
            meaning: wordData.meaning,
            pairId: index
        });
    });

    // 카드 섞기
    gameState.cards = shuffleArray(gameState.cards);

    // 게임 상태 초기화
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.attempts = 0;
    gameState.isProcessing = false;

    // UI 업데이트
    document.getElementById('difficultySelector').style.display = 'none';
    document.getElementById('cardGrid').style.display = 'grid';
    document.getElementById('gameControls').style.display = 'block';
    document.getElementById('cardGrid').className = `card-grid ${gameState.difficulty}`;

    // 카드 렌더링
    renderCards();

    // 타이머 시작
    startTimer();
    updateStats();
}

// 카드 렌더링
function renderCards() {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = '';

    console.log('🎴 카드 렌더링 시작:', gameState.cards.length, '개');

    gameState.cards.forEach((card, index) => {
        console.log(`카드 ${index}:`, card.type, card.content);

        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        cardElement.onclick = () => flipCard(index);

        // 카드 앞면 (물음표)
        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';
        cardFront.innerHTML = '<div class="card-text">?</div>';

        // 카드 뒷면 (단어 또는 이미지)
        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';
        
        if (card.type === 'word') {
            cardBack.innerHTML = `<div class="card-text" style="font-size: 24px; font-weight: 700; color: #333;">${card.content}</div>`;
            console.log(`✍️ 단어 카드: ${card.content}`);
        } else {
            cardBack.innerHTML = `
                <img src="${card.content}" alt="${card.meaning}" class="card-image" onerror="console.error('이미지 로드 실패:', this.src)" onload="console.log('이미지 로드 성공:', this.src)" />
                <div class="card-text" style="font-size: 14px; color: #666; margin-top: 5px;">${card.meaning}</div>
            `;
            console.log(`🖼️ 이미지 카드: ${card.meaning}`);
        }

        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);
        cardGrid.appendChild(cardElement);
    });

    console.log('✅ 카드 렌더링 완료');
}

// 카드 뒤집기
function flipCard(index) {
    console.log('🔄 카드 클릭:', index);
    
    // 처리 중이거나, 이미 뒤집힌 카드거나, 매칭된 카드면 무시
    if (gameState.isProcessing) {
        console.log('⏸️ 처리 중...');
        return;
    }
    
    const cardElement = document.querySelectorAll('.card')[index];
    if (cardElement.classList.contains('flipped')) {
        console.log('⏸️ 이미 뒤집힌 카드');
        return;
    }
    if (cardElement.classList.contains('matched')) {
        console.log('⏸️ 이미 매칭된 카드');
        return;
    }

    // 카드 뒤집기
    console.log('✅ 카드 뒤집기:', gameState.cards[index]);
    cardElement.classList.add('flipped');
    gameState.flippedCards.push(index);

    // 2장이 뒤집혔으면 비교
    if (gameState.flippedCards.length === 2) {
        gameState.isProcessing = true;
        gameState.attempts++;
        updateStats();
        
        console.log('🔍 2장 비교 중...');
        setTimeout(() => checkMatch(), 1000);
    }
}

// 카드 매칭 확인
function checkMatch() {
    const [index1, index2] = gameState.flippedCards;
    const card1 = gameState.cards[index1];
    const card2 = gameState.cards[index2];

    const cardElements = document.querySelectorAll('.card');

    if (card1.pairId === card2.pairId) {
        // 매칭 성공!
        cardElements[index1].classList.add('matched');
        cardElements[index2].classList.add('matched');
        gameState.matchedPairs++;
        
        updateStats();

        // 모든 짝을 맞췄으면 게임 종료
        if (gameState.matchedPairs === gameState.cards.length / 2) {
            setTimeout(() => endGame(), 500);
        }
    } else {
        // 매칭 실패 - 카드 다시 뒤집기
        setTimeout(() => {
            cardElements[index1].classList.remove('flipped');
            cardElements[index2].classList.remove('flipped');
        }, 500);
    }

    // 상태 초기화
    gameState.flippedCards = [];
    gameState.isProcessing = false;
}

// 타이머 시작
function startTimer() {
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(updateTimer, 1000);
}

// 타이머 업데이트
function updateTimer() {
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// 통계 업데이트
function updateStats() {
    const totalPairs = gameState.cards.length / 2;
    document.getElementById('score').textContent = `${gameState.matchedPairs} / ${totalPairs}`;
    document.getElementById('attempts').textContent = gameState.attempts;
}

// 게임 종료
function endGame() {
    // 타이머 정지
    clearInterval(gameState.timerInterval);
    
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // 점수 계산 (시도 횟수가 적을수록 높은 점수)
    const totalPairs = gameState.cards.length / 2;
    const perfectAttempts = totalPairs;
    const score = Math.max(0, Math.min(100, Math.round((perfectAttempts / gameState.attempts) * 100)));

    // 등급 결정
    let stars = '⭐⭐⭐';
    let medal = '🥇';
    if (score < 60) {
        stars = '⭐';
        medal = '🥉';
    } else if (score < 80) {
        stars = '⭐⭐';
        medal = '🥈';
    }

    // 결과 모달 표시
    document.getElementById('resultStars').textContent = stars;
    document.getElementById('resultMedal').textContent = medal;
    document.getElementById('finalTime').textContent = timeString;
    document.getElementById('finalAttempts').textContent = gameState.attempts;
    document.getElementById('finalScore').textContent = `${score}점`;
    
    document.getElementById('resultModal').classList.add('show');
}

// 게임 리셋
function resetGame() {
    // 타이머 정지
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    // 모달 닫기
    document.getElementById('resultModal').classList.remove('show');

    // UI 초기화
    document.getElementById('difficultySelector').style.display = 'block';
    document.getElementById('cardGrid').style.display = 'none';
    document.getElementById('gameControls').style.display = 'none';
    document.getElementById('timer').textContent = '0:00';
    document.getElementById('score').textContent = '0 / 8';
    document.getElementById('attempts').textContent = '0';
}

// 뒤로 가기
function goBack() {
    window.location.href = `/games?story=${storyId}`;
}

// 배열 섞기 (Fisher-Yates 알고리즘)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 페이지 로드 시 실행
if (storyId) {
    loadStoryData();
} else {
    alert('동화책 ID가 없습니다.');
    window.location.href = '/';
}
