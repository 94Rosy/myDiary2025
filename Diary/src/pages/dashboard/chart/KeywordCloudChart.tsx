import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

interface Word {
  text: string;
  size: number;
}

interface Props {
  words: Word[];
}

const KeywordCloudChart: React.FC<Props> = ({ words }) => {
  const cloudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cloudRef.current || words.length === 0) return;

    const layout = cloud()
      .size([700, 300])
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
        .attr("width", 700)
        .attr("height", 300)
        .append("g")
        .attr("transform", "translate(200,150)");

      svg
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d: any) => `${d.size}px`)
        .style("fill", "#4a4a4a")
        .style("font-weight", "700")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          (d: any) => `translate(${d.x},${d.y}) rotate(${d.rotate})`
        )
        .text((d: any) => d.text);
    }
  }, [words]);

  return <div ref={cloudRef} className="cloud__chart" />;
};

export default KeywordCloudChart;
