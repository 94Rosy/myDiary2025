import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { resetPage } from "../../store/paginationSlice";
import MainCardList from "./addon/MainCardList";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import "./mainPage.scss";

const MainPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    dispatch(resetPage()); // 메인 진입 시 감정 일기의 페이지네이션 초기화
  }, [dispatch]);

  const protectList = (path: string) => {
    if (!user) {
      alert("로그인이 필요해요!");
      navigate("/");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="main__wrapper">
      <div className="title__content">
        <div>EmotionLog</div>
        <div>Capture your feelings, track your mind!</div>
      </div>

      <div className="main__content">
        <MainCardList
          cardType="emotions"
          mainText="My Moods"
          subText="일기 기록하러 가기"
          onClick={() => protectList("/emotions")}
        />
        <MainCardList
          cardType="dashboard"
          mainText="Mood Trends"
          subText="기록 차트 보러 가기"
          onClick={() => protectList("/dashboard")}
        />
      </div>
    </div>
  );
};

export default MainPage;
