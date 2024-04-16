"use client";
import React, { useState, useEffect } from "react";

export default function LandingPage() {
  const [video, setVideo] = useState(null);
  const [sentence, setSentence] = useState("");
  const [guess, setGuess] = useState("");
  const [isCorrect, setIsCorrect] = useState(null); // null, true (correct), or false (incorrect)

  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

  const fetchVideo = () => {
    fetch("http://localhost:5000/api/random-video")
      .then((response) => response.json())
      .then((data) => {
        setVideo(data);
        setSentence(data.sentence);
        setIsCorrect(null); // Reset the correctness state to allow for new submissions
        setGuess(""); // Clear the guess input for a new start
      })
      .catch((err) => {
        console.error("Error fetching random video:", err);
        setVideo(null);
      });
  };

  const handleGuessSubmit = async (event) => {
    event.preventDefault();
    // If currently showing results, fetch a new video
    if (isCorrect !== null) {
      fetchVideo();
      return;
    }
    // Process a new guess
    if (video && guess) {
      const response = await fetch(
        `http://localhost:5000/api/videos/${video._id}/guess`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ guess }),
        }
      );
      const result = await response.json();
      setIsCorrect(result.correct); // Set the result of the guess
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchVideo();
    return () => {
      document.body.style.overflow = "unset"; // Reset overflow property on unmount
    };
  }, []);

  return (
    <main className="mt-8">
      <div className="aspect-w-16 aspect-h-9 w-3/4 max-w-s mx-auto">
        {video ? (
          <video
            controls
            className="w-full h-full object-contain mx-auto bg-black rounded"
            src={video.url}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>Loading video...</p>
        )}
      </div>
      <div className="text-center mt-8">
        <p className="text-xl mb-8">{sentence}</p>
        <form onSubmit={handleGuessSubmit} className="inline-block">
          <input
            type="text"
            value={guess}
            onChange={handleGuessChange}
            className="border-2 border-gray-300 rounded-lg p-2 text-xl mr-2"
            placeholder="Type your guess here"
          />
          <button
            type="submit"
            className={`px-6 py-2 text-lg font-semibold rounded-lg ${isCorrect === null ? "bg-blue-500 text-white" : isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
          >
            {isCorrect === null ? "Submit" : isCorrect === true ? "正解！" : "不正解！"}
          </button>
        </form>
      </div>
    </main>
  );
}


