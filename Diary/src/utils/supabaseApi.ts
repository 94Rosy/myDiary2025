import { supabase } from "./supabaseClient";

interface DeleteRequestPayload {
  user_id: string;
  reason: string;
}

export const insertDeleteRequest = async ({
  user_id,
  reason,
}: DeleteRequestPayload) => {
  const { error } = await supabase
    .from("delete_requests")
    .insert([{ user_id, reason }]);

  if (error) {
    console.error("삭제 요청 저장 실패:", error.message);
    throw new Error("삭제 요청 저장에 실패했습니다.");
  }

  return true;
};
