import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iqeeoyraytiulypxxqon.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZWVveXJheXRpdWx5cHh4cW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NTUxMDYsImV4cCI6MjA5NDIzMTEwNn0.ww376msHQyv6M5U99xgJI3_VmmnR_k1yJPUT07cJ2fM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signUpUser({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return {
      allowed: false,
      reason: profileError.message,
    };
  }

  if (!profile) {
    return {
      allowed: false,
      reason: "Profile not found.",
    };
  }

  if (profile.status !== "approved") {
    return {
      allowed: false,
      reason: "Your account is pending admin approval.",
      profile,
    };
  }

  const { data: license, error: licenseError } = await supabase
    .from("licenses")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (licenseError) {
    return {
      allowed: false,
      reason: licenseError.message,
      profile,
    };
  }

  if (!license) {
    return {
      allowed: false,
      reason: "No active license found.",
      profile,
    };
  }

  if (new Date() > new Date(license.expiry_date)) {
    return {
      allowed: false,
      reason: "License expired.",
      profile,
      license,
    };
  }

  return {
    allowed: true,
    reason: "Access granted.",
    profile,
    license,
  };
}