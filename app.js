// Family Dashboard Application -- Real Family Example, Stats, & Widgets
class FamilyDashboard {
    constructor() {
        this.data = {
            familyMembers: [
                { id: 1, name: "Todd", role: "Parent", avatar: "🧑‍💼", points: 142, completedTasks: 18 },
                { id: 2, name: "Sarah", role: "Parent", avatar: "🧑‍🔬", points: 120, completedTasks: 16 },
                { id: 3, name: "Emma", role: "Teenager", avatar: "👩‍🦰", points: 105, completedTasks: 12 },
                { id: 4, name: "Alex", role: "Child", avatar: "🧒", points: 90, completedTasks: 9 }
            ],
            chores: [
                { id: 1, title: "Kitchen Cleanup", description: "Do the dishes and wipe counters", category: "Kitchen", points: 15, assignedTo: "Emma", dueDate: "2025-10-01", recurring: "daily", status: "pending" },
                { id: 2, title: "Take Out Trash", description: "Collect all house trash & bring out", category: "General", points: 10, assignedTo: "Alex", dueDate: "2025-10-01", recurring: "weekly", status: "pending" },
                { id: 3, title: "Vacuum Living Room", description: "Vacuum all carpets & rugs", category: "Living Areas", points: 20, assignedTo: "Sarah", dueDate: "2025-10-02", recurring: "weekly", status: "pending" },
                { id: 4, title: "Mow Lawn", description: "Mow front and back yards", category: "Yard Work", points: 25, assignedTo: "Todd", dueDate: "2025-10-03", recurring: "weekly", status: "pending" }
            ],
            rewards: [
                { id: 1, title: "Movie Night Choice", description: "Pick the next family movie night film", cost: 50, category: "Entertainment" },
                { id: 2, title: "Shopping Gift Card", description: "Choose an Amazon/Target gift card", cost: 100, category: "Shopping" },
                { id: 3, title: "Extra Screen Time", description: "Get 30 extra minutes of screen time", cost: 25, category: "Privileges" }
            ],
            allowanceStats: {
                weekly: 25,
                totalPaid: 260,
                lastPaid: "2025-09-27"
            },
            shoppingLists: [
                { category: "Groceries", items: ["Milk", "Eggs", "Bread", "Spinach"] },
                { category: "Home Depot", items: ["Light Bulbs", "Hammer", "Paint"] },
                { category: "Costco", items: ["Chicken", "Toilet Paper", "Batteries"] }
            ]
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new FamilyDashboard();

    // --- Family Members
    document.getElementById('family-list').innerHTML =
      window.dashboard.data.familyMembers.map(mem =>
        `<div style="display:flex;align-items:center;margin-bottom:0.7em;">
          <span style="font-size:1.8em;">${mem.avatar}</span>
          <strong style="margin-left:8px;">${mem.name}</strong>
          <span style="margin-left:14px;color:gray;">(${mem.role})</span>
          <span style="margin-left:auto;color:#3B82F6;">${mem.completedTasks} chores</span>
          <span style="margin-left:12px;">${mem.points} pts</span>
         </div>`
      ).join('');

    // --- Chores (with buttons!)
    document.getElementById('chores-list').innerHTML =
      window.dashboard.data.chores.map(chore =>
        `<div style="margin-bottom:1em;border-bottom:1px solid #eee;padding-bottom:0.6em;">
          <strong>${chore.title}</strong> <span style="color:#8B5CF6;">${chore.category}</span><br>
          <span style="color:gray;font-size:0.95em;">${chore.description}</span><br>
          <em>Assigned to: ${chore.assignedTo}</em> — <span>Due: ${chore.dueDate}</span>
          <span style="margin-left:8px;color:green;">(${chore.points} pts)</span>
          <button onclick="markComplete(${chore.id})" style="margin-left:12px;">Mark Complete</button>
         </div>`
      ).join('');

    // --- Allowance Stats Widget
    document.getElementById('allowance-stats').innerHTML =
      `<div>
         <strong>Weekly Allowance:</strong> $${window.dashboard.data.allowanceStats.weekly} <br>
         <strong>Total Paid:</strong> $${window.dashboard.data.allowanceStats.totalPaid} <br>
         <strong>Last Paid:</strong> ${window.dashboard.data.allowanceStats.lastPaid}
       </div>`;

    // --- Chore Stats (Basic)
    document.getElementById('chore-stats').innerHTML =
      `<div>
         <strong>Total Chores:</strong> ${window.dashboard.data.chores.length}<br>
         <strong>Pending:</strong> ${window.dashboard.data.chores.filter(c=>c.status==="pending").length}
       </div>`;

    // --- Shopping Lists (by category)
    document.getElementById('shopping-lists').innerHTML =
      window.dashboard.data.shoppingLists.map(list =>
        `<div style="margin-bottom:1em;">
          <strong>${list.category}</strong>:<br>
          <ul style="margin-top:0;">
            ${list.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
         </div>`
      ).join('');

    // --- Weather widget (placeholder)
    document.getElementById('weather-widget').innerHTML =
      `<div>
         <strong>Weather:</strong> <span>🌤️ 68°F, Sunny</span>
       </div>`;

    // --- Calendar Widget (placeholder)
    document.getElementById('calendar-widget').innerHTML =
      `<div>
         <strong>Calendar:</strong> <span>Events coming soon...</span>
       </div>`;
});

// Example: Mark Chore Complete
function markComplete(id) {
  const chore = window.dashboard.data.chores.find(c => c.id === id);
  if (chore) {
    chore.status = 'completed';
    alert(`Marked "${chore.title}" complete!`);
    // To persist, reload page or re-render chores here
  }
}
