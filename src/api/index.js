import axios from "axios";

const getQuestions = () => {
  const temp = [];
  axios
    .get(
      "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
    )
    .then((item) => {
      const data = item.data.results;
      data.map((element, index) => {
        const questionModel = {
          id: 0,
          question: "",
          answers: [],
          correct_answer: "",
        };

        questionModel.id = index;
        questionModel.question = element.question;
        questionModel.answers.push(element.correct_answer);
        element.incorrect_answers.map((i) => {
          questionModel.answers.push(i);
        });
        questionModel.correct_answer = element.correct_answer;

        temp.push(questionModel);
      });
    });
  return temp;
};

export default getQuestions;
