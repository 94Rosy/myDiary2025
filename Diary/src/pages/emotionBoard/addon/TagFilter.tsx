import { Button } from "@mui/material";
import classNames from "classnames";
import "./tagFilter.scss";

interface Props {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

const emotionTags = [
  "😊 기쁨",
  "😢 슬픔",
  "😡 분노",
  "😌 평온",
  "🥰 사랑",
  "😱 놀람",
];

const TagFilter: React.FC<Props> = ({ selectedTag, setSelectedTag }) => {
  return (
    <div className="tag__filter">
      {emotionTags.map((tag) => (
        <Button
          key={tag}
          className={classNames("tags__name", {
            selected: selectedTag === tag,
          })}
          onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default TagFilter;
