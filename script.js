// script.js

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. 登录表单验证（仅登录页使用） ---
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value.trim();
      let errors = [];
      if (!email) errors.push('请输入邮箱地址');
      if (!password) errors.push('请输入密码');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailPattern.test(email)) errors.push('请输入有效的邮箱格式');

      if (errors.length) {
        alert(errors.join('\n'));
      } else {
        alert('登录成功！');
        form.reset();
      }
    });
  }

  // --- 2. 移动端响应式菜单（仅首页使用） ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('open');
    });

    // 点击导航链接后关闭菜单
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('open');
      });
    });
  }

  // --- 3. 滚动高亮监听 (Scroll Spy - 仅首页使用) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollPosition = window.scrollY + 120; // 考虑了粘性导航栏的高度偏移

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else if (currentSectionId === '' && link.getAttribute('href') === '#') {
          link.classList.add('active');
        }
      });
    });
  }
});

// --- 4. 周期订阅 / 按量付费 切换器逻辑 ---
window.togglePricing = function(type) {
  const btnRecurring = document.getElementById('btnRecurring');
  const btnTraffic = document.getElementById('btnTraffic');
  const groupRecurring = document.getElementById('groupRecurring');
  const groupTraffic = document.getElementById('groupTraffic');

  if (btnRecurring && btnTraffic && groupRecurring && groupTraffic) {
    if (type === 'recurring') {
      btnRecurring.classList.add('active');
      btnTraffic.classList.remove('active');
      groupRecurring.classList.remove('hidden');
      groupTraffic.classList.add('hidden');
    } else {
      btnRecurring.classList.remove('active');
      btnTraffic.classList.add('active');
      groupRecurring.classList.add('hidden');
      groupTraffic.classList.remove('hidden');
    }
  }
};

// --- 5. 实时节点延迟测试与负载随机模拟 ---
document.addEventListener('DOMContentLoaded', () => {
  const btnPingTest = document.getElementById('btnPingTest');
  if (btnPingTest) {
    btnPingTest.addEventListener('click', () => {
      // 按钮进入加载状态
      btnPingTest.innerHTML = `<svg class="ping-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s infinite linear;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1021 12h-4.5" /></svg>正在测试节点延迟...`;
      btnPingTest.disabled = true;

      const cards = document.querySelectorAll('.db-node-card');
      cards.forEach((card, idx) => {
        const pingValueEl = card.querySelector('.ping-value');
        const loadNumEl = card.querySelector('.load-num');
        const progressFillEl = card.querySelector('.node-progress-fill');
        
        if (pingValueEl) pingValueEl.textContent = '检测中...';
        
        setTimeout(() => {
          // 获取卡片上的基准延迟
          const basePing = parseInt(card.getAttribute('data-base-ping'), 10) || 20;
          const randomOffset = Math.floor(Math.random() * 9) - 4; // -4ms 到 +4ms 波动
          const finalPing = Math.max(2, basePing + randomOffset);
          
          if (pingValueEl) pingValueEl.textContent = finalPing + 'ms';
          
          // 负载随机波动
          const newLoad = Math.floor(Math.random() * 45) + 5; // 5% 到 50%
          if (loadNumEl) loadNumEl.textContent = newLoad + '%';
          if (progressFillEl) progressFillEl.style.width = newLoad + '%';

          // 重新根据延迟区间分配卡片类名与颜色
          card.className = 'db-node-card';
          if (finalPing < 40) {
            card.classList.add('green');
          } else if (finalPing < 100) {
            card.classList.add('orange');
          } else {
            card.classList.add('blue');
          }

          // 最后一个卡片渲染完成后恢复测试按钮
          if (idx === cards.length - 1) {
            setTimeout(() => {
              btnPingTest.innerHTML = `<svg class="ping-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>一键测试实时延迟`;
              btnPingTest.disabled = false;
            }, 300);
          }
        }, 300 + idx * 60); // 阶梯式延迟展示，营造极其逼真的扫描感
      });
    });
  }
});

// CSS 旋转动画注入
const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

// --- 6. 周期订阅价格动态切换逻辑 ---
window.updateCardPrice = function(select) {
  const card = select.closest('.pricing-card');
  if (!card) return;
  const priceValEl = card.querySelector('.price-val');
  const periodEl = card.querySelector('.period');
  const saveLabelEl = card.querySelector('.save-label');
  
  const selectedOption = select.options[select.selectedIndex];
  if (!selectedOption) return;
  const price = selectedOption.getAttribute('data-price');
  const period = selectedOption.getAttribute('data-period');
  const save = selectedOption.getAttribute('data-save');
  
  if (priceValEl) {
    priceValEl.classList.add('price-updating');
    setTimeout(() => {
      priceValEl.textContent = price;
      if (periodEl) periodEl.textContent = period;
      if (saveLabelEl) saveLabelEl.textContent = save;
      priceValEl.classList.remove('price-updating');
    }, 150);
  }
};


// --- 7. 自定义高级下拉框 (Custom Animated Select) ---
document.addEventListener('DOMContentLoaded', () => {
  const selects = document.querySelectorAll('.cycle-select');
  
  selects.forEach(select => {
    // 隐藏原生 select
    select.style.display = 'none';
    
    // 创建自定义的外层包裹
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    
    // 获取当前选中的文本
    const selectedOptionText = select.options[select.selectedIndex]?.text || '';
    
    // 创建触发按钮
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    trigger.innerHTML = `<span>${selectedOptionText}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>`;
    
    // 创建选项列表容器
    const optionsList = document.createElement('div');
    optionsList.className = 'custom-options-list';
    
    // 遍历原生选项并创建自定义选项
    Array.from(select.options).forEach((option, index) => {
      const customOption = document.createElement('div');
      customOption.className = 'custom-option';
      if (index === select.selectedIndex) {
        customOption.classList.add('selected');
      }
      customOption.textContent = option.text;
      customOption.dataset.value = option.value;
      
      // 选项点击事件
      customOption.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // 更新原生 select 的值
        select.selectedIndex = index;
        
        // 更新触发按钮的文本
        trigger.querySelector('span').textContent = option.text;
        
        // 更新选中样式
        optionsList.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
        customOption.classList.add('selected');
        
        // 触发原生 onchange 的价格更新逻辑
        if (typeof window.updateCardPrice === 'function') {
          window.updateCardPrice(select);
        }
        
        // 收起下拉菜单
        wrapper.classList.remove('open');
      });
      
      optionsList.appendChild(customOption);
    });
    
    wrapper.appendChild(trigger);
    wrapper.appendChild(optionsList);
    
    // 将自定义下拉框插入到 DOM 中（原生 select 的后面）
    select.parentNode.insertBefore(wrapper, select.nextSibling);
    
    // 触发按钮点击事件（展开/收起）
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      // 关闭其他可能打开的下拉框
      document.querySelectorAll('.custom-select-wrapper.open').forEach(other => {
        if (other !== wrapper) other.classList.remove('open');
      });
      wrapper.classList.toggle('open');
    });
  });
  
  // 点击页面空白处收起所有下拉框
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-wrapper.open').forEach(wrapper => {
      wrapper.classList.remove('open');
    });
  });
});
