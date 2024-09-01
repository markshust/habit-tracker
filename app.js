// app.js

let habits = [];
let rewards = [];
let redeemLogs = [];
let currentPoints = 0;

function saveData() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('rewards', JSON.stringify(rewards));
    localStorage.setItem('redeemLogs', JSON.stringify(redeemLogs));
    localStorage.setItem('currentPoints', currentPoints);
}

function loadData() {
    habits = JSON.parse(localStorage.getItem('habits')) || [];
    rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    redeemLogs = JSON.parse(localStorage.getItem('redeemLogs')) || [];
    currentPoints = parseInt(localStorage.getItem('currentPoints')) || 0;
}

function renderHabits() {
    const habitsList = document.getElementById('habits-list');
    habitsList.innerHTML = '';
    habits.forEach((habit, index) => {
        const habitElement = document.createElement('div');
        habitElement.className = 'flex items-center justify-between mb-6';
        habitElement.innerHTML = `
            <span>${habit.name} (${habit.points} points)</span>
            <div>
                <button class="bg-green-500 text-white px-4 py-2 rounded mr-2" onclick="addHabitPoint(${index})">+</button>
                <button class="bg-red-500 text-white px-4 py-2 rounded mr-2" onclick="removeHabitPoint(${index})">-</button>
                <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="editHabit(${index})">Edit</button>
            </div>
        `;
        habitsList.appendChild(habitElement);
    });
}

function renderRewards() {
    const rewardsList = document.getElementById('rewards-list');
    rewardsList.innerHTML = '';
    rewards.forEach((reward, index) => {
        const rewardElement = document.createElement('div');
        rewardElement.className = 'flex items-center justify-between mb-6';
        rewardElement.innerHTML = `
            <span>${reward.name} (${reward.points} points)</span>
            <div>
                <button class="bg-yellow-500 text-white px-4 py-2 rounded mr-2" onclick="editReward(${index})">Edit</button>
                <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="removeReward(${index})">Remove</button>
            </div>
        `;
        rewardsList.appendChild(rewardElement);
    });
}

function renderRedeemList() {
    const redeemList = document.getElementById('redeem-list');
    redeemList.innerHTML = '';
    rewards.forEach((reward, index) => {
        const redeemElement = document.createElement('div');
        redeemElement.className = 'flex items-center justify-between mb-6';
        redeemElement.innerHTML = `
            <span>${reward.name} (${reward.points} points)</span>
            <button class="bg-purple-500 text-white px-4 py-2 rounded" onclick="redeemReward(${index})">Redeem</button>
        `;
        redeemList.appendChild(redeemElement);
    });
}

function updateCurrentPoints() {
    document.getElementById('current-points').textContent = `Current Points: ${currentPoints}`;
}

function addHabit() {
    const name = prompt('Enter habit name:');
    const points = parseInt(prompt('Enter points for this habit:'));
    if (name && !isNaN(points)) {
        habits.push({ name, points });
        saveData();
        renderHabits();
    }
}

function editHabit(index) {
    const name = prompt('Enter new habit name:', habits[index].name);
    const points = parseInt(prompt('Enter new points for this habit:', habits[index].points));
    if (name && !isNaN(points)) {
        habits[index] = { name, points };
        saveData();
        renderHabits();
    }
}

function addHabitPoint(index) {
    currentPoints += habits[index].points;
    saveData();
    updateCurrentPoints();
}

function removeHabitPoint(index) {
    currentPoints = Math.max(0, currentPoints - habits[index].points);
    saveData();
    updateCurrentPoints();
}

function addReward() {
    const name = prompt('Enter reward name:');
    const points = parseInt(prompt('Enter points required for this reward:'));
    if (name && !isNaN(points)) {
        rewards.push({ name, points });
        saveData();
        renderRewards();
        renderRedeemList();
    }
}

function editReward(index) {
    const name = prompt('Enter new reward name:', rewards[index].name);
    const points = parseInt(prompt('Enter new points required for this reward:', rewards[index].points));
    if (name && !isNaN(points)) {
        rewards[index] = { name, points };
        saveData();
        renderRewards();
        renderRedeemList();
    }
}

function removeReward(index) {
    rewards.splice(index, 1);
    saveData();
    renderRewards();
    renderRedeemList();
}

function redeemReward(index) {
    const reward = rewards[index];
    if (currentPoints >= reward.points) {
        if (confirm(`Are you sure you want to redeem ${reward.name} for ${reward.points} points?`)) {
            currentPoints -= reward.points;
            redeemLogs.unshift({ ...reward, date: new Date() }); // Use unshift instead of push
            saveData();
            updateCurrentPoints();
            renderRedeemLogs();
        }
    } else {
        alert('Not enough points to redeem this reward.');
    }
}

function renderRedeemLogs() {
    const redeemLog = document.getElementById('redeem-log');
    redeemLog.innerHTML = '';
    
    if (redeemLogs.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'text-gray-500 italic';
        emptyMessage.textContent = 'No points redeemed yet.';
        redeemLog.appendChild(emptyMessage);
    } else {
        redeemLogs.forEach((log, index) => {
            const logElement = document.createElement('div');
            logElement.className = 'flex items-center justify-between mb-6';
            const formattedDate = new Date(log.date).toLocaleString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            logElement.innerHTML = `
                <span>${formattedDate} - ${log.name} (${log.points} points)</span>
                <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="removeRedemption(${index})">Remove</button>
            `;
            redeemLog.appendChild(logElement);
        });
    }
}

function removeRedemption(index) {
    const removedRedemption = redeemLogs.splice(index, 1)[0];
    currentPoints += removedRedemption.points;
    saveData();
    updateCurrentPoints();
    renderRedeemLogs();
}

function showTab(tabId) {
    const sections = ['habits-section', 'rewards-section', 'redeem-section'];
    sections.forEach(section => {
        document.getElementById(section).classList.add('hidden');
    });
    document.getElementById(`${tabId}-section`).classList.remove('hidden');

    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.classList.remove('text-blue-500');
        tab.classList.add('text-gray-500');
    });
    document.getElementById(`${tabId}-tab`).classList.remove('text-gray-500');
    document.getElementById(`${tabId}-tab`).classList.add('text-blue-500');
}

document.getElementById('add-habit').addEventListener('click', addHabit);
document.getElementById('add-reward').addEventListener('click', addReward);

document.getElementById('habits-tab').addEventListener('click', () => showTab('habits'));
document.getElementById('rewards-tab').addEventListener('click', () => showTab('rewards'));
document.getElementById('redeem-tab').addEventListener('click', () => showTab('redeem'));

loadData();
renderHabits();
renderRewards();
renderRedeemList();
updateCurrentPoints();
renderRedeemLogs();
showTab('habits'); // Show habits tab by default

