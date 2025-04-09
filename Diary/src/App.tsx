import { useEffect, useState } from "react";
import AppRouter from "./routes/AppRouter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { fetchEmotions } from "./store/emotionSlice";
import EmptyScreen from "./global/EmptyScreen";
import "./styles/global.scss";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { emotions, loading } = useSelector(
    (state: RootState) => state.emotions
  );

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!emotions.length) {
      dispatch(fetchEmotions());
    }
  }, [dispatch, emotions.length]);

  // 로딩이 끝난 뒤 약간의 딜레이 후 진입
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!isReady) {
    return <EmptyScreen />;
  }

  return <AppRouter />;
}

export default App;
