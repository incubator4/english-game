import { useState } from "react";
import "./App.css";
import { Word, data } from "./words";

const selectOptions = [10, 20, 50];
const typeOptions = ["全部随机", "基础单词", "核心单词", "进阶单词"];

const App = () => {
  const [selectedOption, setSelectedOption] = useState(selectOptions[0]);
  const [selectedType, setSelectedType] = useState(typeOptions[0]);
  const [quiz, setQuiz] = useState<
    Array<{ options: Array<string>; word: Word }>
  >([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  // const [userAnswers, setUserAnswers] = useState<Array<string>>([]);

  const generateQuiz = (count: number, type: string) => {
    let filteredWords = data;
    if (type !== "全部随机") {
      filteredWords = data.filter((word) => word.type === type);
    }

    const shuffledWords = [...filteredWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    return shuffledWords.map((word) => {
      const wrongOptions = data
        .filter((w) => w !== word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.meaning);

      const options = [...wrongOptions, word.meaning].sort(
        () => Math.random() - 0.5
      );

      return {
        options,
        word,
      };
    });
  };

  const onStartGame = () => {
    const newQuiz = generateQuiz(selectedOption, selectedType);
    setQuiz(newQuiz);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);

    if (answer === quiz[currentQuizIndex].word.meaning) {
      setScore((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex((prev) => prev - 1);
      setSelectedAnswer(null); // 清空当前选择
    }
  };

  // 切换到下一题
  const goToNextQuestion = () => {
    if (currentQuizIndex < quiz.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null); // 清空当前选择
    } else {
      setFinished(true); // 如果是最后一题，标记测验完成
    }
  };

  const curentQuiz = quiz[currentQuizIndex];

  return (
    <>
      <div className="relative max-w-[720px] mx-auto p-4">
        <div className="flex items-center gap-2">
          <select
            className="flex-1 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className="flex-1 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
            value={selectedOption}
            onChange={(e) => setSelectedOption(Number(e.target.value))}
          >
            {selectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            className="whitespace-nowrap rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={onStartGame}
          >
            开始
          </button>
        </div>
        {quiz.length > 0 && curentQuiz && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              第 {currentQuizIndex + 1} 题 / 共 {quiz.length} 题
            </h2>
            <p className="text-lg mb-2">{curentQuiz.word.word}</p>
            <p className="text-sm text-slate-500 mb-4">
              {curentQuiz.word.pronunciation}
            </p>
            <div className="space-y-3">
              {curentQuiz.options.map((option, index) => {
                const isCorrect = option === curentQuiz.word.meaning;
                const isSelected = option === selectedAnswer;

                return (
                  <button
                    key={index}
                    className={`w-full text-left px-4 py-2 border rounded-md transition-colors ${
                      isSelected
                        ? isCorrect
                          ? "bg-green-100 border-green-500" // 选择正确
                          : "bg-red-100 border-red-500" // 选择错误
                        : selectedAnswer !== null && isCorrect
                        ? "bg-green-100 border-green-500" // 显示正确答案
                        : "bg-white border-slate-200 hover:bg-slate-50" // 默认状态
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                );
              })}
              {/* 分页按钮 */}
              <div className="flex justify-between mt-6">
                <button
                  className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuizIndex === 0} // 第一题时禁用
                >
                  上一题
                </button>
                <button
                  className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  onClick={goToNextQuestion}
                  disabled={selectedAnswer === null} // 未选择答案时禁用
                >
                  {currentQuizIndex === quiz.length - 1 ? "完成" : "下一题"}
                </button>
              </div>
            </div>
          </div>
        )}

        {quiz.length > 0 && finished && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">测验结束！</h2>
            <p className="text-lg">
              你的得分: {score} / {quiz.length}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
