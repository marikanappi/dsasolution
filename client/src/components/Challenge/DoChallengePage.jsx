import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Importa useNavigate per la navigazione
import { getQuestions, getAnswers } from "/../client/API.mjs";
import { Link } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";

const ChallengePage = ({ setFooterOption}) => {
  const location = useLocation(); // Ottieni la location
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { challenge } = location.state || {};  // Recupera l'oggetto challenge passato dallo stato
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Carica le domande all'inizio
  useEffect(() => {
    const fetchQuestions = async () => {
      if (challenge) {
        console.log(`Fetching questions for challenge ID: ${challenge.id}`);
        const questionsData = await getQuestions(challenge.id);
        if (questionsData) {
          console.log('Questions fetched:', questionsData);
          setQuestions(questionsData);
        } else {
          console.error('Failed to fetch questions');
        }
      }
    };

    fetchQuestions();
  }, [challenge]);

  // Carica le risposte per la domanda corrente
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      console.log('Question:', question); // Verifica la struttura della domanda
      console.log(`Fetching answers for question ID: ${question.id}`);
      
      const fetchAnswers = async () => {
        if (question.id) { // Aggiungi un controllo per l'ID
          const answersData = await getAnswers(question.id);
          if (answersData) {
            console.log('Answers fetched:', answersData);
            setAnswers(answersData);
          } else {
            console.error('Failed to fetch answers');
          }
        } else {
          console.error('Question ID is undefined');
        }
      };
  
      fetchAnswers();
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      setFeedback("Please select an answer!");
      return;
    }
  
    // Trova la risposta corretta
    const correctAnswer = answers.find(answer => answer.is_correct);
  
    if (correctAnswer) {
      // Verifica se la risposta selezionata corrisponde alla risposta corretta
      if (selectedAnswer === correctAnswer.text) {
        setFeedback(`RISPOSTA CORRETTA !!`);
      } else {
        setFeedback(`${correctAnswer.feedback}`);
      }
    } else {
      setFeedback("No correct answer provided for this question.");
    }
  
    // Imposta isAnswered su true dopo aver inviato la risposta
    setIsAnswered(true);
  };
  

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) { // Fino all'ultima domanda
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFeedback(""); // Reset feedback per la domanda successiva
      setIsAnswered(false); // Reset stato di risposta per la nuova domanda
    } else {
      setFeedback("You have completed the challenge!");
    }
  };
  
  return (
    <div className="challenge-page">
      {challenge && questions.length > 0 && (
        <>
          <h1>Challenge: {challenge.title}</h1>
          <p>{questions[currentQuestionIndex].text}</p>
          
          <div>
            {answers.map((answer, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`answer-${index}`}
                  name="answer"
                  value={answer.text}
                  onChange={handleAnswerChange}
                />
                <label htmlFor={`answer-${index}`}>{answer.text}</label>
              </div>
            ))}
          </div>
  
          <div>
            <button onClick={handleSubmitAnswer}>Submit Answer</button>
            {feedback && <div className="feedback">{feedback}</div>}
          </div>
  
          <div>
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={handleNextQuestion}>Next Question</button>
            ) : (
              isAnswered && (  // Mostra il tasto riepilogo solo dopo aver inviato una risposta
                <Link to={`/summary`} className="text-decoration-none">
                  <button onClick={() => setFooterOption("SummaryChallenge")}>
                    <FaTrophy className="trophy-icon" />
                    <span>{challenge.title}</span>
                  </button>
                </Link>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengePage;
