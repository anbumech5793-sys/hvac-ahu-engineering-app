import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iqeeoyraytiulypxxqon.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZWVveXJheXRpdWx5cHh4cW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NTUxMDYsImV4cCI6MjA5NDIzMTEwNn0.ww376msHQyv6M5U99xgJI3_VmmnR_k1yJPUT07cJ2fM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signUpUser({ email, password, fullName }) {
  const cleanEmail = String(email || "").trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: { full_name: fullName || "" },
    },
  });

  if (error) throw error;
  return data;
}

export async function loginUser({ email, password }) {
  const cleanEmail = String(email || "").trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function checkUserAccess() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return {
      allowed: false,
      reason: "Please login first.",
    };
  }

  const user = userData.user;

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .limit(1);

  if (profileError) {
    return {
      allowed: false,
      reason: profileError.message,
    };
  }

  const profile = profiles?.[0];

  if (!profile) {
    return {
      allowed: false,
      reason: "Profile not found.",
    };
  }

  const profileStatus = String(profile.status || "").trim().toLowerCase();

  if (profileStatus !== "approved") {
    return {
      allowed: false,
      reason: "Your account is pending admin approval.",
      profile,
    };
  }

  const { data: licenses, error: licenseError } = await supabase
    .from("licenses")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["Approved", "Active", "approved", "active"])
    .gte("expiry_date", new Date().toISOString())
    .order("expiry_date", { ascending: false })
    .limit(1);

  if (licenseError) {
    return {
      allowed: false,
      reason: licenseError.message,
      profile,
    };
  }

  const license = licenses?.[0];

  if (!license) {
    return {
      allowed: false,
      reason: "No active license found.",
      profile,
    };
  }

  return {
    allowed: true,
    reason: "Access granted.",
    profile,
    license,
  };
}