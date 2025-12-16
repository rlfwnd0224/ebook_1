// 공통 유틸리티 함수

// 이미지 로드 에러 처리
function handleImageError(img) {
  img.onerror = null;
  img.src = 'https://via.placeholder.com/400x300?text=No+Image';
}

// 날짜 포맷팅
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// URL 유효성 검사
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// 로딩 표시
function showLoading(elementId, message = '로딩 중...') {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<div class="loading">${message}</div>`;
  }
}

// 에러 표시
function showError(elementId, message = '오류가 발생했습니다') {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<div class="loading" style="color: #E57373;">${message} 😢</div>`;
  }
}

// 토스트 알림
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#81C784' : '#E57373'};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
