import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { useRouter } from "next/router";
import { toUpper } from "lodash";

const Result = () => {
  const [result, setResult] = useState(null);
  const router = useRouter();
  const intervalRef = useRef(null);

  useEffect(() => {
    const storedResult = JSON.parse(localStorage.getItem("result"));
    setResult(storedResult);
    console.log(storedResult);
  }, []);

  useEffect(() => {
    if (!result) return;

    const progress = parseInt(result.score);
    const level = toUpper(result.level);

    let duration = 15 * 1000;
    let animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    intervalRef.current = setInterval(function () {
      let timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(intervalRef.current);
        return;
      }

      let particleCount = 50 * (timeLeft / duration);
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [result]);

  if (!result) return null;

  const progress = parseInt(result.score);
  const level = toUpper(result.level);

  return (
    <div className="">
      <h1 className="md:text-5xl text-3xl my-10 mx-5 font-semibold">Result</h1>
      <button
        onClick={() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          router.push("/");
        localStorage.removeItem("result");
        }}
        className="btn btn-outline absolute top-10 right-10 btn-circle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </button>
      <div className="flex justify-center flex-col items-center gap-5">
        <div
          className="radial-progress text-[#081F5C] transition-all duration-300"
          style={{
            "--value": progress,
            "--size": "12rem",
            "--thickness": "0.5rem",
          }}
          role="progressbar"
        >
          <span className="text-4xl font-semibold">{result.score}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Levels</th>
                <th>No. of Questions</th>
                <th>Currect Answers</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr className="bg-base-200">
                <th>2</th>
                <td className="text-[#081F5C] font-semibold">Beginner</td>
                <td className="font-semibold text-center">
                  {result?.answers?.beginner?.questions}
                </td>
                <td
                  className={`font-semibold text-center ${
                    result?.answers?.beginner?.questions >
                    result?.answers?.beginner?.answers
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {result?.answers?.beginner?.answers}
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td className="text-[#081F5C] font-semibold">Intermediate</td>
                <td className="font-semibold text-center">
                  {result?.answers?.intermediate?.questions}
                </td>
                <td
                  className={`font-semibold text-center ${
                    result?.answers?.intermediate?.questions >
                    result?.answers?.intermediate?.answers
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {result?.answers?.intermediate?.answers}
                </td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td className="text-[#081F5C] font-semibold">Advanced</td>
                <td className={"font-semibold text-center"}>
                  {result?.answers?.advanced?.questions}
                </td>
                <td
                  className={`font-semibold text-center ${
                    result?.answers?.advanced?.questions >
                    result?.answers?.advanced?.answers
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {result?.answers?.advanced?.answers}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-center">
          <h1 className="md:text-4xl text-3xl my-10 mx-5 font-semibold">
            Congratulations!!
          </h1>
          <p className="text-2xl">
            You have achieved{" "}
            <span className="text-red-500 font-semibold">{level}</span> level.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Result;
