import React, { useState } from "react";
import { Popover, IconButton, Tooltip, Checkbox } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import InfoIcon from "@mui/icons-material/Info";
import "./selectTheme.scss";

const SelectTheme = ({
  isFixedTheme,
  setIsFixedTheme,
}: {
  isFixedTheme: boolean;
  setIsFixedTheme: (value: boolean) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
