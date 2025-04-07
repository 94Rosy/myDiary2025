import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { deleteUser, fetchUser, logoutUser } from "../../store/authSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DeleteAccountModal from "../leave/DeleteAccountModal";
import { resetPage } from "../../store/paginationSlice";
import { Button, IconButton, Popover } from "@mui/material";
import "../../styles/navbar.scss";
import { resetEmotions } from "../../store/emotionSlice";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = useSelector((state: RootState) => state.auth.name);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUser());

    // 로그인/로그아웃 상태 감지 후 자동 업데이트
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          dispatch(fetchUser()); // 로그인 시 유저 정보 다시 가져오기
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

  const handleDeleteAccount = async (finalReason: string, password: string) => {
    if (!user) return;

    // 비밀번호 확인 로직
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    });

    if (error || !data?.user) {
      alert("비밀번호가 올바르지 않습니다.");
      return;
    }

    // 탈퇴 처리 (Redux Thunk)
    dispatch(
      deleteUser({
        user_id: user.id,
        reason: finalReason || "",
        email: user.user_metadata?.email || "",
      })
    );
    setOpenDelete(false);
    navigate("/"); // 메인으로 이동
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
                {userName}님 <span>환영합니다!</span>
                <IconButton onClick={authOpen}>
                  <ManageAccountsIcon />
                </IconButton>
                <div>
                  <Popover
                    open={!!open}
                    anchorEl={anchorEl}
                    onClose={authClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                  >
                    <Button className="logout-btn" onClick={handleLogout}>
                      로그아웃
                    </Button>
                    <Button className="leave-btn" onClick={openHandler}>
                      회원 탈퇴
                    </Button>
                  </Popover>

                  {openDelete && (
                    <DeleteAccountModal
                      onClose={closeHandler}
                      onDelete={handleDeleteAccount}
                    />
                  )}
                </div>
              </li>
              <li>
                <Link to="/emotions">My Mood</Link>
              </li>
              <li>
                <Link to="/dashboard">Mood Trends</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="login-btn">
                  로그인
                </Link>
              </li>
              <li>
                <Link to="/signup" className="signup-btn">
                  회원가입
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
