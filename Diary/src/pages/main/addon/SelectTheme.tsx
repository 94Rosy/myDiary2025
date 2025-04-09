// 감정 테마 선택 기능
import React, { useEffect, useState } from "react";
import { Popover, IconButton, Tooltip, Checkbox } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import InfoIcon from "@mui/icons-material/Info";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import "./selectTheme.scss";

const SelectTheme = () => {
  const { emotions, loading } = useSelector(
    (state: RootState) => state.emotions
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // UI 테마 선택 관련
  const [isFixedTheme, setIsFixedTheme] = useState(() => {
    const savedTheme = sessionStorage.getItem("isFixedTheme");
    return savedTheme === null ? false : JSON.parse(savedTheme);
  });

  const [theme, setTheme] = useState("default");

  // 오늘의 감정이 있는지 확인, 감정 등록이 없을 경우 fallback
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const todayEmotion = emotions.find((e) => e.date === todayStr)?.emotion;

  useEffect(() => {
    if (!loading) {
      if (!isFixedTheme && todayEmotion) {
        const emotionTheme: Record<string, string> = {
          "😊 기쁨": "joy",
          "😢 슬픔": "sad",
          "😡 분노": "angry",
          "😌 평온": "calm",
          "😱 놀람": "surprise",
          "🥰 사랑": "love",
        };

        const selected = emotionTheme[todayEmotion] ?? "default";
        setTheme(selected);
      } else {
        setTheme("default");
      }
    }
  }, [loading, isFixedTheme, todayEmotion]);

  useEffect(() => {
    sessionStorage.setItem("isFixedTheme", JSON.stringify(isFixedTheme));
  }, [isFixedTheme]);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFixedTheme(e.target.checked);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          "&:hover": {
            color: "#fff",
            transition: "color 0.2s",
          },
          marginLeft: "3px",
        }}
      >
        <ColorLensIcon
          sx={{
            transition: "color 0.2s",
            "&:active": {
              color: "#fff",
            },
          }}
        />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{
          borderRadius: "10px",
          boxShadow: "0 1px 3px #191919",
        }}
      >
        <div className="theme__popover">
          <div className="theme__check__wrapper">
            <Checkbox
              disableRipple
              sx={{
                color: "var(--check-color)",
                "&.Mui-checked": {
                  color: "var(--check-active-color)",
                },
              }}
              checked={isFixedTheme}
              onChange={handleCheckboxChange}
            />
            <span className="check__msg">기본 테마</span>
            <Tooltip
              title={
                <>
                  체크 해제 시 오늘의 감정 테마가 적용됩니다.
                  <br />
                  아직 등록되지 않았다면 기본 테마가 유지돼요.
                </>
              }
              placement="bottom"
              arrow
            >
              <IconButton
                disableRipple
                sx={{
                  cursor: "auto",
                }}
              >
                <InfoIcon
                  sx={{
                    cursor: "auto",
                    width: 20,
                    height: 20,
                    color: "var(--check-color)",

                    "&:hover": {
                      color: "var(--check-active-color)",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default SelectTheme;
