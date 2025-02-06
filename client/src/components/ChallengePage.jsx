import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestions, getAnswers } from "/../client/API.mjs";
import { FaTrophy } from "react-icons/fa";
import "../css/challengepage.css";
import QuestionNavigation from "./QuestionNavigation.jsx";

const ChallengePage = ({ setFooterOption }) => {
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

  useEffect(() => {
    setFooterOption("ChallengePage");
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (challenge) {
        const questionsData = await getQuestions(challenge.id);
        setQuestions(questionsData || []);
        setAnswers([]);
      }
    };
    fetchQuestions();
  }, [challenge]);

  const totalQuestions = questions.length;
  const totalTime = 300 * totalQuestions; // 2min for each question => Total time in seconds

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
    console.log("Answers:", answers);
  }, [answers]);

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

  const handleSubmitAnswer = () => {
    const correctAnswer = answers.find((answer) => answer.is_correct === 1);

    if (selectedAnswer === correctAnswer.id) {
      setFeedback({ type: "Correct!", text: correctAnswer.feedback });
      setCorrectAnswers((prev) => prev + 1);
      setHistory([
        ...history,
        {
          question: currentQuestionIndex,
          answer: selectedAnswer, // Store ID instead of text
          correct: true,
        },
      ]);
    } else {
      setFeedback({ type: "Wrong!", text: correctAnswer.feedback });
      setWrongAnswers((prev) => prev + 1);
      setHistory([
        ...history,
        {
          question: currentQuestionIndex,
          answer: selectedAnswer, // Store ID instead of text
          correct: false,
        },
      ]);
    }

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

  const handleHello = () => {
    if (
      history.length > 0 &&
      history.some((item) => item.question === currentQuestionIndex)
    ) {
      console.log("Historyyyy:", history);
      console.log("HELLOOOOOOOOOO");
      console.log("XXX: ", questions[currentQuestionIndex].id);
    }
  };

  return (
    <div className="challenge-page">
      {challenge && questions.length > 0 && (
        <div>
          <h1>Challenge: {challenge.title}</h1>
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

          <div className="button-group">
            {selectedAnswer && (
              <button onClick={handleSubmitAnswer}>Confirm</button>
            )}

            {currentQuestionIndex == questions.length - 1 && (
              <button onClick={handleGoToRecap}>Stop and Summary</button>
            )}
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div
                className={`myModal ${
                  feedback.type === "Correct!"
                    ? "correct"
                    : feedback.type === "Wrong!"
                    ? "incorrect"
                    : "no-feedback"
                }`}
              >
                <p className="feedbackType">{feedback.type}</p>
                <p className="feedbackText">{feedback.text}</p>

                <button
                  onClick={() => {
                    setShowModal(false);
                    if (feedback.type) {
                      handleNextQuestion();
                    }
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default ChallengePage;
