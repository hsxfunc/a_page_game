// 游戏状态
const gameState = {
    resources: {
        wood: 0,
        food: 0
    },
    increments: {
        wood: 1,
        food: 1
    },
    automaticGathering: {
        wood: 0,
        food: 0
    },
    hasInitiatedStory: false
};

// DOM元素引用
const elements = {
    woodCount: document.getElementById('wood-count'),
    foodCount: document.getElementById('food-count'),
    gatherWoodBtn: document.getElementById('gather-wood'),
    huntBtn: document.getElementById('hunt'),
    messagePanel: document.getElementById('message-panel'),
    actionPanel: document.getElementById('action-panel')
};

// 更新显示
function updateDisplay() {
    elements.woodCount.textContent = gameState.resources.wood;
    elements.foodCount.textContent = gameState.resources.food;
}

// 添加信息
function addMessage(message) {
    const p = document.createElement('p');
    p.textContent = message;
    elements.messagePanel.appendChild(p);
    elements.messagePanel.scrollTop = elements.messagePanel.scrollHeight;
}

// 创建新按钮函数
function createButton(id, text, callback) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.addEventListener('click', callback);
    elements.actionPanel.appendChild(button);
    return button;
}

// 进度检查和游戏事件
function checkProgress() {
    // 木材达到10个时解锁建造火堆选项
    if (gameState.resources.wood >= 10 && !document.getElementById('build-fire')) {
        addMessage("木材开始堆积。也许可以生火取暖...");
        createButton('build-fire', '生火', () => {
            if (gameState.resources.wood >= 10) {
                gameState.resources.wood -= 10;
                updateDisplay();
                addMessage("火焰温暖了寒冷的房间。");
                document.getElementById('build-fire').remove();
                
                // 解锁新的选项
                setTimeout(() => {
                    addMessage("现在你可以看清房间了。墙上似乎有什么东西。");
                    createButton('examine-wall', '检查墙壁', () => {
                        addMessage("墙上刻着一些符号，似乎是某种地图。");
                        document.getElementById('examine-wall').remove();
                        createButton('explore', '探索外面', () => {
                            addMessage("你决定走出房间，探索外面的世界...");
                            addMessage("外面是一片森林，资源更加丰富。");
                            gameState.increments.wood = 2;
                            gameState.increments.food = 2;
                            document.getElementById('explore').remove();
                            
                            // 解锁自动收集
                            createButton('build-trap', '制作陷阱 (5木材)', () => {
                                if (gameState.resources.wood >= 5) {
                                    gameState.resources.wood -= 5;
                                    gameState.automaticGathering.food += 0.1;
                                    updateDisplay();
                                    addMessage("你制作了一个简易陷阱，它会自动捕获一些食物。");
                                }
                            });
                        });
                    });
                }, 2000);
            }
        });
    }
}

// 事件监听
elements.gatherWoodBtn.addEventListener('click', () => {
    gameState.resources.wood += gameState.increments.wood;
    updateDisplay();
    checkProgress();
});

elements.huntBtn.addEventListener('click', () => {
    gameState.resources.food += gameState.increments.food;
    updateDisplay();
    
    // 游戏进展事件
    if(gameState.resources.food === 5 && !gameState.hasInitiatedStory) {
        addMessage("你有了一些食物。饥饿感稍微减轻了。");
        gameState.hasInitiatedStory = true;
    }
});

// 自动收集资源
function autoGather() {
    if (gameState.automaticGathering.wood > 0) {
        gameState.resources.wood += gameState.automaticGathering.wood;
    }
    if (gameState.automaticGathering.food > 0) {
        gameState.resources.food += gameState.automaticGathering.food;
    }
    updateDisplay();
    checkProgress();
}

// 游戏循环
function gameLoop() {
    autoGather();
    setTimeout(gameLoop, 1000); // 每秒调用一次
}

// 初始化游戏
function initGame() {
    updateDisplay();
    gameLoop();
}

// 启动游戏
initGame();