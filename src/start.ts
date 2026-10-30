import { createMiddleware, createStart } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

// Attaches the signed-in user's bearer token to server function calls (validated server-side).
const attachAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});

export const startInstance = createStart(() => ({ functionMiddleware: [attachAuth] }));
