import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // 관리자 키 사용
  );

  // 6개월 지난 사용자 삭제 로직
  const { error } = await supabase
    .from("users")
    .delete()
    .lt(
      "deleted_at",
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString() // 6개월 뒤 삭제
    );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ message: "Old users deleted successfully" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
});
