import { ChevronLeft, ChevronRight } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/QuestionNavigation.css";

const QuestionNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  setCurrentQuestionIndex,
  setSelectedAnswer,
  setFeedback,
  setIsAnswered,
}) => {
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetState();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetState();
    }
  };

  const resetState = () => {
    setSelectedAnswer(null);
    setFeedback("");
    setIsAnswered(false);
  };

  return (
    <div className="question-navigation">
      <button
        className="btn btn-outline-secondary"
        onClick={handlePrevious}
        disabled={currentQuestionIndex === 0}
        aria-label="Previous Question"
      >
        <ChevronLeft size={24} />
      </button>

      <p className="question-number">
        Question <span className="fw-bold">{currentQuestionIndex + 1}</span> / {totalQuestions}
      </p>

      <button
        className="btn btn-outline-secondary "
        onClick={handleNext}
        disabled={currentQuestionIndex === totalQuestions - 1}
        aria-label="Next Question"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default QuestionNavigation;
