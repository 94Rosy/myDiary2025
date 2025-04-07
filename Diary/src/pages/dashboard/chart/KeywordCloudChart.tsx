import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import { IconButton, Tooltip } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useNavigate } from "react-router-dom";
import "./keywordCloudChart.scss";
interface Word {
  text: string;
  size: number;
}

interface Props {
  words: Word[];
}

const KeywordCloudChart: React.FC<Props> = ({ words }) => {
  const cloudRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cloudRef.current || words.length === 0) return;

    const layout = cloud()
      .size([300, 300])
      .words(words)
      .padding(5)
      .rotate(() => 0)
      .fontSize((d: any) => d.size)
      .on("end", draw);

    layout.start();

    function draw(words: any[]) {
      d3.select(cloudRef.current).selectAll("*").remove(); // 초기화

      const svg = d3
        .select(cloudRef.current)
        .append("svg")
        .attr("width", 400)
        .attr("height", 300)
        .append("g")
        .attr("transform", "translate(200,150)");

      svg
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d: any) => `${d.size}px`)
        .style("fill", "#0d0f17")
        .style("font-weight", "700")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          (d: any) => `translate(${d.x},${d.y}) rotate(${d.rotate})`
        )
        .text((d: any) => d.text);
    }
  }, [words]);

  return (
    <div className="cloud__chart">
      {!words.length ? (
        <>
          <div className="main__text">단어가 부족해요!</div>
          <div className="sub__text">
            <span>오늘의 기록을 남기러 갈까요?</span>
            <Tooltip title="등록하러 가기" placement="bottom-start" arrow>
              <IconButton
                size="small"
                className="go__emotions"
                onClick={() => navigate("/emotions")}
                sx={{
                  backgroundColor: "#fce624",
                  color: "#4a4a4a",
                  "&:hover": {
                    backgroundColor: "#ebd723",
                    color: "#fff",
                    transition: "color 0.2s",
                  },
                }}
              >
                <ArrowOutwardIcon
                  sx={{
                    transition: "color 0.2s",
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        </>
      ) : (
        <div ref={cloudRef} />
      )}
    </div>
  );
};

export default KeywordCloudChart;
