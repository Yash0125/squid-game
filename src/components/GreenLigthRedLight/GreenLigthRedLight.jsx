import React, { useState, useEffect } from "react";
import './greenLigthRedLight.css';

const GreenLigthRedLight = () => {
  const [gameStart, setGameStart] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [boxColor, setBoxColor] = useState("green");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    difficulty: "easy",
  });
  const [timer, setTimer] = useState(40);
  // eslint-disable-next-line
  const [winningScore, setWinningScore] = useState({
    easy: 10,
    medium: 15,
    hard: 25,
  });

  useEffect(() => {
    let intervalId;

    if (gameStart && !gameOver && timer > 0) {
      intervalId = setInterval(() => {
        // Generate a random number (0 or 1) to select either green or red
        const randomNumber = Math.floor(Math.random() * 2);
        const randomColor = randomNumber === 0 ? "green" : "red";
        setBoxColor(randomColor);

        // Decrease the timer by 1 second
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000); // Change color and decrease timer every 1 second

      // Stop the color change when the timer reaches 0
      setTimeout(() => {
        clearInterval(intervalId);
        checkWin();
        setBoxColor("green"); // Reset color to "green"
      }, timer * 1000); // Stop after the remaining time

      return () => {
        clearInterval(intervalId); // Cleanup the interval when the component unmounts or game restarts
      };
    }// eslint-disable-next-line
  }, [gameStart, gameOver, timer]);

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStartGame = () => {
    // Check if all fields are filled
    if (userData.name && userData.email && userData.mobile) {
      // Check if mobile number is exactly 10 digits
      if (userData.mobile.length === 10 && /^[0-9]+$/.test(userData.mobile)) {
        // All fields are filled, and mobile number is 10 digits
        setGameStart(true);
        setScore(0); // Initialize the score
        setGameOver(false); // Reset game over state
        setTimer(40); // Reset the timer to 40 seconds
        setMessage("");
        setError("");
      } else {
        // Mobile number is not 10 digits or contains non-numeric characters
        setError("Enter a valid 10-digit mobile number");
      }
    } else {
      // Fields are not filled, show an error message or take appropriate action
      console.error("Please fill in all fields before starting the game.");
      setError("Enter Required field");
    }
  };

  const handleBoxClick = () => {
    if (boxColor === "green" && !gameOver) {
      // Increase the score by 1 when the box is clicked on green
      setScore(score + 1);
    } else if (boxColor === "red") {
      // If the box is red, the game is over
      setGameOver(true);
      checkWin();
    }
  };

  const checkWin = () => {
    const winningThreshold = winningScore[userData.difficulty];
    if (score >= winningThreshold) {
      setMessage(`Congratulations! You won with a score of ${score}`);
    } else {
      setMessage(`Game Over! Your Score: ${score}`);
    }
  };

  const handleRestart = () => {
    setGameStart(false);
    setBoxColor("green"); // Reset color to "green"
    setUserData({
      name: "",
      email: "",
      mobile: "",
      difficulty: "easy",
    });
    setMessage("");
    setGameOver(false);
    setTimer(40); // Reset the timer to 40 seconds
  };

  return (
    <div>
      {!gameStart && (
        <div className="container">
          <h2>User Registration</h2>
          <p className="show-error">{error}</p>
          <form>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleRegistrationChange}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleRegistrationChange}
              required
            />

            <label htmlFor="mobile">Mobile Number:</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              minLength={10}
              maxLength={10}
              value={userData.mobile}
              onChange={handleRegistrationChange}
              required
            />

            <label htmlFor="difficulty">Difficulty Level:</label>
            <select
              id="difficulty"
              name="difficulty"
              value={userData.difficulty}
              onChange={handleRegistrationChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button type="button" onClick={handleStartGame}>
              Start Game
            </button>
          </form>
        </div>
      )}
      {gameStart && (
        <>
          <div className="container">
            <div className={`box ${boxColor}`} onClick={handleBoxClick}>
              {boxColor === "green" ? "Click Me" : "Not click me"}
            </div>
            <p>Score: {score}</p>
            <p>Time Left: {timer} seconds</p>
            {(timer === 0 || gameOver) && (
              <>
                <button type="button" onClick={handleRestart}>
                  Restart
                </button>
                <p className="show-message">{message}</p>
              </>
            )}
            <div class="table-container">
        <h3>To win</h3>
        <table>
          <thead>
            <tr>
              <th>Difficulty</th>
              <th>n (score)</th>
              <th>y (given time)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>EASY</td>
              <td>10</td>
              <td>40 secs</td>
            </tr>
            <tr>
              <td>MEDIUM</td>
              <td>15</td>
              <td>40 secs</td>
            </tr>
            <tr>
              <td>HARD</td>
              <td>25</td>
              <td>40 secs</td>
            </tr>
          </tbody>
        </table>
      </div>
          </div>
        </>
      )}
      
    </div>
  );
};

export default GreenLigthRedLight;
