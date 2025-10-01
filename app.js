// Family Dashboard Application
class FamilyDashboard {
    constructor() {
        // Initialize data from the provided JSON
        this.data = {
            familyMembers: [
                {
                    id: 1,
                    name: "Todd",
                    role: "Parent",
                    avatar: "T",
                    points: 0,
                    completedTasks: 0
                }
            ],
            chores: [
                {
                    id: 1,
                    title: "Kitchen Cleanup",
                    description: "Clean counters, load dishwasher, wipe down appliances",
                    category: "Kitchen",
                    points: 15,
                    assignedTo: null,
                    dueDate: "2025-10-02",
                    recurring: "daily",
                    status: "pending"
                },
                {
                    id: 2,
                    title: "Vacuum Living Room",
                    description: "Vacuum all carpets and rugs in main living area",
                    category: "Living Areas",
                    points: 20,
                    assignedTo: null,
                    dueDate: "2025-10-03",
                    recurring: "weekly",
                    status: "pending"
                },
                {
                    id: 3,
                    title: "Take Out Trash",
                    description: "Empty all waste baskets and take to curb",
                    category: "General",
                    points: 10,
                    assignedTo: null,
                    dueDate: "2025-10-02",
                    recurring: "weekly",
                    status: "pending"
                }
            ],
            categories: [
                {"name": "Kitchen", "color": "#3B82F6"},
                {"name": "Bathroom", "color": "#10B981"},
                {"name": "Living Areas", "color": "#8B5CF6"},
                {"name": "Bedrooms", "color": "#F59E0B"},
                {"name": "Yard Work", "color": "#EF4444"},
                {"name": "General", "color": "#6B7280"}
            ],
            rewards: [
                {
                    id: 1,
                    title: "Movie Night Choice",
                    description: "Pick the next family movie night film",
                    cost: 50,
                    category: "Entertainment"
                },
                {
                    id: 2,
                    title: "$10 Gift Card",
                    description: "Choose from Amazon, iTunes, or Google Play",
                    cost: 100,
                    category: "Shopping"
                },
                {
                    id: 3,
                    title: "Extra Screen Time",
                    description: "30 minutes additional screen time on weekend",
                    cost: 25,
                    category: "Privileges"
                }
            ]
        };
        // You can now add methods here to render or manage data!
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new FamilyDashboard();
    // Your view rendering logic goes here.
});
