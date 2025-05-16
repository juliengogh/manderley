// 添加加载状态检测
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经有缓存的脚本功能
    if (window.manderleyQuizInitialized) {
        return;
    }
    window.manderleyQuizInitialized = true;
    
    initQuiz();
});

function initQuiz() {
    const quizForm = document.getElementById('quiz-form');
    const showResultButton = document.getElementById('show-result-button');

    if (!quizForm || !showResultButton) {
        return;
    }

    // 获取所有问题的单选按钮
    const questionInputs = Array.from(quizForm.querySelectorAll('input[type="radio"]'));

    // 从本地存储恢复已选择的答案
    try {
        const savedAnswers = JSON.parse(localStorage.getItem('manderley_quiz_answers')) || {};
        Object.keys(savedAnswers).forEach(name => {
            const input = quizForm.querySelector(`input[name="${name}"][value="${savedAnswers[name]}"]`);
            if (input) {
                input.checked = true;
            }
        });
    } catch (e) {
        // 忽略本地存储错误
    }

    // 监听表单变化，启用或禁用按钮
    quizForm.addEventListener('change', () => {
        // 保存答案到本地存储
        const answers = {};
        questionInputs.forEach(input => {
            if (input.checked) {
                answers[input.name] = input.value;
            }
        });
        
        try {
            localStorage.setItem('manderley_quiz_answers', JSON.stringify(answers));
        } catch (e) {
            // 忽略本地存储错误
        }

        // 检查每个问题是否至少有一个选项被选中
        const allQuestionsAnswered = Array.from(new Set(questionInputs.map(input => input.name)))
            .every(name => quizForm.querySelector(`input[name="${name}"]:checked`));
        showResultButton.disabled = !allQuestionsAnswered;
    });

    // 显示结果
    showResultButton.addEventListener('click', () => {
        const selectedRoles = [];
        // 获取每个问题的选择
        for (let i = 1; i <= 3; i++) {
            const selectedOption = quizForm.querySelector(`input[name="q${i}"]:checked`);
            if (selectedOption) {
                selectedRoles.push(selectedOption.value);
            }
        }

        // 计算最终角色
        const finalRole = calculateFinalRole(selectedRoles);

        // 跳转到结果页面，并传递角色信息
        window.location.href = `result.html?role=${encodeURIComponent(finalRole)}`;
    });
    
    // 初始检查按钮状态
    const event = new Event('change');
    quizForm.dispatchEvent(event);
    
    // 添加网络状态检测
    window.addEventListener('offline', function() {
        showToast('网络连接已断开，请检查您的网络连接');
    });
    
    // 添加在线检测
    window.addEventListener('online', function() {
        showToast('网络已恢复');
    });
}

function calculateFinalRole(selectedRoles) {
    if (!selectedRoles || selectedRoles.length === 0) {
        return '';
    }

    // 计算角色出现频率
    const roleCounts = {};
    selectedRoles.forEach(role => {
        roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    // 检查是否有角色被选中超过2次
    for (const role in roleCounts) {
        if (roleCounts[role] >= 2) {
            return role;
        }
    }

    // 按优先级选择
    const priorityOrder = ["赫卡忒", "青蛇", "艾格尼丝·纳史密斯", "凯瑟琳·坎贝尔", "麦克白", "白蛇"];
    for (const role of priorityOrder) {
        if (selectedRoles.includes(role)) {
            return role;
        }
    }

    return selectedRoles[0] || '';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '10000';
    toast.style.transition = 'opacity 0.5s';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 3000);
}

// 确保initQuiz可以在全局调用
window.initQuiz = initQuiz;
window.calculateFinalRole = calculateFinalRole;
