import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";
import { User } from "@supabase/supabase-js";

// 유저 데이터 타입
interface AuthState {
  user: User | null;
  name: string | null;
}

const initialState: AuthState = {
  user: null,
  name: null,
};

// Supabase에서 유저 정보 가져오기 (users 테이블에서 name도 가져옴)
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData?.user || null;

    if (!user) return { user: null, name: null };

    const { data: userData, error } = await supabase
      .from("users")
      .select("name, deleted_at")
      .eq("id", user.id)
      .single();

    // 에러가 있거나 탈퇴한 유저인 경우 처리
    if (error || userData?.deleted_at) {
      // 바로 로그아웃 처리
      await supabase.auth.signOut();
      alert("탈퇴한 계정입니다. 6개월 후 재가입이 가능합니다.");
      return rejectWithValue("탈퇴한 계정입니다");
    }

    return {
      user,
      name: userData?.name || "게스트",
    };
  }
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (
    {
      user_id,
      email,
      reason,
    }: { user_id: string; email: string; reason: string },
    { rejectWithValue }
  ) => {
    // 1. users 테이블에 deleted_at 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", user_id);

    if (updateError) return rejectWithValue(updateError.message);

    // 2. delete_requests 테이블에 탈퇴 요청 기록
    const { error: insertError } = await supabase
      .from("delete_requests")
      .insert([
        {
          user_id,
          email,
          reason,
        },
      ]);

    if (insertError) return rejectWithValue(insertError.message);

    // 3. 로그아웃
    await supabase.auth.signOut();
    return true;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: User | null; name: string | null }>
    ) => {
      state.user = action.payload.user;
      state.name = action.payload.name;
    },
    logoutUser: (state) => {
      state.user = null;
      state.name = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.name = action.payload.name;
    });
    builder.addCase(deleteUser.fulfilled, (state) => {
      state.user = null;
      state.name = null;
    });
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
