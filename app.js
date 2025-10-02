// ============================================
// Family Dashboard - Live Data Population
// ============================================

// ============================================
// LIVE DATA SOURCE - Week of October 1, 2025
// Simulates Excel spreadsheet data
// ============================================
const liveChoreData = {
  familyMembers: [
    { 
      id: 1, 
      name: 'Bobby', 
      avatar: '👦', 
      completionRate: 85,
      points: 127,
      allowanceDue: 15.00,
      status: 'On Track',
      totalTasks: 20,
      completedTasks: 17
    },
    { 
      id: 2, 
      name: 'Caine', 
      avatar: '🧒', 
      completionRate: 92,
      points: 145,
      allowanceDue: 18.00,
      status: 'Excellent',
      totalTasks: 18,
      completedTasks: 17
    },
    { 
      id: 3, 
      name: 'Rayne', 
      avatar: '👧', 
      completionRate: 78,
      points: 98,
      allowanceDue: 12.00,
      status: 'Needs Improvement',
      totalTasks: 15,
      completedTasks: 12
    },
    { 
      id: 4, 
      name: 'Brad', 
      avatar: '🧑', 
      completionRate: 88,
      points: 132,
      allowanceDue: 16.50,
      status: 'Good',
      totalTasks: 17,
      completedTasks: 15
    },
    { 
      id: 5, 
      name: 'Estelle', 
      avatar: '👩', 
      completionRate: 95,
      points: 156,
      allowanceDue: 19.50,
      status: 'Excellent',
      totalTasks: 19,
      completedTasks: 18
    }
  ],
  
  // Health & Critical Tasks for this week
  healthCriticalTasks: [
    {
      category: 'Health & Cleaning',
      priority: 'high',
      tasks: [
        { task: 'Deep clean bathroom (allergy prevention)', assignedTo: 'Caine', dueDate: 'Wed', status: 'pending' },
        { task: 'Vacuum bedrooms with HEPA filter', assignedTo: 'Bobby', dueDate: 'Wed', status: 'completed' },
        { task: 'Wash all bedding/pillowcases', assignedTo: 'Rayne', dueDate: 'Thu', status: 'pending' },
        { task: 'Dust surfaces and windowsills', assignedTo: 'Brad', dueDate: 'Thu', status: 'pending' }
      ]
    },
    {
      category: 'Allergy Management',
      priority: 'high',
      tasks: [
        { task: 'Check/replace air filters', assignedTo: 'Bobby', dueDate: 'Tue', status: 'completed' },
        { task: 'Organize medication station', assignedTo: 'Estelle', dueDate: 'Wed', status: 'pending' },
        { task: 'Clean pet areas (dander control)', assignedTo: 'Caine', dueDate: 'Thu', status: 'pending' }
      ]
    },
    {
      category: 'Floor Care',
      priority: 'high',
      tasks: [
        { task: 'Mop kitchen and bathroom floors', assignedTo: 'Rayne', dueDate: 'Wed', status: 'pending' },
        { task: 'Sweep/vacuum entryway', assignedTo: 'Brad', dueDate: 'Daily', status: 'completed' },
        { task: 'Steam clean living room carpet', assignedTo: 'Bobby', dueDate: 'Fri', status: 'pending' }
      ]
    },
    {
      category: 'Thursday Priorities',
      priority: 'critical',
      tasks: [
        { task: '🐕 Pick up dog from groomer (3pm)', assignedTo: 'Brad', dueDate: 'Thu', status: 'pending' },
        { task: '🗑️ Take trash bins to curb (7pm)', assignedTo: 'Caine', dueDate: 'Thu', status: 'pending' },
        { task: '📦 Prepare recycling bins', assignedTo: 'Bobby', dueDate: 'Thu', status: 'pending' }
      ]
    }
  ],
  
  // Today's chores
  todaysChores: [
    { id: 1, title: 'Kitchen Cleanup', assignedTo: 'Bobby', points: 15, status: 'completed' },
    { id: 2, title: 'Feed Pets', assignedTo: 'Estelle', points: 5, status: 'completed' },
    { id: 3, title: 'Take Out Trash', assignedTo: 'Caine', points: 10, status: 'pending' },
    { id: 4, title: 'Vacuum Living Room', assignedTo: 'Rayne', points: 20, status: 'pending' },
    { id: 5, title: 'Water Plants', assignedTo: 'Brad', points: 8, status: 'completed' }
  ]
};

// ============================================
// POPULATE HEALTH & CRITICAL TASKS WIDGET
// ============================================
function populateHealthCriticalTasks() {
  const container = document.getElementById('healthCriticalContent');
  if (!container) return;
  
  let html = '';
  
  liveChoreData.healthCriticalTasks.forEach(section => {
    const priorityClass = section.priority === 'critical' ? 'priority-critical' : 'priority-high';
    const priorityIcon = section.priority === 'critical' ? '🚨' : '⚠️';
    
    html += `
      <div class="health-section ${priorityClass}">
        <h3 class="section-title">${priorityIcon} ${section.category}</h3>
        <div class="task-list">
    `;
    
    section.tasks.forEach(task => {
      const statusIcon = task.status === 'completed' ? '✅' : '⏳';
      const statusClass = task.status === 'completed' ? 'task-completed' : 'task-pending';
      
      html += `
        <div class="task-item ${statusClass}">
          <span class="task-status">${statusIcon}</span>
          <div class="task-details">
            <span class="task-name">${task.task}</span>
            <span class="task-meta">${task.assignedTo} • ${task.dueDate}</span>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ============================================
// POPULATE FAMILY OVERVIEW WIDGET
// ============================================
function populateFamilyOverview() {
  const container = document.getElementById('familyOverviewContent');
  if (!container) return;
  
  let html = '<div class="family-overview-grid">';
  
  liveChoreData.familyMembers.forEach(member => {
    const statusClass = member.status.toLowerCase().replace(' ', '-');
    const statusIcon = {
      'Excellent': '🌟',
      'Good': '👍',
      'On Track': '✓',
      'Needs Improvement': '⚡'
    }[member.status] || '•';
    
    html += `
      <div class="family-member-card">
        <div class="member-header">
          <span class="member-avatar">${member.avatar}</span>
          <span class="member-name">${member.name}</span>
        </div>
        <div class="member-stats">
          <div class="stat-row">
            <span class="stat-label">Completion:</span>
            <span class="stat-value">${member.completionRate}%</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Points:</span>
            <span class="stat-value">${member.points}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Allowance:</span>
            <span class="stat-value">$${member.allowanceDue.toFixed(2)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Tasks:</span>
            <span class="stat-value">${member.completedTasks}/${member.totalTasks}</span>
          </div>
        </div>
        <div class="member-status ${statusClass}">
          ${statusIcon} ${member.status}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// ============================================
// POPULATE FAMILY MEMBERS SECTION (existing)
// ============================================
function populateFamilyMembers() {
  const container = document.getElementById('familyGrid');
  if (!container) return;
  
  let html = '';
  
  liveChoreData.familyMembers.forEach(member => {
    html += `
      <div class="family-card">
        <div class="family-card-header">
          <span class="family-avatar">${member.avatar}</span>
          <h3 class="family-name">${member.name}</h3>
        </div>
        <div class="family-stats">
          <div class="stat">
            <span class="stat-label">Points</span>
            <span class="stat-value">${member.points}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Completed</span>
            <span class="stat-value">${member.completedTasks}/${member.totalTasks}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ============================================
// POPULATE TODAY'S CHORES (existing)
// ============================================
function populateTodaysChores() {
  const container = document.getElementById('choresList');
  if (!container) return;
  
  let html = '';
  
  liveChoreData.todaysChores.forEach(chore => {
    const statusClass = chore.status === 'completed' ? 'chore-completed' : 'chore-pending';
    const statusIcon = chore.status === 'completed' ? '✅' : '⏳';
    
    html += `
      <div class="chore-card ${statusClass}">
        <div class="chore-header">
          <span class="chore-status">${statusIcon}</span>
          <h4 class="chore-title">${chore.title}</h4>
        </div>
        <div class="chore-details">
          <span class="chore-assignee">👤 ${chore.assignedTo}</span>
          <span class="chore-points">+${chore.points} pts</span>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ============================================
// POPULATE ALLOWANCE TRACKER (existing)
// ============================================
function populateAllowanceTracker() {
  const container = document.getElementById('allowanceContent');
  if (!container) return;
  
  const totalAllowance = liveChoreData.familyMembers.reduce((sum, m) => sum + m.allowanceDue, 0);
  
  let html = `
    <div class="allowance-summary">
      <div class="allowance-total">
        <span class="allowance-label">Total This Week</span>
        <span class="allowance-amount">$${totalAllowance.toFixed(2)}</span>
      </div>
    </div>
    <div class="allowance-breakdown">
  `;
  
  liveChoreData.familyMembers.forEach(member => {
    html += `
      <div class="allowance-item">
        <span class="allowance-name">${member.avatar} ${member.name}</span>
        <span class="allowance-value">$${member.allowanceDue.toFixed(2)}</span>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// ============================================
// UPDATE HEADER STATS
// ============================================
function updateHeaderStats() {
  const activeTasks = liveChoreData.todaysChores.filter(c => c.status === 'pending').length;
  const totalTasks = liveChoreData.familyMembers.reduce((sum, m) => sum + m.totalTasks, 0);
  const completedTasks = liveChoreData.familyMembers.reduce((sum, m) => sum + m.completedTasks, 0);
  const weekProgress = Math.round((completedTasks / totalTasks) * 100);
  
  const activeTasksEl = document.getElementById('activeTasks');
  const weekProgressEl = document.getElementById('weekProgress');
  
  if (activeTasksEl) activeTasksEl.textContent = activeTasks;
  if (weekProgressEl) weekProgressEl.textContent = `${weekProgress}%`;
}

// ============================================
// INITIALIZE DASHBOARD
// ============================================
function initDashboard() {
  // Populate all widgets with live data
  populateHealthCriticalTasks();
  populateFamilyOverview();
  populateFamilyMembers();
  populateTodaysChores();
  populateAllowanceTracker();
  updateHeaderStats();
  
  console.log('✅ Dashboard initialized with live chore data for week of Oct 1, 2025');
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}
