import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
"https://iqeeoyraytiulypxxqon.supabase.co";

const supabaseAnonKey =
"sb_publishable_WIP80tX-oEle6fYnPjoBYQ_CTOiwR_e";

export const supabase =
createClient(
  supabaseUrl,
  supabaseAnonKey
);