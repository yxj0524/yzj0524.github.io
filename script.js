let score = 0;
let hungerLevel = 0;
const maxHunger = 100;

// 定义所有可能的食物
const allFoods = [
    "🍕", "🍔", "🍜", "🍱", "🍖", "🍗", "🍣", "🍙", "🍘", "🍥", 
    "🍡", "🍢", "🍦", "🍧", "🍨", "🍩", "🍪", "🍫", "🍬", "🍭",
    "🍮", "🍯", "🍰", "🍱", "🍲", "🍳", "🍴", "🍵", "🍶", "🍷",
    "🍸", "🍹", "🍺", "🍻", "🍼", "🍽", "🍾", "🍿", "🎂", "🍪"
];

// 防止iOS双击缩放
document.addEventListener('touchend', (e) => {
    e.preventDefault();
}, { passive: false });

// 防止iOS长按菜单
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
}, { passive: false });

// 眼睛追踪鼠标/触摸
function trackMouse(e) {
    const eyes = document.querySelectorAll('.pupil');
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        
        // 计算鼠标/触摸和眼睛中心的角度
        const angle = Math.atan2(clientY - eyeY, clientX - eyeX);
        
        // 计算距离，但限制最大距离
        const maxDistance = 6; // 最大移动距离
        const distance = Math.min(
            Math.sqrt(Math.pow(clientX - eyeX, 2) + Math.pow(clientY - eyeY, 2)) / 50,
            maxDistance
        );
        
        // 计算x和y的移动距离
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        // 应用平滑过渡
        eye.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
}

// 添加鼠标和触摸事件监听，使用requestAnimationFrame优化性能
let ticking = false;
const events = ['mousemove', 'touchmove'];
events.forEach(eventType => {
    document.addEventListener(eventType, (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                trackMouse(e);
                ticking = false;
            });
            ticking = true;
        }
    });
});

// 防止触摸时页面滚动
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// 随机选择6个不同的食物
function getRandomFoods() {
    const shuffled = [...allFoods].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
}

// 更新食物按钮
function updateFoodButtons() {
    const foodItems = document.querySelector('.food-items');
    foodItems.innerHTML = '';
    
    const randomFoods = getRandomFoods();
    randomFoods.forEach(food => {
        const button = document.createElement('button');
        button.className = 'food';
        button.textContent = food;
        button.onclick = () => feedMe(button);
        foodItems.appendChild(button);
    });
}

function updateHungerMeter() {
    const meterFill = document.querySelector('.meter-fill');
    const percentage = (hungerLevel / maxHunger) * 100;
    meterFill.style.width = `${percentage}%`;
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function feedMe(foodButton) {
    const character = document.querySelector('.character');
    const mouth = document.querySelector('.mouth');
    const mouthRect = mouth.getBoundingClientRect();
    const foodRect = foodButton.getBoundingClientRect();
    
    // 添加吃东西的动画
    character.classList.add('eating');
    
    // 计算食物飞向嘴巴的位置
    const x = mouthRect.left - foodRect.left;
    const y = mouthRect.top - foodRect.top;
    
    // 设置食物飞行动画
    foodButton.style.setProperty('--x', `${x}px`);
    foodButton.style.setProperty('--y', `${y}px`);
    foodButton.classList.add('flying');
    
    // 禁用所有食物按钮
    document.querySelectorAll('.food').forEach(btn => {
        btn.disabled = true;
    });
    
    setTimeout(() => {
        foodButton.classList.remove('flying');
        foodButton.style.transform = 'scale(1)';
        
        // 更新分数和饥饿度
        score += 10;
        hungerLevel = Math.min(hungerLevel + 20, maxHunger);
        updateScore();
        updateHungerMeter();
        
        // 移除吃东西的动画
        character.classList.remove('eating');
        
        // 重新启用所有食物按钮并更新食物列表
        updateFoodButtons();
    }, 1000);
}

// 初始化食物按钮
updateFoodButtons();

// 定期减少饥饿度
setInterval(() => {
    if (hungerLevel > 0) {
        hungerLevel = Math.max(hungerLevel - 5, 0);
        updateHungerMeter();
    }
}, 3000); 