# 📚 동화책 이북 뷰어 + 학습 게임 플랫폼

유아 교육을 위한 인터랙티브 동화책 + 학습 게임 통합 웹 플랫폼입니다.

## 🎯 주요 기능

### 사용자 기능
- 📖 **동화책 목록**: 연령대별, 태그별 필터링 및 검색
- 📱 **동화책 뷰어**: 이미지와 텍스트가 함께 표시되는 뷰어
- 🔊 **TTS 읽어주기**: Web Speech API를 활용한 자동 음성 읽기
  - 속도 조절 (느림/보통/빠름)
  - 자동 페이지 넘김
  - 키보드 단축키 지원 (← → 스페이스바)
  - 모바일 최적화 (TTS 컨트롤 토글)
- 💾 **진행률 저장**: LocalStorage를 활용한 읽기 진행률 저장
- 🎮 **학습 게임 시스템** (🆕 v5.0):
  - 각 동화책마다 8개 학습 단어
  - 단어 카드 매칭 게임 (3단계 난이도)
  - 타이머, 점수, 통계 시스템
  - 게임 완료 화면 (별점, 메달)

### 관리자 기능
- ➕ **동화책 생성**: 기본 정보 입력으로 새 동화책 생성
- 🔄 **통합 편집 화면**: 이미지 URL과 텍스트를 한 화면에서 동시 수정
  - 기존 데이터 자동 로드 및 표시
  - 이미지 URL과 텍스트 나란히 조회 및 수정
  - 실시간 개수 확인 및 불일치 경고
  - 페이지별 미리보기로 URL 유효성 검사
- 🎮 **학습 단어 관리** (🆕 v5.0):
  - 8개 학습 단어 입력/수정 (단어, 뜻, 예문, 이미지)
  - 기존 학습 단어 자동 로드
  - 이미지 미리보기
- 🖼️ **다중 이미지 URL 입력**: 한 번에 여러 페이지의 이미지 URL 입력
- 📝 **텍스트 일괄 입력**: `---` 구분자로 모든 페이지 텍스트 한 번에 입력
- 🗑️ **동화책 삭제**: 동화책 및 관련 데이터 삭제

## 🏗️ 기술 스택

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript + CSS
- **Data Storage**: JSON 파일 기반
- **Image Storage**: 외부 URL (ImgBB, CDN)
- **Audio**: Web Speech API (브라우저 내장 TTS)
- **Deployment**: Vercel (프로덕션) + PM2 (개발)
- **Version Control**: Git + GitHub

## 📂 프로젝트 구조

```
webapp/
├── server.js                    # Express 서버
├── package.json                 # 프로젝트 설정
├── ecosystem.config.cjs         # PM2 설정
├── vercel.json                  # Vercel 배포 설정
├── data/                        # JSON 데이터
│   ├── index.json               # 동화책 목록
│   └── storybooks/              # 개별 동화책 데이터 (8개)
│       ├── story-001.json       # 백설공주 (학습단어 8개)
│       ├── story-002.json       # 신데렐라
│       ├── story-003.json       # 잠자는 숲속의 공주
│       ├── story-004.json       # 미녀와 야수
│       ├── story-005.json       # 라푼젤
│       ├── story-006.json       # 빨간 모자
│       ├── story-007.json       # 헨젤과 그레텔
│       └── story-008.json       # 타임키즈_세종대왕 🆕
├── views/                       # HTML 페이지
│   ├── index.html               # 메인 페이지
│   ├── reader.html              # 동화책 뷰어
│   ├── admin.html               # 관리자 페이지
│   ├── learning-words.html      # 학습 단어 설정 🆕
│   ├── games.html               # 게임 선택 화면 🆕
│   └── memory-match.html        # 단어 카드 매칭 게임 🆕
├── public/                      # 정적 리소스
│   ├── css/style.css
│   ├── js/
│   │   ├── main.js
│   │   └── memory-match.js      # 게임 로직 🆕
│   └── data/                    # Vercel용 정적 데이터
├── 게임_기획서.md                # 학습 게임 기획 문서 🆕
└── 동화책_이북_뷰어_PRD_v5.0.html # PRD 문서 (최신)
```

## 🚀 로컬 개발 환경 실행

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 시작
```bash
# PM2 사용 (권장)
pm2 start ecosystem.config.cjs

# 또는 Nodemon
npm run dev
```

### 3. 브라우저에서 접속
- 메인 페이지: http://localhost:3000
- 관리자 페이지: http://localhost:3000/admin
- 게임 선택: http://localhost:3000/games?story=story-001

## 🌐 배포된 서버

### 🚀 Vercel (프로덕션)
**URL**: https://ebook-1.vercel.app

- **메인 페이지**: https://ebook-1.vercel.app/
- **백설공주**: https://ebook-1.vercel.app/reader/story-001
- **게임 선택**: https://ebook-1.vercel.app/games?story=story-001
- **카드 게임**: https://ebook-1.vercel.app/games/memory-match?story=story-001
- **관리자**: https://ebook-1.vercel.app/admin
- **학습 단어 설정**: https://ebook-1.vercel.app/admin/learning-words

### 🛠️ 개발 서버
**URL**: https://3000-ilu862xeoen3yf8noqf4w-6532622b.e2b.dev

## 🎮 학습 게임 사용 가이드 (🆕 v5.0)

### 사용자 - 게임 플레이
1. 동화책 읽기 (예: 백설공주)
2. **🎮 학습 게임** 버튼 클릭
3. 게임 선택 화면에서 **🃏 단어 카드 매칭** 클릭
4. 난이도 선택:
   - **쉬움**: 4쌍 (8장) - 3-4세
   - **보통**: 6쌍 (12장) - 5-6세
   - **어려움**: 8쌍 (16장) - 7세+
5. 카드 클릭해서 짝 맞추기
6. 게임 완료 시 결과 확인:
   - ⭐ 별점 (1-3개)
   - 🏅 메달 (금/은/동)
   - 📊 통계 (시간, 시도, 점수)

### 관리자 - 학습 단어 추가
1. 관리자 페이지 접속
2. 동화책 **편집** 버튼 클릭
3. **🎮 학습 단어 설정** 버튼 클릭
4. 8개 단어 입력:
   - **단어**: 한글 (예: 왕비)
   - **뜻**: 간단한 설명 (예: 왕의 아내)
   - **예문**: 문장 (예: 새로운 왕비가 궁전에 도착했어요.)
   - **이미지 URL**: 동화책 이미지 재사용 가능
5. **💾 저장하기** 클릭
6. 동화책 뷰어에서 게임 버튼 확인

## 📦 Vercel 배포

### GitHub 연동 자동 배포 (권장)
```bash
# 코드 수정 후
git add .
git commit -m "메시지"
git push origin main

# Vercel이 자동으로 빌드 및 배포 (1-2분 소요)
```

### CLI 배포
```bash
npm install -g vercel
vercel --prod
```

## 📚 동화책 목록 (총 8개, 168페이지)

| No. | 제목 | 작가 | 페이지 | 학습 단어 | 게임 |
|-----|------|------|--------|----------|------|
| 1 | 백설공주 | 그림 형제 | 20 | ✅ 8개 | ✅ 가능 |
| 2 | 신데렐라 | 샤를 페로 | 20 | ❌ | ❌ |
| 3 | 잠자는 숲속의 공주 | 샤를 페로 | 20 | ❌ | ❌ |
| 4 | 미녀와 야수 | 보몽 부인 | 18 | ❌ | ❌ |
| 5 | 라푼젤 | 그림 형제 | 20 | ❌ | ❌ |
| 6 | 빨간 모자 | 샤를 페로 | 20 | ❌ | ❌ |
| 7 | 헨젤과 그레텔 | 그림 형제 | 20 | ❌ | ❌ |
| 8 | 타임키즈_세종대왕 🆕 | 김길중 | 30 | ❌ | ❌ |

### 백설공주 학습 단어 (story-001)

1. **왕비** - 왕의 아내
2. **거울** - 자신의 모습을 비춰볼 수 있는 물건
3. **사과** - 빨갛고 둥근 맛있는 과일
4. **난쟁이** - 키가 아주 작은 사람
5. **독약** - 먹으면 몸에 해로운 약
6. **숲** - 나무가 많이 모여 있는 곳
7. **성** - 왕과 공주가 사는 큰 집
8. **마법** - 신비한 힘으로 이상한 일을 하는 것

## 📝 관리자 페이지 사용 가이드

### 새 동화책 만들기 및 편집

#### 1. 기본 정보 입력 (Step 1)
- 제목, 작가, 표지 이미지 URL
- 연령대, 태그 선택
- 공개 상태 설정
- "저장 및 다음" 클릭

#### 2. 통합 편집 화면 (Step 2)

**기존 동화책 편집 시**:
- Step 2 진입하면 기존 페이지 데이터가 **자동으로 로드**됩니다
- 이미지 URL과 텍스트를 **나란히 동시에 조회 및 수정** 가능

**이미지 URL 입력/수정** (왼쪽):
```
https://example.com/page-01.jpg
https://example.com/page-02.jpg
https://example.com/page-03.jpg
```
- 한 줄에 하나씩 URL 입력
- 실시간 개수 표시

**텍스트 입력/수정** (오른쪽):
```
첫 번째 페이지 텍스트
---
두 번째 페이지 텍스트
---
세 번째 페이지 텍스트
```
- `---` 구분자로 페이지 구분
- 실시간 개수 표시

**미리보기 및 검증**:
- 🔄 기존 데이터 불러오기
- 👁️ 미리보기: 페이지별 이미지/텍스트 확인
- ⚠️ URL 유효성 검사
- ✅ 카운트 일치 확인
- 💾 저장하기

#### 3. 학습 단어 설정 (Step 2.5 - 선택사항)
- 🎮 학습 단어 설정 버튼 클릭
- 8개 단어 입력 (단어/뜻/예문/이미지)
- 저장 후 게임 사용 가능

#### 4. 완료 및 확인 (Step 3)
- 저장 완료 메시지
- 📖 동화책 보기
- 목록으로

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
- `PUT /api/admin/storybooks/:id/learning-words` - 학습 단어 저장 🆕

### 페이지 라우트
- `/` - 메인 페이지
- `/reader/:id` - 동화책 뷰어
- `/admin` - 관리자 페이지
- `/admin/learning-words` - 학습 단어 설정 🆕
- `/games` - 게임 선택 화면 🆕
- `/games/memory-match` - 단어 카드 매칭 게임 🆕

## 📱 브라우저 호환성

- Chrome, Edge, Safari, Firefox 최신 버전
- Web Speech API 지원 브라우저 필요 (TTS 기능)
- 모바일 브라우저 지원 (반응형 디자인)

## 💡 추천 이미지 호스팅 서비스

- **ImgBB** - 간단한 무료 호스팅 (https://imgbb.com)
  - 올바른 형식: `https://i.ibb.co/{imageID}/{filename}.jpg`
  - 예시: `https://i.ibb.co/RKpJ93m/0.jpg`
- **Cloudinary** - CDN + 이미지 최적화 (무료 25GB)
- **Unsplash** - 무료 고품질 이미지
- **GitHub** - Git 저장소 내 이미지

## 🎯 완료된 기능 (v5.0)

### 기본 기능
- ✅ 프로젝트 구조 및 초기 설정
- ✅ JSON 데이터 구조 및 8개 동화책 (168페이지)
- ✅ Express 서버 구축 및 API
- ✅ 메인 페이지 (필터링, 검색)
- ✅ 동화책 뷰어 (TTS, 진행률 저장, 키보드 단축키)
- ✅ 관리자 페이지 (생성/수정/삭제)
- ✅ 모바일 반응형 UI
- ✅ Git 버전 관리 및 GitHub 연동
- ✅ Vercel 배포 완료

### 학습 게임 시스템 (🆕 v5.0)
- ✅ 학습 단어 데이터 구조 (8개 단어/동화책)
- ✅ 백설공주 학습 단어 8개 입력 완료
- ✅ 게임 선택 화면 (학습 단어 미리보기)
- ✅ 단어 카드 매칭 게임:
  - ✅ 3단계 난이도 (쉬움/보통/어려움)
  - ✅ 타이머 및 시도 횟수 카운트
  - ✅ 점수 시스템
  - ✅ 게임 완료 화면 (별점, 메달, 통계)
  - ✅ 카드 뒤집기 애니메이션 (opacity)
  - ✅ 모바일 반응형
- ✅ 학습 단어 관리 페이지
- ✅ 동화책 뷰어에 게임 버튼 추가
- ✅ CSS 버그 수정 (카드 뒷면 표시 문제 해결)

## 🔄 개발 진행 중

- 🔄 나머지 7개 동화책에 학습 단어 추가
- 🔄 게임 2: 단어 퀴즈 구현
- 🔄 게임 3: 단어 만들기 구현

## 📚 향후 확장 계획

- 효과음 추가 (정답/오답/완료)
- 학습 기록 저장 (localStorage)
- 레벨/배지 시스템
- 부모용 학습 리포트
- 사용자 계정 시스템
- 즐겨찾기 기능
- 동화책 평점 및 리뷰
- 다국어 지원
- PWA (Progressive Web App)

## 📊 프로젝트 통계

- **총 동화책**: 8개 (168페이지)
- **학습 단어**: 1개 동화책 (백설공주, 8개 단어)
- **학습 게임**: 1개 (단어 카드 매칭)
- **Git 커밋**: 20+ commits
- **코드 라인**: 5,000+ lines

## 📄 문서

- **PRD v5.0**: [동화책_이북_뷰어_PRD_v5.0.html](동화책_이북_뷰어_PRD_v5.0.html)
- **게임 기획서**: [게임_기획서.md](게임_기획서.md)
- **GitHub**: https://github.com/rlfwnd0224/ebook_1

## 📄 라이선스

MIT License

---

**개발 시작**: 2025-12-16  
**최종 업데이트**: 2026-01-03  
**버전**: 5.0 (학습 게임 추가)  
**개발자**: Genspark AI Assistant  
**GitHub**: https://github.com/rlfwnd0224/ebook_1  
**Vercel**: https://ebook-1.vercel.app
