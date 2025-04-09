import { Button } from "@mui/material";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { startGridLoading, stopGridLoading } from "../../../store/emotionSlice";
import "./tagFilter.scss";

interface Props {
  selectedTags: string[];
  setSelectedTags: (tag: string[]) => void;
}

const emotionTags = [
  "😊 기쁨",
  "😢 슬픔",
  "😡 분노",
  "😌 평온",
  "😱 놀람",
  "🥰 사랑",
];

const TagFilter: React.FC<Props> = ({ selectedTags, setSelectedTags }) => {
  const dispatch = useDispatch();

  const handleTagClick = (tag: string) => {
    dispatch(startGridLoading());

    let newTags;
    if (selectedTags.includes(tag)) {
      // 이미 선택된 경우에는 제거
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      // 새로운 태그 추가
      newTags = [...selectedTags, tag];
    }

    setSelectedTags(newTags);

    setTimeout(() => {
      dispatch(stopGridLoading());
    }, 300);
  };

  return (
    <div className="tag__filter">
      {emotionTags.map((tag) => (
        <Button
          key={tag}
          className={classNames("tags__name", {
            selected: selectedTags.includes(tag),
          })}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default TagFilter;
