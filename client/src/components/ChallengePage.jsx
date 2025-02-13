import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestions, getAnswers } from "/../client/API.mjs";
import Modal from "./GroupModal.jsx";
import "../css/challengepage.css";
import QuestionNavigation from "./QuestionNavigation.jsx";
import { PiCatBold } from "react-icons/pi";

const ChallengePage = ({ setFooterOption }) => {
  const [showStartModal, setShowStartModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { challenge } = location.state || {};
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [showRecapModal, setShowRecapModal] = useState(false);

  useEffect(() => {
    setFooterOption("ChallengePage");
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (challenge) {
        const questionsData = await getQuestions(challenge.id);
        setQuestions(questionsData || []);
        setShowStartModal(true); // Show modal after fetching
      }
    };
    fetchQuestions();
  }, [challenge]);

  const totalQuestions = questions.length;
  const totalTime = 120 * totalQuestions; // 2min for each question => Total time in seconds

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      const fetchAnswers = async () => {
        if (question?.id) {
          const answersData = await getAnswers(question.id);
          setAnswers(answersData || []);
        }
      };
      fetchAnswers();
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    console.log("history:", history);
  }, [history]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev + 1 >= totalTime) {
          clearInterval(timer);
          navigate("/challenge-summary", {
            state: {
              correctAnswers,
              skippedQuestions,
              challengeTitle: challenge.title,
            },
          });
          setFooterOption("SummaryChallenge");
          return totalTime;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalTime, setFooterOption]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(Number(event.target.value)); // Convert to number
  };

  const correctMessages = [
    "🎉 Great work! Keep it up! 💪",
    "🚀 You're on fire! Stay focused!",
    "🌟 Excellent! You're getting better!",
    "🔥 That was amazing! Keep going!",
    "💡 Brilliant answer! You nailed it!",
  ];

  const wrongMessages = [
    "💪 Don't worry! Try again next time!",
    "🌱 Mistakes help you grow! Keep learning!",
    "📚 You will improve! Stay motivated!",
    "🔁 Keep practicing! You’ll get it soon!",
    "✨ Almost there! Keep going!",
  ];

  const getRandomMessage = (messages) =>
    messages[Math.floor(Math.random() * messages.length)];

  const handleSubmitAnswer = () => {
    const correctAnswer = answers.find((answer) => answer.is_correct === 1);
    const isCorrect = selectedAnswer === correctAnswer.id;

    let encouragementMessage = isCorrect
      ? getRandomMessage(correctMessages)
      : getRandomMessage(wrongMessages);

    setFeedback({
      type: isCorrect ? "Correct!" : "Wrong!",
      text: correctAnswer.feedback,
      message: encouragementMessage,
    });

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
    }

    setHistory([
      ...history,
      {
        question: currentQuestionIndex,
        answer: selectedAnswer,
        correct: isCorrect,
      },
    ]);

    setShowModal(true);
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setShowModal(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFeedback("");
      setIsAnswered(false);
    } else {
      setSelectedAnswer(null);
    }
  };

  const handleGoToRecap = () => {
    const skippedQuestions = totalQuestions - (correctAnswers + wrongAnswers);
    setSkippedQuestions(skippedQuestions);
    navigate("/challenge-summary", {
      state: {
        correctAnswers,
        skippedQuestions,
        wrongAnswers,
        challengeTitle: challenge.title,
      },
    });
    setFooterOption("SummaryChallenge");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const renderProgressBar = () => (
    <div className="progress-bar">
      <div
        className="progress"
        style={{ width: `${(elapsedTime / totalTime) * 100}%` }}
      ></div>
      <div className="time-info">
        {formatTime(elapsedTime)} / {formatTime(totalTime)}
      </div>
    </div>
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev + 1 >= totalTime) {
          clearInterval(timer);
          navigate("/challenge-summary", {
            state: {
              correctAnswers,
              skippedQuestions,
              challengeTitle: challenge.title,
            },
          });
          setFooterOption("SummaryChallenge");
          return totalTime;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval properly
  }, [
    totalTime,
    navigate,
    correctAnswers,
    skippedQuestions,
    challenge,
    setFooterOption,
  ]);

  const handleStart = () => {
    setShowStartModal(false);
    setElapsedTime(0);
  };

  const hasHistory = history.length > 0;
  const buttonText = selectedAnswer ? "Confirm" : "Go to Summary";
  const buttonAction =
    buttonText === "Confirm"
      ? handleSubmitAnswer
      : () => setShowRecapModal(true);

  return (
    <div className="challenge-page">
      {showStartModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="m-0">{challenge.title}</h3>
            <hr></hr>
            <p className="text-left">Number of Questions: {questions.length}</p>
            <p className="text-left">
              Time of Challenge: {Math.ceil((questions.length * 120) / 60)} min
            </p>
            <button className="btn btn-success" onClick={handleStart}>
              Start
            </button>
          </div>
        </div>
      )}
      {!showStartModal && challenge && questions.length > 0 && (
        <div>
          <h1>{challenge.title}</h1>
          {renderProgressBar()}

          <QuestionNavigation
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            setSelectedAnswer={setSelectedAnswer}
            setFeedback={setFeedback}
            setIsAnswered={setIsAnswered}
          />

          <div className="question-answers">
            <p>{questions[currentQuestionIndex].text}</p>

            <div className="answers-container">
              {answers.map((answer, index) => {
                const previousAnswer = history.find(
                  (item) => item.question === currentQuestionIndex
                );
                const isAnswered = !!previousAnswer;

                return (
                  <div
                    key={index}
                    className={`answer-option ${
                      isAnswered && previousAnswer.answer === answer.id
                        ? previousAnswer.correct
                          ? "correct-answer"
                          : "wrong-answer"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id={`answer-${index}`}
                      name="answer"
                      value={answer.id}
                      checked={
                        isAnswered
                          ? previousAnswer.answer === answer.id // If answered, use history
                          : selectedAnswer === answer.id // Otherwise, use current selection
                      }
                      onChange={handleAnswerChange}
                      disabled={isAnswered} // Disable if previously answered
                    />

                    <label htmlFor={`answer-${index}`}>
                      <span className="answer-label">
                        {String.fromCharCode(65 + index)}.{" "}
                      </span>
                      {answer.text}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="wide-button-container">
            {hasHistory || selectedAnswer ? (
              <button className="create-button" onClick={buttonAction}>
                {buttonText}
              </button>
            ) : null}
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div
                className={`myModal ${
                  feedback.type === "Correct!" ? "correct" : "incorrect"
                }`}
              >
                <div className="d-flex">
                  <PiCatBold className="cat-icon" size={32} />
                  <p className="feedbackType">{feedback.type}</p>
                </div>
                <p className="feedbackText">{feedback.text}</p>
                <p className="encouragementMessage">{feedback.message}</p>{" "}
                {/* New Line for Random Message */}
                <button
                  className="btn btn-secondary ok-btn"
                  onClick={() => {
                    setShowModal(false);
                    handleNextQuestion();
                  }}
                >
                  Ok
                </button>
              </div>
            </div>
          )}

          {showRecapModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p className="text-left">
                  Are you sure you want to leave the challenge and see the
                  summary?
                </p>
                <div className="row-buttons-container">
                  <button className="btn btn-success" onClick={handleGoToRecap}>
                    See Summary
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowRecapModal(false)}
                  >
                    Continue Challenge
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengePage;
