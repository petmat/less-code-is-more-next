import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing supabase configuration");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const getVisitCount = async () => {
  const { count } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
};

export const addVisit = async (visit: {
  remoteAddress: string | null;
  userAgent: string | null;
  time: string;
}) => {
  await supabase.from("visits").insert({
    remote_address: visit.remoteAddress,
    user_agent: visit.userAgent,
    time: visit.time,
  });
};
