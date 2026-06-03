import { useState } from "react";
import { signUpUser, loginUser, checkUserAccess } from "./authEngine";

function AuthScreen({ onAccessGranted }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function register() {
    try {
      setMessage("Creating account...");

      await signUpUser({
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
      setMessage("Checking access...");

      await loginUser({
        email: form.email,
        password: form.password,
      });

      const access = await checkUserAccess();

      if (!access.allowed) {
        setMessage(access.reason);
        return;
      }

      onAccessGranted(access);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="authPage">
      <div className="authBox">
        <h1>Apfel Globus</h1>
        <p>Engineering OS Secure Login</p>

        <div className="authTabs">
          <button
            className={mode === "login" ? "authActive" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            className={mode === "register" ? "authActive" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {mode === "register" && (
          <>
            <label>Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </>
        )}

        <label>Email</label>
        <input
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
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

export default AuthScreen;