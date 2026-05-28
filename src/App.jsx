import { useState } from "react";
import "./App.css";
import "./styles/responsive.css";
import { ProjectProvider } from "./context/ProjectContext";

function App() {
  const [mode, setMode] = useState("login");
  const [access, setAccess] = useState(null);
  const [Dashboard, setDashboard] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function register() {
    try {
      setMessage("Creating account...");
      const auth = await import("./authEngine");

      await auth.signUpUser({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      });

      setMessage("Account created. Please wait for admin approval.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function login() {
    try {
      setMessage("Checking login...");
      const auth = await import("./authEngine");

      await auth.loginUser({
        email: form.email,
        password: form.password,
      });

      const result = await auth.checkUserAccess();

      if (!result.allowed) {
        setMessage(result.reason);
        return;
      }

      const dashboardModule = await import("./EngineeringOSDashboard");

      setDashboard(() => dashboardModule.default);
      setAccess(result);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function logout() {
    const auth = await import("./authEngine");
    await auth.logoutUser();

    setAccess(null);
    setDashboard(null);
    setMessage("Logged out.");
  }

  if (access && Dashboard) {
    return (
      <ProjectProvider>
        <div style={styles.appShell}>
          <div className="app-topbar" style={styles.topBar}>
            <div style={styles.brandSection}>
              <div className="app-logo" style={styles.logoBox}>⚙️</div>

              <div>
                <div className="app-company-name" style={styles.companyName}>
                  APFEL GLOBUS ENGINEERING
                </div>

                <div className="app-company-sub" style={styles.companySub}>
                  Professional HVAC • AHU • Pharma Engineering Software
                </div>
              </div>
            </div>

            <div className="app-user-section" style={styles.userSection}>
              <div style={styles.userCard}>
                <div style={styles.userLabel}>Logged User</div>

                <div style={styles.userName}>
                  {access.profile?.email || form.email || "User"}
                </div>

                <div style={styles.planText}>
                  Plan: {access.license?.plan || "Active"}
                </div>
              </div>

              <button onClick={logout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>

          <div style={styles.dashboardArea}>
            <Dashboard />
          </div>
        </div>
      </ProjectProvider>
    );
  }

  return (
    <div className="authPage">
      <div className="authBox">
        <h1>Apfel Globus</h1>
        <p>Engineering OS Secure Login</p>

        <div className="authTabs">
          <button className={mode === "login" ? "authActive" : ""} onClick={() => setMode("login")}>
            Login
          </button>

          <button className={mode === "register" ? "authActive" : ""} onClick={() => setMode("register")}>
            Register
          </button>
        </div>

        {mode === "register" && (
          <>
            <label>Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Enter full name"
            />
          </>
        )}

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="Enter email"
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder="Enter password"
        />

        {mode === "login" ? (
          <button onClick={login}>Login</button>
        ) : (
          <button onClick={register}>Create Account</button>
        )}

        {message && <div className="authMessage">{message}</div>}
      </div>
    </div>
  );
}

const styles = {
  appShell: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "#e5e7eb",
  },

  topBar: {
    height: "92px",
    background: "linear-gradient(90deg, #000000 0%, #050505 45%, #b30000 100%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    borderBottom: "3px solid #ffcc00",
    boxShadow: "0 6px 22px rgba(0,0,0,0.45)",
    flexShrink: 0,
  },

  brandSection: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  logoBox: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #ffcc00 0%, #ff9900 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    color: "#000",
    fontWeight: "900",
    boxShadow: "0 4px 16px rgba(255,204,0,0.35)",
  },

  companyName: {
    color: "white",
    fontSize: "30px",
    fontWeight: "900",
    letterSpacing: "1.2px",
  },

  companySub: {
    color: "#d1d5db",
    fontSize: "13px",
    marginTop: "5px",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  userCard: {
    background: "rgba(255,255,255,0.06)",
    padding: "12px 18px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  },

  userLabel: {
    color: "#d1d5db",
    fontSize: "12px",
  },

  userName: {
    color: "white",
    fontWeight: "800",
    fontSize: "16px",
    marginTop: "2px",
  },

  planText: {
    color: "#ffcc00",
    fontSize: "12px",
    marginTop: "4px",
    fontWeight: "700",
  },

  logoutButton: {
    background: "linear-gradient(135deg, #111111 0%, #000000 100%)",
    color: "white",
    border: "2px solid #ffcc00",
    borderRadius: "16px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },

  dashboardArea: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },
};

export default App;