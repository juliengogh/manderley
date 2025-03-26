const quizForm = document.getElementById('quiz-form');
const showResultButton = document.getElementById('show-result-button');

// 获取所有问题的单选按钮
const questionInputs = Array.from(quizForm.querySelectorAll('input[type="radio"]'));

// 监听表单变化，启用或禁用按钮
quizForm.addEventListener('change', () => {
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
    const roleCounts = {};
    selectedRoles.forEach(role => {
        roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    let finalRole = '';
    const priorityOrder = ["赫卡忒", "青蛇", "艾格尼丝·纳史密斯", "凯瑟琳·坎贝尔", "麦克白", "白蛇"]; // 修改优先级

    // 检查是否有角色被选中超过2次
    for (const role in roleCounts) {
        if (roleCounts[role] >= 2) {
            finalRole = role;
            break;
        }
    }

    // 如果没有角色被选中超过2次，按优先级选择
    if (!finalRole) {
        for (const role of priorityOrder) {
            if (selectedRoles.includes(role)) {
                finalRole = role;
                break;
            }
        }
    }

    // 跳转到结果页面，并传递角色信息
    window.location.href = `result.html?role=${encodeURIComponent(finalRole)}`;
});
