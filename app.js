// ============================================
// Family Dashboard - Modular React Component Pattern
// Modeled after Mango V4 UI Architecture
// ============================================

import React, { useState, useEffect } from 'react';

// ============================================
// THEME CONFIGURATION (Mango V4 Style)
// ============================================
const themes = {
  light: {
    bg: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-900',
    subtext: 'text-gray-600',
    border: 'border-gray-200',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600'
  },
  dark: {
    bg: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    subtext: 'text-gray-400',
    border: 'border-gray-700',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700'
  }
};

// ============================================
// DATA STORE - Family Members & Chores
// ============================================
const initialData = {
  familyMembers: [
    { id: 1, name: "Bobby", role: "Child", avatar: "👦", points: 95, completedTasks: 12 },
    { id: 2, name: "Caine", role: "Child", avatar: "🧒", points: 88, completedTasks: 11 },
    { id: 3, name: "Rayne", role: "Child", avatar: "👧", points: 102, completedTasks: 14 },
    { id: 4, name: "Brad", role: "Child", avatar: "🧑", points: 76, completedTasks: 9 },
    { id: 5, name: "Estelle", role: "Child", avatar: "👩", points: 110, completedTasks: 15 }
  ],
  chores: [
    { id: 1, title: "Kitchen Cleanup", description: "Do the dishes and wipe counters", category: "Kitchen", points: 15, assignedTo: "Bobby", dueDate: "2025-10-01", recurring: "daily", status: "pending" },
    { id: 2, title: "Take Out Trash", description: "Collect all house trash & bring out", category: "General", points: 10, assignedTo: "Caine", dueDate: "2025-10-01", recurring: "weekly", status: "pending" },
    { id: 3, title: "Vacuum Living Room", description: "Vacuum all carpets & rugs", category: "Living Areas", points: 20, assignedTo: "Rayne", dueDate: "2025-10-02", recurring: "weekly", status: "pending" },
    { id: 4, title: "Mow Lawn", description: "Mow front and back yards", category: "Yard Work", points: 25, assignedTo: "Brad", dueDate: "2025-10-03", recurring: "weekly", status: "pending" },
    { id: 5, title: "Feed Pets", description: "Feed dogs and cats", category: "Pets", points: 5, assignedTo: "Estelle", dueDate: "2025-10-01", recurring: "daily", status: "pending" }
  ]
};

// ============================================
// WIDGET: Theme Switcher Component
// ============================================
const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center gap-2 p-4">
      <span className={themes[currentTheme].text}>Theme:</span>
      <button
        onClick={() => onThemeChange(currentTheme === 'light' ? 'dark' : 'light')}
        className={`px-4 py-2 rounded-lg ${themes[currentTheme].accent} ${themes[currentTheme].accentHover} text-white transition-colors`}
      >
        {currentTheme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
};

// ============================================
// WIDGET: Child Chore Card Component
// Displays individual child's chores and stats
// ============================================
const ChildChoreWidget = ({ child, chores, theme, onCompleteChore }) => {
  const childChores = chores.filter(c => c.assignedTo === child.name);
  const t = themes[theme];

  return (
    <div className={`${t.card} ${t.border} border rounded-lg p-6 shadow-lg transition-all hover:shadow-xl`}>
      {/* Child Header */}
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-3">{child.avatar}</span>
        <div>
          <h3 className={`text-xl font-bold ${t.text}`}>{child.name}</h3>
          <p className={t.subtext}>{child.role}</p>
        </div>
        <div className="ml-auto text-right">
          <p className={`text-lg font-semibold ${t.text}`}>{child.points} pts</p>
          <p className={`text-sm ${t.subtext}`}>{child.completedTasks} completed</p>
        </div>
      </div>

      {/* Chore List */}
      <div className="space-y-3">
        <h4 className={`font-semibold ${t.text} mb-2`}>Active Chores:</h4>
        {childChores.length === 0 ? (
          <p className={t.subtext}>No chores assigned</p>
        ) : (
          childChores.map(chore => (
            <div key={chore.id} className={`${t.border} border-b pb-3`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className={`font-medium ${t.text}`}>{chore.title}</p>
                  <p className={`text-sm ${t.subtext}`}>{chore.description}</p>
                  <p className={`text-xs ${t.subtext} mt-1`}>
                    Due: {chore.dueDate} • {chore.recurring}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-green-500 font-semibold">+{chore.points}</span>
                  {chore.status === 'pending' && (
                    <button
                      onClick={() => onCompleteChore(chore.id)}
                      className={`px-3 py-1 rounded ${t.accent} ${t.accentHover} text-white text-sm transition-colors`}
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================
// WIDGET: Stats Dashboard Component
// Shows aggregate family statistics
// ============================================
const StatsDashboard = ({ chores, familyMembers, theme }) => {
  const t = themes[theme];
  const totalPoints = familyMembers.reduce((sum, member) => sum + member.points, 0);
  const pendingChores = chores.filter(c => c.status === 'pending').length;
  const completedChores = chores.filter(c => c.status === 'completed').length;

  return (
    <div className={`${t.card} ${t.border} border rounded-lg p-6 shadow-lg`}>
      <h3 className={`text-2xl font-bold ${t.text} mb-4`}>📊 Family Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className={`text-sm ${t.subtext}`}>Total Points</p>
          <p className={`text-3xl font-bold ${t.text}`}>{totalPoints}</p>
        </div>
        <div>
          <p className={`text-sm ${t.subtext}`}>Pending Chores</p>
          <p className={`text-3xl font-bold text-yellow-500`}>{pendingChores}</p>
        </div>
        <div>
          <p className={`text-sm ${t.subtext}`}>Completed</p>
          <p className={`text-3xl font-bold text-green-500`}>{completedChores}</p>
        </div>
        <div>
          <p className={`text-sm ${t.subtext}`}>Family Members</p>
          <p className={`text-3xl font-bold ${t.text}`}>{familyMembers.length}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// WIDGET: Calendar Widget (Placeholder)
// Can be expanded to show events and schedules
// ============================================
const CalendarWidget = ({ theme }) => {
  const t = themes[theme];
  return (
    <div className={`${t.card} ${t.border} border rounded-lg p-6 shadow-lg`}>
      <h3 className={`text-xl font-bold ${t.text} mb-3`}>📅 Calendar</h3>
      <p className={t.subtext}>Upcoming events and schedules will appear here</p>
      <div className="mt-4 space-y-2">
        <div className={`${t.border} border-l-4 border-blue-500 pl-3 py-2`}>
          <p className={`font-medium ${t.text}`}>Family Meeting</p>
          <p className={`text-sm ${t.subtext}`}>Oct 5, 2025 - 6:00 PM</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT
// Orchestrates all widgets and manages state
// ============================================
const FamilyDashboard = () => {
  // State management
  const [theme, setTheme] = useState('light');
  const [data, setData] = useState(initialData);

  // Handle chore completion
  const handleCompleteChore = (choreId) => {
    setData(prevData => {
      const updatedChores = prevData.chores.map(chore =>
        chore.id === choreId ? { ...chore, status: 'completed' } : chore
      );
      
      // Update member points
      const completedChore = prevData.chores.find(c => c.id === choreId);
      const updatedMembers = prevData.familyMembers.map(member =>
        member.name === completedChore.assignedTo
          ? { ...member, points: member.points + completedChore.points, completedTasks: member.completedTasks + 1 }
          : member
      );

      return {
        ...prevData,
        chores: updatedChores,
        familyMembers: updatedMembers
      };
    });
  };

  const t = themes[theme];

  return (
    <div className={`min-h-screen ${t.bg} transition-colors`}>
      {/* Header with Theme Switcher */}
      <header className={`${t.card} ${t.border} border-b shadow-sm`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${t.text}`}>👨‍👩‍👧‍👦 Family Dashboard</h1>
          <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats and Calendar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <StatsDashboard chores={data.chores} familyMembers={data.familyMembers} theme={theme} />
          </div>
          <CalendarWidget theme={theme} />
        </div>

        {/* Child Chore Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.familyMembers.map(child => (
            <ChildChoreWidget
              key={child.id}
              child={child}
              chores={data.chores}
              theme={theme}
              onCompleteChore={handleCompleteChore}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

// Export the main component
export default FamilyDashboard;

// ============================================
// USAGE NOTES:
// 1. This component uses React hooks for state management
// 2. Tailwind CSS classes are used for styling (ensure Tailwind is configured)
// 3. Each child has their own widget card showing their chores
// 4. Theme switcher allows toggling between light and dark modes
// 5. Easy to add new widgets by following the existing pattern
// 6. To expand: add new components following the WIDGET pattern above
// ============================================
