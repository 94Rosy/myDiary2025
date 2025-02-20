import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

serve(async () => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // 관리자 키 사용
  );

  // ✅ 6개월 지난 회원들의 이메일 삭제 (개인정보 보호)
  const { error } = await supabaseAdmin
    .from("users")
    .update({ email: null }) // 이메일 삭제
    .lt("deleted_at", "NOW() - INTERVAL '6 months'"); // 6개월 지난 계정만 대상

  if (error) {
    console.error("개인정보 삭제 실패:", error.message);
    return new Response("삭제 중 오류 발생", { status: 500 });
  }

  console.log("✅ 6개월 지난 회원들의 개인정보 삭제 완료!");
  return new Response("개인정보 삭제 완료", { status: 200 });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/delete-old-users' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
