import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Alert, Snackbar } from "@mui/material";

const TestUserNotice = ({ userEmail }: { userEmail: string | null }) => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  // 테스트 유저
  const isTestUser = user?.email === "test@emolog.com";

  useEffect(() => {
    if (isTestUser) {
      setOpen(true); // 상태 열기
    }
  }, [user]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000} // 5초 뒤에 자동 닫힘
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity="info"
        onClose={() => setOpen(false)}
        sx={{ width: "100%" }}
      >
        현재 로그인한 계정은 테스트 계정입니다. <br />
        테스트 계정은 감정 등록/수정/삭제, 테마 변경, 회원 탈퇴 기능이
        제한됩니다.
      </Alert>
    </Snackbar>
  );
};

export default TestUserNotice;
