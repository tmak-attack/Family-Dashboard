// Application data
const appData = {
  familyMembers: [
    {
      id: 1,
      name: "Todd",
      role: "Parent",
      avatar: "👨‍💼",
      points: 142,
      completedTasks: 18,
      weeklyGoal: 20
    },
    {
      id: 2,
      name: "Sarah", 
      role: "Parent",
      avatar: "👩‍💼",
      points: 128,
      completedTasks: 16,
      weeklyGoal: 18
    },
    {
      id: 3,
      name: "Emma",
      role: "Teen",
      avatar: "👩‍🦰",
      points: 105,
      completedTasks: 12,
      weeklyGoal: 15
    },
    {
      id: 4,
      name: "Alex",
      role: "Kid",
      avatar: "🧒",
      points: 90,
      completedTasks: 9,
      weeklyGoal: 12
    }
  ],
  chores: [
    {
      id: 1,
      title: "Kitchen Cleanup",
      description: "Clean counters, load dishwasher, wipe appliances",
      category: "Kitchen",
      points: 15,
      assignedTo: "Emma",
      dueDate: "2025-10-01",
      priority: "high",
      status: "pending",
      estimatedTime: "30 min"
    },
    {
      id: 2,
      title: "Take Out Trash",
      description: "Empty all bins and take to curb",
      category: "General",
      points: 10,
      assignedTo: "Alex",
      dueDate: "2025-10-01",
      priority: "medium",
      status: "pending",
      estimatedTime: "15 min"
    },
    {
      id: 3,
      title: "Vacuum Living Areas",
      description: "Vacuum all carpets and rugs",
      category: "Cleaning",
      points: 20,
      assignedTo: "Sarah",
      dueDate: "2025-10-02",
      priority: "medium",
      status: "pending",
      estimatedTime: "45 min"
    },
    {
      id: 4,
      title: "Yard Work",
      description: "Mow lawn and trim edges",
      category: "Outdoor",
      points: 25,
      assignedTo: "Todd",
      dueDate: "2025-10-03",
      priority: "low",
      status: "pending",
      estimatedTime: "60 min"
    }
  ],
  allowanceData: {
    weeklyBudget: 100,
    totalEarned: 260,
    totalSpent: 180,
    balance: 80,
    lastPayment: "Sep 27",
    nextPayment: "Oct 4"
  },
  shoppingLists: [
    {
      category: "Groceries",
      icon: "🛒",
      items: [
        {name: "Milk", completed: false},
        {name: "Eggs", completed: false}, 
        {name: "Bread", completed: true},
        {name: "Fresh Spinach", completed: false}
      ]
    },
    {
      category: "Home Depot",
      icon: "🔨",
      items: [
        {name: "LED Light Bulbs", completed: false},
        {name: "Hammer", completed: false},
        {name: "Interior Paint", completed: false}
      ]
    },
    {
      category: "Costco",
      icon: "🏪",
      items: [
        {name: "Chicken Breast", completed: false},
        {name: "Toilet Paper", completed: true},
        {name: "Batteries", completed: false}
      ]
    }
  ],
  weather: {
    current: {
      temp: 68,
      condition: "Sunny",
      icon: "☀️"
    },
    forecast: [
      {day: "Today", high: 72, low: 58, icon: "☀️"},
      {day: "Tomorrow", high: 70, low: 55, icon: "⛅"},
      {day: "Friday", high: 68, low: 52, icon: "🌧️"}
    ]
  },
  upcomingEvents: [
    {date: "Oct 2", event: "Emma's Soccer Practice", time: "4:00 PM"},
    {date: "Oct 3", event: "Family Movie Night", time: "7:00 PM"},
    {date: "Oct 5", event: "Alex's Piano Lesson", time: "10:00 AM"}
  ]
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    renderFamilyMembers();
    renderChores();
    renderAllowanceTracker();
    renderShoppingLists();
    renderWeather();
    renderCalendar();
});

function renderFamilyMembers() {
    const familyGrid = document.getElementById('familyGrid');
    familyGrid.innerHTML = appData.familyMembers.map(member => `
        <div class="family-card">
            <div class="family-avatar">${member.avatar}</div>
            <div class="family-name">${member.name}</div>
            <div class="family-role">${member.role}</div>
            <div class="family-stats">
                <span>🏆 ${member.points}</span>
                <span>✓ ${member.completedTasks}</span>
            </div>
        </div>
    `).join('');
}

function renderChores() {
    const choresList = document.getElementById('choresList');
    choresList.innerHTML = appData.chores.filter(chore => chore.status === 'pending').map(chore => `
        <div class="chore-card">
            <div class="chore-header">
                <div class="chore-title">${chore.title}</div>
                <div class="chore-points">${chore.points} pts</div>
            </div>
            <div class="chore-description">${chore.description}</div>
            <div class="chore-details">
                <div class="chore-assigned">👤 ${chore.assignedTo}</div>
                <div class="chore-time">⏱️ ${chore.estimatedTime}</div>
            </div>
            <button class="complete-btn" onclick="completeChore(${chore.id})">
                Mark Complete
            </button>
        </div>
    `).join('');
}

function renderAllowanceTracker() {
    const allowanceContent = document.getElementById('allowanceContent');
    const data = appData.allowanceData;
    allowanceContent.innerHTML = `
        <div class="allowance-stat">
            <span class="allowance-label">Weekly</span>
            <span class="allowance-value">$${data.weeklyBudget}</span>
        </div>
        <div class="allowance-stat">
            <span class="allowance-label">Balance</span>
            <span class="allowance-value">$${data.balance}</span>
        </div>
        <div class="allowance-stat">
            <span class="allowance-label">Earned</span>
            <span class="allowance-value">$${data.totalEarned}</span>
        </div>
        <div class="allowance-stat">
            <span class="allowance-label">Spent</span>
            <span class="allowance-value">$${data.totalSpent}</span>
        </div>
    `;
}

function renderShoppingLists() {
    const shoppingContent = document.getElementById('shoppingContent');
    shoppingContent.innerHTML = appData.shoppingLists.map(list => `
        <div class="shopping-category">
            <div class="category-header">
                <span class="category-icon">${list.icon}</span>
                <span class="category-name">${list.category}</span>
            </div>
            <div class="shopping-items">
                ${list.items.map(item => `
                    <div class="shopping-item">
                        <input type="checkbox" class="item-checkbox" ${item.completed ? 'checked' : ''}>
                        <span class="item-name ${item.completed ? 'completed' : ''}">${item.name}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderWeather() {
    const weatherContent = document.getElementById('weatherContent');
    const current = appData.weather.current;
    const forecast = appData.weather.forecast;
    
    weatherContent.innerHTML = `
        <div class="current-weather">
            <div class="weather-icon">${current.icon}</div>
            <div class="weather-temp">${current.temp}°F</div>
            <div class="weather-condition">${current.condition}</div>
        </div>
        <div class="weather-forecast">
            ${forecast.map(day => `
                <div class="forecast-day">
                    <div class="forecast-day-name">${day.day}</div>
                    <div class="forecast-icon">${day.icon}</div>
                    <div class="forecast-temps">${day.high}°/${day.low}°</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderCalendar() {
    const calendarContent = document.getElementById('calendarContent');
    calendarContent.innerHTML = appData.upcomingEvents.map(event => `
        <div class="calendar-event">
            <div class="event-date">
                <div class="event-day">${event.date.split(' ')[0]}</div>
                <div class="event-number">${event.date.split(' ')[1] || ''}</div>
            </div>
            <div class="event-details">
                <div class="event-name">${event.event}</div>
                <div class="event-time">${event.time}</div>
            </div>
        </div>
    `).join('');
}

function completeChore(choreId) {
    const chore = appData.chores.find(c => c.id === choreId);
    if (chore) {
        chore.status = 'completed';
        renderChores();
        // Update stats
        const activeTasks = appData.chores.filter(c => c.status === 'pending').length;
        document.getElementById('activeTasks').textContent = activeTasks;
    }
}
