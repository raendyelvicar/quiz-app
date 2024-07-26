import axios from "axios";

export const fetchQuestionsData = async () => {
  const response = await axios.get(
    "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
  );
  const data = response.data.results;
  return data.map((element, index) => {
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
};
