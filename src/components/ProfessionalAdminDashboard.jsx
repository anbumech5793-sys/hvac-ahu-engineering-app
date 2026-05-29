import React, { useEffect, useState } from "react";
import { supabase } from "../authEngine";

export default function ProfessionalAdminDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [message, setMessage] = useState("");

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
    loadData();
  }

  async function rejectUser(userId) {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "rejected" })
      .eq("id", userId);

    if (error) return setMessage(error.message);

    setMessage("User rejected.");
    loadData();
  }

  async function createMonthlyLicense(userId) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const { error } = await supabase.from("licenses").insert({
      user_id: userId,
      plan: "Monthly",
      status: "Active",
      start_date: new Date().toISOString(),
      expiry_date: expiryDate.toISOString(),
      max_projects: 3,
    });

    if (error) return setMessage(error.message);

    setMessage("Monthly license created.");
    loadData();
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
    loadData();
  }

  async function deactivateLicense(licenseId) {
    const { error } = await supabase
      .from("licenses")
      .update({ status: "Inactive" })
      .eq("id", licenseId);

    if (error) return setMessage(error.message);

    setMessage("License deactivated.");
    loadData();
  }

  const totalUsers = profiles.length;
  const pendingUsers = profiles.filter((u) => u.status === "pending").length;
  const approvedUsers = profiles.filter((u) => u.status === "approved").length;
  const activeLicenses = licenses.filter(
    (l) => String(l.status).toLowerCase() === "active" || String(l.status).toLowerCase() === "approved"
  ).length;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Admin Dashboard</h1>

      <p style={styles.subHeading}>
        Manage users, approvals, licenses, subscription expiry, and customer access.
      </p>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.summaryCard}>
        <SummaryBox label="Total Users" value={totalUsers} />
        <SummaryBox label="Pending Users" value={pendingUsers} />
        <SummaryBox label="Approved Users" value={approvedUsers} />
        <SummaryBox label="Active Licenses" value={activeLicenses} />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>User Approval Management</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {profiles.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.full_name || "-"}</td>
                <td style={styles.td}>{user.email || "-"}</td>
                <td style={styles.td}>{user.role || "-"}</td>
                <td style={styles.td}>{user.status || "-"}</td>
                <td style={styles.td}>
                  <button style={styles.greenButton} onClick={() => approveUser(user.id)}>
                    Approve
                  </button>

                  <button style={styles.redButton} onClick={() => rejectUser(user.id)}>
                    Reject
                  </button>

                  <button style={styles.blueButton} onClick={() => createMonthlyLicense(user.id)}>
                    Create License
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
              <th style={styles.th}>Max Projects</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {licenses.map((license) => {
              const user = profiles.find((p) => p.id === license.user_id);

              return (
                <tr key={license.id}>
                  <td style={styles.td}>{user?.email || license.user_id}</td>
                  <td style={styles.td}>{license.plan}</td>
                  <td style={styles.td}>{license.status}</td>
                  <td style={styles.td}>{formatDate(license.start_date)}</td>
                  <td style={styles.td}>{formatDate(license.expiry_date)}</td>
                  <td style={styles.td}>{license.max_projects}</td>
                  <td style={styles.td}>
                    <button style={styles.greenButton} onClick={() => extendLicense(license.id)}>
                      Extend 1 Month
                    </button>

                    <button style={styles.redButton} onClick={() => deactivateLicense(license.id)}>
                      Deactivate
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

const styles = {
  page: { minHeight: "100vh" },
  heading: { fontSize: "40px", fontWeight: "800", color: "#111827", marginBottom: "10px" },
  subHeading: { fontSize: "18px", color: "#374151", marginBottom: "22px" },
  message: { background: "#fef3c7", padding: "14px", borderRadius: "12px", marginBottom: "18px", fontWeight: "700" },
  summaryCard: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  summaryBox: { background: "#111827", color: "white", borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  card: { background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", marginBottom: "30px", overflowX: "auto" },
  sectionTitle: { fontSize: "24px", color: "#111827", borderBottom: "2px solid #e60000", paddingBottom: "8px", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "1100px" },
  th: { background: "#111827", color: "white", padding: "14px", textAlign: "left" },
  td: { borderBottom: "1px solid #e5e7eb", padding: "14px" },
  greenButton: { background: "#16a34a", color: "white", border: "none", borderRadius: "10px", padding: "10px 14px", fontWeight: "800", cursor: "pointer", marginRight: "8px", marginBottom: "6px" },
  blueButton: { background: "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "10px 14px", fontWeight: "800", cursor: "pointer", marginRight: "8px", marginBottom: "6px" },
  redButton: { background: "#dc2626", color: "white", border: "none", borderRadius: "10px", padding: "10px 14px", fontWeight: "800", cursor: "pointer", marginRight: "8px", marginBottom: "6px" },
};