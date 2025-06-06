import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";

export interface EmotionEntry {
  id: string;
  date: string;
  emotion: string;
  note?: string;
  image_url?: string | null;
}

interface EmotionsState {
  emotions: EmotionEntry[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  loading: boolean;
  filterLoading: boolean;
}

const initialState: EmotionsState = {
  emotions: [],
  status: "idle",
  error: null,
  loading: false,
  filterLoading: false,
};

export const fetchEmotions = createAsyncThunk(
  "emotions/fetchEmotions",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("emotions")
      .select("*")
      .order("date", { ascending: false });
    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const addEmotion = createAsyncThunk(
  "emotions/addEmotion",
  async (emotionData: EmotionEntry, { rejectWithValue }) => {
    const { error } = await supabase.from("emotions").insert([emotionData]);
    if (error) return rejectWithValue(error.message);
    return emotionData;
  }
);

export const updateEmotion = createAsyncThunk(
  "emotions/updateEmotion",
  async (emotionData: EmotionEntry, { rejectWithValue }) => {
    const { id, ...updateFields } = emotionData;
    const { error } = await supabase
      .from("emotions")
      .update(updateFields)
      .eq("id", id);
    if (error) return rejectWithValue(error.message);
    return emotionData;
  }
);

export const deleteEmotion = createAsyncThunk(
  "emotions/deleteEmotion",
  async (id: string, { rejectWithValue }) => {
    const { error } = await supabase.from("emotions").delete().eq("id", id);
    if (error) return rejectWithValue(error.message);
    return id;
  }
);

const emotionSlice = createSlice({
  name: "emotions",
  initialState,
  reducers: {
    resetEmotions: (state) => {
      state.emotions = [];
    },
    startGridLoading: (state) => {
      state.filterLoading = true;
    },
    stopGridLoading: (state) => {
      state.filterLoading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchEmotions.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(
        fetchEmotions.fulfilled,
        (state, action: PayloadAction<EmotionEntry[]>) => {
          state.loading = false;
          state.emotions = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(addEmotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addEmotion.fulfilled,
        (state, action: PayloadAction<EmotionEntry>) => {
          state.emotions.unshift(action.payload);
          state.loading = false;
        }
      )
      .addCase(addEmotion.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateEmotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateEmotion.fulfilled,
        (state, action: PayloadAction<EmotionEntry>) => {
          const index = state.emotions.findIndex(
            (e) => e.id === action.payload.id
          );
          if (index !== -1) {
            state.emotions[index] = action.payload;
          }
          state.loading = false;
        }
      )
      .addCase(updateEmotion.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteEmotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteEmotion.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.emotions = state.emotions.filter(
            (e) => e.id !== action.payload
          );
          state.loading = false;
        }
      )
      .addCase(deleteEmotion.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetEmotions, startGridLoading, stopGridLoading } =
  emotionSlice.actions;

export default emotionSlice.reducer;
