import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../authEngine";

export default function ProfessionalAdminDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: licenseData, error: licenseError } = await supabase
      .from("licenses")
      .select("*")
      .order("expiry_date", { ascending: false });

    if (profileError || licenseError) {
      setMessage(profileError?.message || licenseError?.message);
      return;
    }

    setProfiles(profileData || []);
    setLicenses(licenseData || []);
  }

  async function approveUser(userId) {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "approved" })
      .eq("id", userId);

    if (error) return setMessage(error.message);

    setMessage("User approved successfully.");
    await loadData();
  }

  async function rejectUser(userId) {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "rejected" })
      .eq("id", userId);

    if (error) return setMessage(error.message);

    await supabase.from("licenses").update({ status: "Inactive" }).eq("user_id", userId);

    setMessage("User rejected and licenses deactivated.");
    await loadData();
  }

  async function blockUser(userId) {
    const confirmBlock = window.confirm("Are you sure you want to block this user?");
    if (!confirmBlock) return;

    const { error } = await supabase
      .from("profiles")
      .update({ status: "blocked" })
      .eq("id", userId);

    if (error) return setMessage(error.message);

    await supabase.from("licenses").update({ status: "Inactive" }).eq("user_id", userId);

    setMessage("User blocked and all licenses deactivated.");
    await loadData();
  }

  async function deleteUser(userId, email) {
    if (email === "anbu.mech5793@gmail.com") {
      setMessage("You cannot delete the main admin account.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this user?\n\n${email}\n\nThis will delete profile and licenses.`
    );

    if (!confirmDelete) return;

    const { error: licenseError } = await supabase
      .from("licenses")
      .delete()
      .eq("user_id", userId);

    if (licenseError) return setMessage(licenseError.message);

    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) return setMessage(profileError.message);

    setMessage("User deleted successfully.");
    await loadData();
  }

  async function createLicense(userId, plan) {
    const expiryDate = new Date();
    let maxProjects = 3;

    if (plan === "Monthly") {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      maxProjects = 3;
    }

    if (plan === "Yearly") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      maxProjects = 50;
    }

    if (plan === "Enterprise") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      maxProjects = 999;
    }

    const { error } = await supabase.from("licenses").insert({
      user_id: userId,
      plan,
      status: "Active",
      start_date: new Date().toISOString(),
      expiry_date: expiryDate.toISOString(),
      max_projects: maxProjects,
    });

    if (error) return setMessage(error.message);

    setMessage(`${plan} license created successfully.`);
    await loadData();
  }

  async function extendLicense(licenseId) {
    const license = licenses.find((item) => item.id === licenseId);
    const baseDate = license?.expiry_date ? new Date(license.expiry_date) : new Date();

    baseDate.setMonth(baseDate.getMonth() + 1);

    const { error } = await supabase
      .from("licenses")
      .update({
        status: "Active",
        expiry_date: baseDate.toISOString(),
      })
      .eq("id", licenseId);

    if (error) return setMessage(error.message);

    setMessage("License extended by 1 month.");
    await loadData();
  }

  async function toggleLicenseStatus(license) {
    const currentStatus = String(license.status || "").toLowerCase();

    const newStatus =
      currentStatus === "active" || currentStatus === "approved"
        ? "Inactive"
        : "Active";

    const { error } = await supabase
      .from("licenses")
      .update({ status: newStatus })
      .eq("id", license.id);

    if (error) return setMessage(error.message);

    setMessage(`License changed to ${newStatus}.`);
    await loadData();
  }

  const filteredProfiles = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return profiles;

    return profiles.filter((user) => {
      return (
        String(user.full_name || "").toLowerCase().includes(q) ||
        String(user.email || "").toLowerCase().includes(q) ||
        String(user.status || "").toLowerCase().includes(q) ||
        String(user.role || "").toLowerCase().includes(q)
      );
    });
  }, [profiles, searchText]);

  const totalUsers = profiles.length;
  const pendingUsers = profiles.filter((u) => String(u.status || "").toLowerCase() === "pending").length;
  const approvedUsers = profiles.filter((u) => String(u.status || "").toLowerCase() === "approved").length;
  const blockedUsers = profiles.filter((u) => String(u.status || "").toLowerCase() === "blocked").length;

  const activeLicenses = licenses.filter((l) =>
    ["active", "approved"].includes(String(l.status || "").toLowerCase())
  ).length;

  const expiredLicenses = licenses.filter(
    (l) => l.expiry_date && new Date(l.expiry_date) < new Date()
  ).length;

  const estimatedRevenue = licenses.reduce((total, item) => {
    const status = String(item.status || "").toLowerCase();
    if (status !== "active" && status !== "approved") return total;

    if (item.plan === "Monthly") return total + 999;
    if (item.plan === "Yearly") return total + 9999;
    if (item.plan === "Enterprise") return total + 49999;

    return total;
  }, 0);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Admin Dashboard V2</h1>

      <p style={styles.subHeading}>
        Manage users, approvals, blocking, deletion, licenses, expiry, and revenue.
      </p>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.summaryCard}>
        <SummaryBox label="Total Users" value={totalUsers} />
        <SummaryBox label="Pending Users" value={pendingUsers} />
        <SummaryBox label="Approved Users" value={approvedUsers} />
        <SummaryBox label="Blocked Users" value={blockedUsers} />
        <SummaryBox label="Active Licenses" value={activeLicenses} />
        <SummaryBox label="Expired Licenses" value={expiredLicenses} />
        <SummaryBox label="Estimated Revenue" value={`₹${estimatedRevenue}`} />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Search Users</h2>

        <input
          style={styles.searchInput}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by name, email, status, or role..."
        />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>User Management</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>User Actions</th>
              <th style={styles.th}>License Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProfiles.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.full_name || "-"}</td>
                <td style={styles.td}>{user.email || "-"}</td>
                <td style={styles.td}>{user.role || "-"}</td>
                <td style={styles.td}>{user.status || "-"}</td>

                <td style={styles.td}>
                  <button style={styles.greenButton} onClick={() => approveUser(user.id)}>
                    Approve
                  </button>

                  <button style={styles.orangeButton} onClick={() => rejectUser(user.id)}>
                    Reject
                  </button>

                  <button style={styles.redButton} onClick={() => blockUser(user.id)}>
                    Block
                  </button>

                  <button
                    style={styles.darkRedButton}
                    onClick={() => deleteUser(user.id, user.email)}
                  >
                    Delete
                  </button>
                </td>

                <td style={styles.td}>
                  <button style={styles.blueButton} onClick={() => createLicense(user.id, "Monthly")}>
                    Monthly
                  </button>

                  <button style={styles.blueButton} onClick={() => createLicense(user.id, "Yearly")}>
                    Yearly
                  </button>

                  <button style={styles.purpleButton} onClick={() => createLicense(user.id, "Enterprise")}>
                    Enterprise
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>License Management</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Plan</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Start Date</th>
              <th style={styles.th}>Expiry Date</th>
              <th style={styles.th}>Days Left</th>
              <th style={styles.th}>Max Projects</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {licenses.map((license) => {
              const user = profiles.find((p) => p.id === license.user_id);
              const isInactive = String(license.status || "").toLowerCase() === "inactive";
              const remainingDays = daysLeft(license.expiry_date);

              const expiryStyle =
                remainingDays < 0
                  ? styles.expiredText
                  : remainingDays <= 7
                  ? styles.warningText
                  : styles.okText;

              return (
                <tr key={license.id}>
                  <td style={styles.td}>{user?.email || license.user_id}</td>
                  <td style={styles.td}>{license.plan}</td>
                  <td style={styles.td}>{license.status}</td>
                  <td style={styles.td}>{formatDate(license.start_date)}</td>
                  <td style={styles.td}>{formatDate(license.expiry_date)}</td>

                  <td style={{ ...styles.td, ...expiryStyle }}>
                    {remainingDays < 0 ? "Expired" : `${remainingDays} days`}
                  </td>

                  <td style={styles.td}>{license.max_projects}</td>

                  <td style={styles.td}>
                    <button style={styles.greenButton} onClick={() => extendLicense(license.id)}>
                      Extend 1 Month
                    </button>

                    <button
                      style={isInactive ? styles.greenButton : styles.redButton}
                      onClick={() => toggleLicenseStatus(license)}
                    >
                      {isInactive ? "Activate" : "Deactivate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryBox({ label, value }) {
  return (
    <div style={styles.summaryBox}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function daysLeft(dateValue) {
  if (!dateValue) return 0;

  const today = new Date();
  const expiry = new Date(dateValue);
  const diff = expiry.getTime() - today.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const styles = {
  page: { minHeight: "100vh" },

  heading: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "10px",
  },

  subHeading: {
    fontSize: "18px",
    color: "#374151",
    marginBottom: "22px",
  },

  message: {
    background: "#fef3c7",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontWeight: "700",
  },

  summaryCard: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },

  summaryBox: {
    background: "#111827",
    color: "white",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  card: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    marginBottom: "30px",
    overflowX: "auto",
  },

  sectionTitle: {
    fontSize: "24px",
    color: "#111827",
    borderBottom: "2px solid #e60000",
    paddingBottom: "8px",
    marginBottom: "20px",
  },

  searchInput: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    outline: "none",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1350px",
  },

  th: {
    background: "#111827",
    color: "white",
    padding: "14px",
    textAlign: "left",
  },

  td: {
    borderBottom: "1px solid #e5e7eb",
    padding: "14px",
    verticalAlign: "top",
  },

  greenButton: button("#16a34a"),
  blueButton: button("#2563eb"),
  purpleButton: button("#7c3aed"),
  orangeButton: button("#f97316"),
  redButton: button("#dc2626"),
  darkRedButton: button("#991b1b"),

  okText: {
    color: "#16a34a",
    fontWeight: "800",
  },

  warningText: {
    color: "#f59e0b",
    fontWeight: "800",
  },

  expiredText: {
    color: "#dc2626",
    fontWeight: "800",
  },
};

function button(bg) {
  return {
    background: bg,
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    fontWeight: "800",
    cursor: "pointer",
    marginRight: "8px",
    marginBottom: "6px",
  };
}