// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 设置信封启封
  setupEnvelopeOpening();

  // 设置音频
  setupAudio();

  // 触发信件动画
  triggerLetterAnimations();

  // 添加滚动监听
  setupScrollAnimation();

  // 初始化回忆功能
  initMemoryFeature();
});

// 信封启封设置
function setupEnvelopeOpening() {
  console.log('开始设置信封启封功能...');

  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const envelopeContainer = document.getElementById('envelopeContainer');

  console.log('envelopeWrapper:', envelopeWrapper);
  console.log('envelopeContainer:', envelopeContainer);

  if (envelopeContainer && envelopeWrapper) {
    envelopeContainer.addEventListener('click', function(e) {
      console.log('信封被点击！');

      // 开始启封动画
      envelopeContainer.classList.add('opened');

      // 延迟后移除信封（1.8秒动画 + 0.5秒缓冲）
      setTimeout(() => {
        envelopeWrapper.classList.add('opened');
        console.log('信封已开启');

        // 信封开启后开始播放音乐
        const audio = document.getElementById('bgMusic');
        if (audio) {
          audio.play().then(() => {
            console.log('背景音乐开始播放');
          }).catch(error => {
            console.log('音频播放失败:', error);
          });
        }
      }, 2300);
    });

    console.log('✅ 信封启封功能已就绪，请点击信封');
  } else {
    console.error('❌ 信封元素未找到！');
  }
}

// 音频设置
function setupAudio() {
  const audio = document.getElementById('bgMusic');
  const audioControl = document.getElementById('audioControl');
  let isPlaying = false;

  // 音频控制按钮点击事件
  if (audioControl) {
    audioControl.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        audioControl.classList.remove('playing');
        audioControl.textContent = '🎵';
        console.log('背景音乐暂停');
      } else {
        audio.play().then(() => {
          isPlaying = true;
          audioControl.classList.add('playing');
          audioControl.textContent = '🎵';
          console.log('背景音乐播放');
        }).catch(error => {
          console.log('播放失败:', error);
        });
      }
    });
  }

  // 监听音频播放状态
  audio.addEventListener('play', () => {
    isPlaying = true;
    if (audioControl) {
      audioControl.classList.add('playing');
    }
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    if (audioControl) {
      audioControl.classList.remove('playing');
    }
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    if (audioControl) {
      audioControl.classList.remove('playing');
    }
  });

  console.log('音频控制已就绪');
}

// 触发信件动画
function triggerLetterAnimations() {
  const animatedElements = document.querySelectorAll('.line-animate');

  animatedElements.forEach(el => {
    el.style.animationPlayState = 'paused';
  });

  // 等待信封开启后才开始文字动画
  setTimeout(() => {
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'running';
    });
    console.log('信件按行动画开始');
  }, 3800); // 信封开启后1.8秒 + 界面切换0.5秒 + 缓冲1.5秒
}

// 设置滚动动画
function setupScrollAnimation() {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = entry.target.querySelectorAll('.line-animate');
        lines.forEach((line, index) => {
          if (!line.classList.contains('visible')) {
            line.classList.add('visible');
            line.style.animationPlayState = 'running';
          }
        });
      }
    });
  }, observerOptions);

  // 观察所有文本块
  const textBlocks = document.querySelectorAll('.letter-text, .letter-closing, .letter-opening');
  textBlocks.forEach(block => {
    observer.observe(block);
  });
}

// 添加平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// 监听键盘事件
document.addEventListener('keydown', (e) => {
  // 空格键：暂停/继续动画
  if (e.code === 'Space') {
    e.preventDefault();
    const animatedElements = document.querySelectorAll('.line-animate');
    animatedElements.forEach(el => {
      const currentState = el.style.animationPlayState;
      el.style.animationPlayState = currentState === 'paused' ? 'running' : 'paused';
    });
    console.log('动画状态已切换');
  }

  // 方向下键：快速跳转到下一个可见的段落
  if (e.code === 'ArrowDown') {
    e.preventDefault();
    const visibleSections = Array.from(document.querySelectorAll('.letter-section'));
    const currentScroll = window.scrollY + window.innerHeight / 2;

    for (let i = 0; i < visibleSections.length; i++) {
      const section = visibleSections[i];
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;

      if (sectionTop > currentScroll) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  }

  // 方向上键：快速跳转到上一个段落
  if (e.code === 'ArrowUp') {
    e.preventDefault();
    const visibleSections = Array.from(document.querySelectorAll('.letter-section'));
    const currentScroll = window.scrollY + window.innerHeight / 2;

    for (let i = visibleSections.length - 1; i >= 0; i--) {
      const section = visibleSections[i];
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;

      if (sectionTop < currentScroll - 100) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  }

  // Home键：回到顶部
  if (e.code === 'Home') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // End键：跳到底部
  if (e.code === 'End') {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

// 打印功能
window.printLetter = function() {
  window.print();
};

// ========== 一起创建回忆功能 ==========

// 初始化回忆功能
function initMemoryFeature() {
  console.log('🎬 开始初始化回忆功能...');

  const memoryBtn = document.getElementById('memoryBtn');
  const memoryModal = document.getElementById('memoryModal');
  const closeModal = document.getElementById('closeModal');
  const photoUpload = document.getElementById('photoUpload');
  const memoryPhoto = document.getElementById('memoryPhoto');
  const photoPreview = document.getElementById('photoPreview');
  const submitMemory = document.getElementById('submitMemory');
  const memoriesHistory = document.getElementById('memoriesHistory');
  const memoriesGrid = document.getElementById('memoriesGrid');

  console.log('🔍 DOM元素检查:');
  console.log('  memoryBtn:', memoryBtn);
  console.log('  memoryModal:', memoryModal);
  console.log('  submitMemory:', submitMemory);
  console.log('  photoPreview:', photoPreview);
  console.log('  memoriesGrid:', memoriesGrid);

  if (!memoryBtn || !memoryModal || !submitMemory || !memoriesGrid) {
    console.error('❌ 关键DOM元素未找到！');
    return;
  }

  console.log('✅ 所有关键元素已找到');

  // 打开弹窗
  memoryBtn.addEventListener('click', () => {
    memoryModal.classList.add('active');
    loadMemories();
  });

  // 关闭弹窗
  closeModal.addEventListener('click', () => {
    memoryModal.classList.remove('active');
    resetForm();
  });

  // 点击背景关闭弹窗
  memoryModal.addEventListener('click', (e) => {
    if (e.target === memoryModal) {
      memoryModal.classList.remove('active');
      resetForm();
    }
  });

  // 点击上传区域选择文件
  photoUpload.addEventListener('click', () => {
    memoryPhoto.click();
  });

  // 拖拽上传
  photoUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    photoUpload.style.borderColor = '#ff69b4';
    photoUpload.style.background = '#ffe4e1';
  });

  photoUpload.addEventListener('dragleave', () => {
    photoUpload.style.borderColor = '#ffb6c1';
    photoUpload.style.background = '#fff9f0';
  });

  photoUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    photoUpload.style.borderColor = '#ffb6c1';
    photoUpload.style.background = '#fff9f0';

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handlePhotoUpload(file);
    } else {
      alert('请上传图片文件！');
    }
  });

  // 照片选择
  memoryPhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handlePhotoUpload(file);
    }
  });

  // 处理照片上传
  function handlePhotoUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.src = e.target.result;
      photoPreview.style.display = 'block';
      document.querySelector('.upload-placeholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // 提交回忆
  submitMemory.addEventListener('click', () => {
    console.log('📝 提交回忆按钮被点击');

    const message = document.getElementById('memoryMessage').value.trim();
    const photoSrc = photoPreview.src;

    console.log('  寄语:', message);
    console.log('  照片src:', photoSrc);
    console.log('  照片显示状态:', photoPreview.style.display);

    if (!photoSrc || photoPreview.style.display === 'none') {
      alert('请上传一张照片！');
      return;
    }

    if (!message) {
      alert('请写下你的寄语！');
      return;
    }

    // 创建回忆对象
    const memory = {
      id: Date.now(),
      photo: photoSrc,
      message: message,
      date: new Date().toLocaleString('zh-CN')
    };

    console.log('  回忆对象:', memory);

    // 保存到localStorage
    saveMemory(memory);

    // 关闭弹窗并重置表单
    memoryModal.classList.remove('active');
    resetForm();

    // 加载并显示历史记录
    loadMemories();

    // 提示成功
    alert('✨ 回忆已保存！');
  });

  console.log('✅ 提交按钮事件已绑定');

  // 重置表单
  function resetForm() {
    document.getElementById('memoryMessage').value = '';
    photoPreview.src = '';
    photoPreview.style.display = 'none';
    document.querySelector('.upload-placeholder').style.display = 'flex';
    memoryPhoto.value = '';
  }

  // 保存回忆
  function saveMemory(memory) {
    let memories = JSON.parse(localStorage.getItem('familyMemories') || '[]');
    memories.unshift(memory);
    localStorage.setItem('familyMemories', JSON.stringify(memories));
  }

  // 加载回忆
  function loadMemories() {
    const memories = JSON.parse(localStorage.getItem('familyMemories') || '[]');

    if (memories.length === 0) {
      memoriesHistory.style.display = 'none';
      return;
    }

    memoriesHistory.style.display = 'block';
    memoriesGrid.innerHTML = '';

    memories.forEach(memory => {
      const card = createMemoryCard(memory);
      memoriesGrid.appendChild(card);
    });
  }

  // 创建回忆卡片
  function createMemoryCard(memory) {
    const card = document.createElement('div');
    card.className = 'memory-card';

    card.innerHTML = `
      <img src="${memory.photo}" alt="回忆照片" class="memory-card-image" onclick="viewImage('${memory.photo}')">
      <div class="memory-card-message">
        <p class="memory-card-text">${escapeHtml(memory.message)}</p>
        <p class="memory-card-date">${memory.date}</p>
      </div>
    `;

    return card;
  }

  // HTML转义
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 查看大图
  window.viewImage = function(src) {
    const viewer = document.createElement('div');
    viewer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 4000;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    `;

    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: 10px;
    `;

    viewer.appendChild(img);
    document.body.appendChild(viewer);

    viewer.addEventListener('click', () => {
      document.body.removeChild(viewer);
    });
  };

  // 页面加载时检查是否有历史记录
  const memories = JSON.parse(localStorage.getItem('familyMemories') || '[]');
  if (memories.length > 0) {
    loadMemories();
  }
}

// 添加页面加载完成的提示
console.log('========================================');
console.log('致爸爸妈妈的一封信页面加载完成');
console.log('========================================');
console.log('使用说明：');
console.log('');
console.log('1. 点击屏幕中央的信封开启信件');
console.log('2. 信封开启后会自动播放背景音乐');
console.log('3. 文字会按行逐渐显示');
console.log('');
console.log('控制说明：');
console.log('- 点击右下角的音乐按钮可以控制背景音乐播放');
console.log('- 按空格键可以暂停/继续按行显示的动画');
console.log('- 按下箭头键可以跳转到下一个段落');
console.log('- 按上箭头键可以跳转到上一个段落');
console.log('- 按Home键回到顶部');
console.log('- 按End键跳到底部');
console.log('- 点击"一起创建回忆"按钮可以上传照片和寄语');
console.log('- 所有回忆数据保存在本地，刷新页面不会丢失');
console.log('========================================');
