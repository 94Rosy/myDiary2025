import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Button, IconButton, Popover } from "@mui/material";
import { AppDispatch, RootState } from "../../../store/store";
import { fetchUser, logoutUser } from "../../../store/authSlice";
import { supabase } from "../../../utils/supabaseClient";
import { fetchEmotions, resetEmotions } from "../../../store/emotionSlice";
import { resetPage } from "../../../store/paginationSlice";
import DeleteAccountModal from "../../../auth/leave/DeleteAccountModal";
import SelectTheme from "./SelectTheme";
import "./navbar.scss";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = useSelector((state: RootState) => state.auth.name);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 회원 정보창 팝오버 관련
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const authOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const authClose = () => {
    setAnchorEl(null);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const openHandler = () => setOpenDelete(true);
  const closeHandler = () => setOpenDelete(false);

  useEffect(() => {
    dispatch(fetchUser());

    // 로그인/로그아웃 상태 감지 후 자동 업데이트
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          dispatch(fetchUser()); // 로그인 시 유저 정보 다시 가져오기
          dispatch(fetchEmotions());
        } else if (event === "SIGNED_OUT") {
          dispatch(logoutUser()); // 로그아웃 감지됨
          navigate("/login"); // 로그인 페이지로 이동
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
      authClose();
    };
  }, [dispatch, navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("err:", error.message);
      return;
    }

    // 로그아웃 후 세션 강제 갱신하여 즉시 반영
    await supabase.auth.getSession();

    dispatch(resetEmotions()); // 감정 기록 초기화
    dispatch(logoutUser()); // Redux 상태 업데이트
    dispatch(resetPage()); // 로그아웃 할 경우 리덕스에 저장되어 있던 페이지네이션 초기화
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <header className="header">
      <Link to="/">
        <div className="logo" />
      </Link>
      <nav>
        <ul>
          {user ? (
            <>
              <li>
                <span>{userName}</span>님 환영합니다!
                <IconButton
                  sx={{
                    "&:hover": {
                      color: "#fff",
                      transition: "color 0.2s",
                    },
                    marginLeft: "3px",
                  }}
                  onClick={authOpen}
                >
                  <ManageAccountsIcon
                    sx={{
                      transition: "color 0.2s",
                    }}
                  />
                </IconButton>
                <div>
                  <Popover
                    className="auth__popover"
                    open={!!open}
                    anchorEl={anchorEl}
                    onClose={authClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    sx={{
                      borderRadius: "10px",
                      boxShadow: "0 1px 3px #191919",
                      alignItems: "flex-start",
                    }}
                  >
                    <Button
                      className="logout__btn"
                      onClick={handleLogout}
                      sx={{
                        justifyContent: "flex-start",
                        width: "100%",
                        color: "var(--popover-text)",
                        "&:hover": {
                          backgroundColor: "var(--popover-hover)",
                          color: "var(--popover-text)",
                        },
                      }}
                    >
                      로그아웃
                    </Button>
                    <Button
                      className="leave__btn"
                      onClick={openHandler}
                      sx={{
                        justifyContent: "flex-start",
                        width: "100%",
                        color: "var(--popover-text)",
                        "&:hover": {
                          backgroundColor: "var(--popover-hover)",
                          color: "var(--popover-text)",
                        },
                      }}
                    >
                      회원 탈퇴
                    </Button>
                  </Popover>

                  {openDelete && (
                    <DeleteAccountModal onClose={closeHandler} user={user} />
                  )}
                </div>
              </li>
              <li>
                <Link to="/emotions">My Moods</Link>
              </li>
              <li>
                <Link to="/dashboard">Mood Trends</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="login__btn">
                  로그인
                </Link>
              </li>
              <li>
                <Link to="/signup" className="signup__btn">
                  회원가입
                </Link>
              </li>
            </>
          )}

          {/* 테마 컬러 변경 */}
          <SelectTheme />
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
