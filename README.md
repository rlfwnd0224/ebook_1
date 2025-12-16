# 📚 동화책 이북 뷰어 플랫폼

유아 교육을 위한 인터랙티브 동화책 웹 플랫폼입니다.

## 🎯 주요 기능

### 사용자 기능
- 📖 **동화책 목록**: 연령대별, 태그별 필터링 및 검색
- 📱 **동화책 뷰어**: 이미지와 텍스트가 함께 표시되는 뷰어
- 🔊 **TTS 읽어주기**: Web Speech API를 활용한 자동 음성 읽기
  - 속도 조절 (느림/보통/빠름)
  - 자동 페이지 넘김
  - 키보드 단축키 지원 (← → 스페이스바)
- 💾 **진행률 저장**: LocalStorage를 활용한 읽기 진행률 저장

### 관리자 기능
- ➕ **동화책 생성**: 기본 정보 입력으로 새 동화책 생성
- 🖼️ **다중 이미지 URL 입력**: 한 번에 여러 페이지의 이미지 URL 입력
- 📝 **텍스트 일괄 입력**: `---` 구분자로 모든 페이지 텍스트 한 번에 입력
- ✏️ **개별 편집**: 각 페이지의 이미지 URL과 텍스트 개별 수정
- 🗑️ **동화책 삭제**: 동화책 및 관련 데이터 삭제

## 🏗️ 기술 스택

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript + CSS
- **Data Storage**: JSON 파일 기반
- **Image Storage**: 외부 URL (CDN, 클라우드 스토리지)
- **Audio**: Web Speech API (브라우저 내장 TTS)
- **Deployment**: Vercel (또는 기타 Node.js 호스팅)

## 📂 프로젝트 구조

```
webapp/
├── server.js                    # Express 서버
├── package.json                 # 프로젝트 설정
├── ecosystem.config.cjs         # PM2 설정
├── vercel.json                  # Vercel 배포 설정
├── data/                        # JSON 데이터
│   ├── index.json               # 동화책 목록
│   └── storybooks/              # 개별 동화책 데이터
│       ├── story-001.json
│       ├── story-002.json
│       └── story-003.json
├── views/                       # HTML 페이지
│   ├── index.html               # 메인 페이지
│   ├── reader.html              # 동화책 뷰어
│   └── admin.html               # 관리자 페이지
└── public/                      # 정적 리소스
    ├── css/style.css
    └── js/main.js
```

## 🚀 로컬 개발 환경 실행

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 시작
```bash
npm run dev
```

또는 PM2 사용:
```bash
pm2 start ecosystem.config.cjs
```

### 3. 브라우저에서 접속
- 메인 페이지: http://localhost:3000
- 관리자 페이지: http://localhost:3000/admin

## 🌐 현재 실행 중인 서버

**서버 URL**: https://3000-iqisbuvifle5g7r5rr66f-6532622b.e2b.dev

- **메인 페이지**: https://3000-iqisbuvifle5g7r5rr66f-6532622b.e2b.dev/
- **관리자 페이지**: https://3000-iqisbuvifle5g7r5rr66f-6532622b.e2b.dev/admin
- **API 엔드포인트**: https://3000-iqisbuvifle5g7r5rr66f-6532622b.e2b.dev/api/storybooks

## 📦 Vercel 배포

### 1. Vercel CLI 설치
```bash
npm install -g vercel
```

### 2. 배포
```bash
vercel
```

### 3. 프로덕션 배포
```bash
vercel --prod
```

## 🎨 샘플 동화책

초기 설치 시 3개의 샘플 동화책이 포함되어 있습니다:

1. **숲속의 친구들** (3-5세) - 우정, 자연, 모험
2. **바다 탐험대** (5-7세) - 바다, 모험, 용기
3. **별빛 여행** (4-6세) - 우주, 꿈, 상상

## 📝 관리자 페이지 사용 가이드

### 새 동화책 만들기

1. **기본 정보 입력**
   - 제목, 작가, 표지 이미지 URL
   - 연령대, 태그 선택

2. **이미지 URL 일괄 입력**
   ```
   https://example.com/page-01.jpg
   https://example.com/page-02.jpg
   https://example.com/page-03.jpg
   ```
   - 한 줄에 하나씩 URL 입력
   - 입력한 순서대로 페이지 생성

3. **텍스트 일괄 입력**
   ```
   첫 번째 페이지 텍스트
   ---
   두 번째 페이지 텍스트
   ---
   세 번째 페이지 텍스트
   ```
   - `---` 구분자로 페이지 구분
   - 페이지 수와 텍스트 수가 일치해야 함

4. **완료 및 확인**
   - 메인 페이지에서 동화책 확인
   - 뷰어에서 TTS 기능 테스트

## 🔧 API 엔드포인트

### 공개 API
- `GET /api/storybooks` - 전체 동화책 목록
- `GET /api/storybooks/:id` - 특정 동화책 상세

### 관리자 API
- `POST /api/admin/storybooks` - 새 동화책 생성
- `PUT /api/admin/storybooks/:id` - 동화책 정보 수정
- `DELETE /api/admin/storybooks/:id` - 동화책 삭제
- `POST /api/admin/storybooks/:id/pages/bulk-images` - 다중 이미지 URL 추가
- `POST /api/admin/storybooks/:id/pages/bulk-texts` - 텍스트 일괄 입력

## 📱 브라우저 호환성

- Chrome, Edge, Safari, Firefox 최신 버전
- Web Speech API 지원 브라우저 필요 (TTS 기능)
- 모바일 브라우저 지원

## 💡 추천 이미지 호스팅 서비스

- **Unsplash** - 무료 고품질 이미지 (https://unsplash.com)
- **Cloudinary** - CDN + 이미지 최적화 (무료 25GB)
- **ImgBB** - 간단한 이미지 호스팅 (무료 무제한)
- **GitHub** - Git 저장소 내 이미지 (무료 1GB)

## 🎯 완료된 기능

- ✅ 프로젝트 구조 및 초기 설정
- ✅ JSON 데이터 구조 및 샘플 데이터
- ✅ Express 서버 구축
- ✅ 메인 페이지 (동화책 목록)
- ✅ 동화책 뷰어 (TTS 포함)
- ✅ 관리자 페이지 (동화책 생성/수정)
- ✅ 로컬 서버 실행
- ✅ Vercel 배포 준비

## 📚 향후 확장 계획

- 사용자 계정 시스템
- 즐겨찾기 기능
- 동화책 평점 및 리뷰
- 다국어 지원
- PWA (Progressive Web App)
- 배경음악 지원

## 📄 라이선스

MIT License

---

**개발일**: 2025-01-20  
**버전**: 1.0.0  
**개발자**: Genspark AI Assistant
