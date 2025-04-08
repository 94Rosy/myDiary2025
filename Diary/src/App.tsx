import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { fetchEmotions } from "./store/emotionSlice";
import "./styles/global.scss";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const emotions = useSelector((state: RootState) => state.emotions.emotions);

  useEffect(() => {
    if (!emotions.length) {
      dispatch(fetchEmotions());
    }
  }, [dispatch, emotions.length]);

  return <AppRouter />;
}

export default App;
