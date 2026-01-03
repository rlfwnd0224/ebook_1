const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/data', express.static('data'));

// Helper functions
async function readJsonFile(filePath) {
  try {
    // Vercel 환경에서는 public 폴더 우선 시도
    const publicPath = path.join(__dirname, 'public', filePath);
    const data = await fs.readFile(publicPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 로컬 환경에서는 기존 경로 시도
    const data = await fs.readFile(path.join(__dirname, filePath), 'utf-8');
    return JSON.parse(data);
  }
}

async function writeJsonFile(filePath, data) {
  try {
    // public 폴더에 쓰기 시도
    const publicPath = path.join(__dirname, 'public', filePath);
    await fs.writeFile(publicPath, JSON.stringify(data, null, 2), 'utf-8');
    
    // 기존 경로에도 쓰기 (로컬 환경 호환)
    await fs.writeFile(
      path.join(__dirname, filePath),
      JSON.stringify(data, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Write error:', error.message);
    throw error;
  }
}

function generateStoryId(existingIds) {
  const numbers = existingIds.map(id => parseInt(id.split('-')[1]));
  const maxNumber = Math.max(0, ...numbers);
  const newNumber = (maxNumber + 1).toString().padStart(3, '0');
  return `story-${newNumber}`;
}

// Routes

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 동화책 뷰어
app.get('/reader/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'reader.html'));
});

// 관리자 페이지
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// 게임 선택 페이지
app.get('/games', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'games.html'));
});

// 단어 카드 매칭 게임
app.get('/games/memory-match', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'memory-match.html'));
});

// API: 전체 동화책 목록 조회
app.get('/api/storybooks', async (req, res) => {
  try {
    const index = await readJsonFile('data/index.json');
    res.json(index);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: 특정 동화책 상세 조회
app.get('/api/storybooks/:id', async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await readJsonFile(`data/storybooks/${storyId}.json`);
    res.json(story);
  } catch (error) {
    res.status(404).json({ success: false, error: '동화책을 찾을 수 없습니다.' });
  }
});

// API: 새 동화책 생성
app.post('/api/admin/storybooks', async (req, res) => {
  try {
    const index = await readJsonFile('data/index.json');
    const existingIds = index.storybooks.map(s => s.id);
    const newId = generateStoryId(existingIds);

    const newStoryMeta = {
      id: newId,
      title: req.body.title,
      author: req.body.author || '',
      coverImageUrl: req.body.coverImageUrl || '',
      ageGroup: req.body.ageGroup || '',
      tags: req.body.tags || [],
      pageCount: 0,
      isPublished: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const newStory = {
      ...newStoryMeta,
      description: req.body.description || '',
      pages: [],
      metadata: {
        totalPages: 0,
        estimatedReadTime: '0분',
        difficulty: '쉬움'
      }
    };

    // index.json 업데이트
    index.storybooks.push(newStoryMeta);
    index.lastUpdated = new Date().toISOString();
    await writeJsonFile('data/index.json', index);

    // 개별 동화책 파일 생성
    await writeJsonFile(`data/storybooks/${newId}.json`, newStory);

    res.json({ success: true, id: newId, story: newStory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: 동화책 정보 수정
app.put('/api/admin/storybooks/:id', async (req, res) => {
  try {
    const storyId = req.params.id;
    const updates = req.body;

    // 개별 동화책 파일 읽기
    const story = await readJsonFile(`data/storybooks/${storyId}.json`);

    // 필드 업데이트
    if (updates.title) story.title = updates.title;
    if (updates.author !== undefined) story.author = updates.author;
    if (updates.coverImageUrl !== undefined) story.coverImageUrl = updates.coverImageUrl;
    if (updates.ageGroup !== undefined) story.ageGroup = updates.ageGroup;
    if (updates.tags !== undefined) story.tags = updates.tags;
    if (updates.description !== undefined) story.description = updates.description;
    if (updates.isPublished !== undefined) story.isPublished = updates.isPublished;
    if (updates.pages !== undefined) {
      story.pages = updates.pages;
      story.metadata.totalPages = updates.pages.length;
      story.pageCount = updates.pages.length;
    }

    story.updatedAt = new Date().toISOString().split('T')[0];

    // 개별 파일 저장
    await writeJsonFile(`data/storybooks/${storyId}.json`, story);

    // index.json 업데이트
    const index = await readJsonFile('data/index.json');
    const storyIndex = index.storybooks.findIndex(s => s.id === storyId);
    if (storyIndex !== -1) {
      index.storybooks[storyIndex] = {
        id: story.id,
        title: story.title,
        author: story.author,
        coverImageUrl: story.coverImageUrl,
        ageGroup: story.ageGroup,
        tags: story.tags,
        pageCount: story.pages.length,
        isPublished: story.isPublished || false,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt
      };
      index.lastUpdated = new Date().toISOString();
      await writeJsonFile('data/index.json', index);
    }

    res.json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: 동화책 삭제
app.delete('/api/admin/storybooks/:id', async (req, res) => {
  try {
    const storyId = req.params.id;

    // index.json에서 제거
    const index = await readJsonFile('data/index.json');
    index.storybooks = index.storybooks.filter(s => s.id !== storyId);
    index.lastUpdated = new Date().toISOString();
    await writeJsonFile('data/index.json', index);

    // 개별 파일 삭제
    await fs.unlink(path.join(__dirname, `data/storybooks/${storyId}.json`));

    res.json({ success: true, message: '동화책이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: 다중 이미지 URL 추가
app.post('/api/admin/storybooks/:id/pages/bulk-images', async (req, res) => {
  try {
    const storyId = req.params.id;
    const { imageUrls, replace = false } = req.body;

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ success: false, error: '이미지 URL 배열이 필요합니다.' });
    }

    const story = await readJsonFile(`data/storybooks/${storyId}.json`);

    // replace 옵션이 true면 기존 페이지를 모두 교체, false면 추가
    if (replace) {
      // 기존 페이지를 모두 삭제하고 새로 생성
      story.pages = imageUrls.map((url, index) => ({
        pageNumber: index + 1,
        imageUrl: url,
        text: '',
        ttsSettings: {
          voice: 'female',
          speed: 1.0,
          autoPlay: true
        }
      }));
    } else {
      // 기존 페이지에 추가
      const startPageNumber = story.pages.length + 1;
      const newPages = imageUrls.map((url, index) => ({
        pageNumber: startPageNumber + index,
        imageUrl: url,
        text: '',
        ttsSettings: {
          voice: 'female',
          speed: 1.0,
          autoPlay: true
        }
      }));
      story.pages.push(...newPages);
    }

    story.metadata.totalPages = story.pages.length;
    story.pageCount = story.pages.length;
    story.updatedAt = new Date().toISOString().split('T')[0];

    await writeJsonFile(`data/storybooks/${storyId}.json`, story);

    // index.json 업데이트
    const index = await readJsonFile('data/index.json');
    const storyIndex = index.storybooks.findIndex(s => s.id === storyId);
    if (storyIndex !== -1) {
      index.storybooks[storyIndex].pageCount = story.pages.length;
      index.storybooks[storyIndex].updatedAt = story.updatedAt;
      await writeJsonFile('data/index.json', index);
    }

    res.json({ 
      success: true, 
      totalPages: story.pages.length,
      message: replace ? '페이지가 교체되었습니다.' : '페이지가 추가되었습니다.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: 텍스트 일괄 입력
app.post('/api/admin/storybooks/:id/pages/bulk-texts', async (req, res) => {
  try {
    const storyId = req.params.id;
    const { texts } = req.body;

    if (!texts || typeof texts !== 'string') {
      return res.status(400).json({ success: false, error: '텍스트 문자열이 필요합니다.' });
    }

    // '---' 구분자로 분할
    const textArray = texts.split('---').map(t => t.trim()).filter(t => t);

    const story = await readJsonFile(`data/storybooks/${storyId}.json`);

    // 페이지 수 체크
    if (textArray.length !== story.pages.length) {
      return res.json({
        success: false,
        warning: `텍스트 ${textArray.length}개와 페이지 ${story.pages.length}개가 일치하지 않습니다.`
      });
    }

    // 텍스트 할당
    story.pages.forEach((page, index) => {
      page.text = textArray[index] || '';
    });

    story.updatedAt = new Date().toISOString().split('T')[0];
    await writeJsonFile(`data/storybooks/${storyId}.json`, story);

    res.json({ success: true, pagesUpdated: textArray.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📚 메인 페이지: http://localhost:${PORT}`);
  console.log(`⚙️  관리자 페이지: http://localhost:${PORT}/admin`);
});
