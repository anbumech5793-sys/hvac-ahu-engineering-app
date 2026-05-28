import { supabase } from "../supabase";

export async function saveProject(project) {
  const { data, error } =
    await supabase
      .from("hvac_projects")
      .insert([project]);

  if (error) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }

  return {
    success: true,
    data,
  };
}

export async function loadProjects() {
  const { data, error } =
    await supabase
      .from("hvac_projects")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(error);

    return {
      success: false,
      error,
    };
  }

  return {
    success: true,
    data,
  };
}

export async function deleteProject(id) {
  const { error } =
    await supabase
      .from("hvac_projects")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(error);

    return {
      success: false,
      error,
    };
  }

  return {
    success: true,
  };
}