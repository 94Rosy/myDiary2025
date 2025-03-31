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
export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user || null;

  if (!user) return { user: null, name: null };

  // users 테이블에서 name 가져오기
  const { data: userData } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single();

  return {
    user,
    name: userData?.name || "게스트", // 기본값 설정
  };
});

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (user_id: string, { rejectWithValue }) => {
    const { error } = await supabase
      .from("users")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", user_id);

    if (error) return rejectWithValue(error.message);

    // auth signOut도 함께 처리
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
