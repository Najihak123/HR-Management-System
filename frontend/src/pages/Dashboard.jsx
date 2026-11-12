
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const employee = JSON.parse(
    localStorage.getItem("employee") || "{}"
  );

  const navigate = useNavigate();

  const isAdmin = employee.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    window.location.href = "/";
  };

  const allModules = [
    {
      title: "Employees",
      description: "Manage employee details",
      icon: "👥",
      path: "/employees",
      color: "blue",
      adminOnly: true
    },
    {
      title: "Attendance",
      description: "Track daily attendance",
      icon: "📅",
      path: "/attendance",
      color: "green"
    },
    {
      title: "Leaves",
      description: "Manage leave requests",
      icon: "📝",
      path: "/leaves",
      color: "orange"
    },
    {
      title: "Salaries",
      description: "Manage salary records",
      icon: "💰",
      path: "/salaries",
      color: "purple"
    }
  ];

  const modules = allModules.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <h2>HR<span>MS</span></h2>

        <p className="sidebar-label">MAIN MENU</p>

        <button className="sidebar-link active">
          🏠 Dashboard
        </button>

        {modules.map((item) => (
          <button
            className="sidebar-link"
            key={item.path}
            onClick={() => navigate(item.path)}
          >
            {item.icon} {item.title}
          </button>
        ))}

        <button className="sidebar-logout" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome to your HR Management System</p>
          </div>

          <div className="admin-profile">
            <div className="profile-avatar">
              {employee.name?.charAt(0) || "U"}
            </div>

            <div>
              <strong>{employee.name}</strong>
              <small>{employee.role}</small>
            </div>
          </div>
        </header>

        <section className="welcome-banner">
          <div>
            <h2>Hello, {employee.name}! 👋</h2>
            <p>
              {isAdmin
                ? "Manage your workforce efficiently from one place."
                : "Welcome! Manage your attendance, leaves and salary."}
            </p>
          </div>

          <span>🏢</span>
        </section>

        <h3 className="section-heading">
          {isAdmin ? "Management Modules" : "Employee Modules"}
        </h3>

        <section className="module-grid">
          {modules.map((item) => (
            <div
              className="module-card"
              key={item.path}
              onClick={() => navigate(item.path)}
            >
              <div className={`module-icon ${item.color}`}>
                {item.icon}
              </div>

              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <span>Open Module →</span>
            </div>
          ))}
        </section>

        <footer className="dashboard-footer">
          HR Management System © 2026
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
