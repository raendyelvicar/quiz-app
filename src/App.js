import { ChakraProvider, Container, Button, Text } from "@chakra-ui/react";
import QuizCard from "./components/QuizCard";
import { useState, useEffect } from "react";
import axios from "axios";
import useLocalStorageState from "./helpers/customHook";

function App() {
  const [questions, setQuestions] = useLocalStorageState("questions", []);
  const [answers, setAnswers] = useLocalStorageState("anwers", {});
  const [submitAnswer, setSubmitAnswer] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let existingAnswers = localStorage.getItem("answers");
        let existingQuestions = localStorage.getItem("questions");
        if (existingQuestions === null && existingAnswers === null) {
          const response = await axios.get(
            "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
          );
          const data = response.data.results;
          const questionsData = data.map((element, index) => {
            const questionModel = {
              id: index,
              question: element.question,
              answers: [element.correct_answer, ...element.incorrect_answers],
              correct_answer: element.correct_answer,
            };

            // Shuffle the answers array
            questionModel.answers = questionModel.answers.sort(
              () => Math.random() - 0.5
            );

            return questionModel;
          });

          setQuestions(questionsData);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Function to handle answer change
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmitAnswer = () => {
    setSubmitAnswer(!submitAnswer);
  };

  const calculateScore = () => {
    let newScore = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        newScore += 1;
      }
    });
    setScore(newScore);
  };

  useEffect(() => {
    calculateScore();
  }, [submitAnswer]);

  return (
    <ChakraProvider>
      {!submitAnswer ? (
        <Container minW={"3xl"} height={"100vh"} p={(10, 10)}>
          {questions.map((question, index) => {
            return (
              <QuizCard
                key={index}
                question={question}
                selectedAnswer={answers[question.id]}
                onAnswerChange={handleAnswerChange}></QuizCard>
            );
          })}
          <Button onClick={handleSubmitAnswer}>Submit</Button>
        </Container>
      ) : (
        <div>Your score : {score}</div>
      )}
    </ChakraProvider>
  );
}

export default App;
