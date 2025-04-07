import { EmotionEntry } from "../../../../store/emotionSlice";

export interface Word {
  text: string;
  size: number;
}

export function getCloudWordEmo(emotions: EmotionEntry[]): Word[] {
  // 단어를 세는 저장소
  const wordMap: { [word: string]: number } = {};

  // forEach로 감정 노트 꺼내기
  emotions.forEach((entry) => {
    const note = entry.note || "";
    const cleaned = note
      .replace(/[^\p{L}\p{N}\s]/gu, "") // 유니코드 기반으로 문장부호 제거
      .toLowerCase(); // 대소문자 구분 없이 다 소문자로 통일

    const words = cleaned.split(/\s+/); // 공백으로 단어 분리

    words.forEach((word) => {
      if (word.length < 3) return; // 3자 이상인 단어만 보여주기
      wordMap[word] = (wordMap[word] || 0) + 1; // wordMap[word]가 없으면 0으로 시작 있으면 +1
    });
  });

  // 정제된 결과 리턴
  return Object.entries(wordMap).map(([text, count]) => ({
    text,
    size: 15 + count * 5, // 등장 횟수에 따라 폰트 크기 설정
  }));
}
