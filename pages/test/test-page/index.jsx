import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Router from "next/router";
import { baseUrl } from "@/config";

const TestPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [local, setLocal] = useState(null);
  const [countDown, setCountDown] = useState(1800000);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [test, setTest] = useState(false);
  const timeRef = useRef(null);

  useEffect(() => {
    setLocal({
      profilePhoto: localStorage.getItem("profilePhoto"),
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
      id: localStorage.getItem("id"),
      token: localStorage.getItem("token"),
    });

    let interval;
    if (test === true && timeRef.current) {
      interval = setInterval(() => {
        const minutes = Math.floor(countDown / 60000);
        const seconds = ((countDown % 60000) / 1000).toFixed(0);
        const time = `${minutes}:${seconds}`;
        if (timeRef.current) {
          timeRef.current.textContent = time;
        }
        setCountDown(countDown - 1000);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [countDown, test]);

  const getQuestions = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/test`, {
        headers: {
          authorization: `Bearer ${local.token}`,
        },
      });
      setQuestions(response.data.data);
      setAnswers(response.data.data.map(() => null));
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(questions);

  const handleOptionChange = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit the result
      const result = questions.map((question, index) => ({
        questionId: question.id,
        ans: answers[index] + 1, // Adjust index to match answer (1-based)
      }));
      axios
        .post(`${baseUrl}/v1/test/result`, { result }, {
          headers: {
            authorization: `Bearer ${local.token}`,
          },
        })
        .then((response) => {
            Router.push("/test/result");
            localStorage.setItem("result", JSON.stringify(response.data.data));
        })
        .catch((error) => console.error(error));
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Conditionally render loading state
  // if (questions.length === 0 && test) {
  //   return <div>Loading...</div>;
  // }

//   console.log(answers);

  return (
    <div>
      {test === false && (
        <>
          <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-[#081F5C] text-white">
            <h1 className="text-3xl font-bold">Start Test</h1>
            <p className="text-lg">
              Before starting the test, read the{" "}
              <span
                onClick={() => document.getElementById("my_modal_2").showModal()}
                className="underline cursor-pointer text-blue-600"
              >
                INSTRUCTIONS
              </span>{" "}
              carefully!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setTest(true);
                getQuestions();
              }}
            >
              Start
            </button>
          </div>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Instructions!</h3>
              <p className="py-4">
                1. Select the correct answer for each question. <br />
                2. click next to move to the next question. <br />
                3. click submit to see your score. <br />
                4. click restart to restart the test. <br />
                4. Do not press back button otherwise your test will be
                terminated. <br />
                5. The text will be 30 minutes, so make sure you have enough
                time. <br />
              </p>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </>
      )}
      {test === true && questions.length > 0 && (
        <div className="px-5 py-7 flex flex-col gap-5 justify-between h-screen">
          <div className="flex flex-row justify-between items-center gap-5">
            <h1 className="text-3xl font-bold text-gray-500">
              Remaining Time: <span ref={timeRef}></span> Mins
            </h1>
            <div className="flex flex-row gap-2 items-center">
              <img
                src={local?.profilePhoto}
                className="rounded-full w-12 avatar"
                alt="profile"
              />
              <p> {local?.name}</p>
            </div>
          </div>
          <div className="flex md:flex-row flex-col gap-20 justify-around items-center m-5">
            {questions[currentQuestion].imageUrl === "" ? (
              <div className="skeleton w-1/3 h-80"></div>
            ) : (
              <img
                alt="test"
                loading="lazy"
                className="md:w-1/3 w-2/3 rounded-3xl border"
                src={questions[currentQuestion].imageUrl}
              />
            )}
            <div className="flex flex-col h-full justify-between ">
              <h1 className="text-2xl font-bold text-gray-500">
                Question {currentQuestion + 1}/{questions.length}
              </h1>
              <h1 className="text-2xl font-bold text-gray-500">
                {questions[currentQuestion].question}
              </h1>
              <div className="flex flex-col gap-5 items-start">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex flex-row gap-5 items-center text-lg">
                    <input
                      type="radio"
                      className="radio"
                      name={`question-${currentQuestion}`}
                      value={index}
                      checked={answers[currentQuestion] === index}
                      onChange={() =>
                        handleOptionChange(currentQuestion, index)
                      }
                    />
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-5 justify-between items-center">
            <button
              className="btn btn-primary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            <button className="btn btn-primary" onClick={handleNextQuestion}>
              {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
