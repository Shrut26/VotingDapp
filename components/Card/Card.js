import React from "react";
import Image from "next/image";

import Style from "../Card/Card.module.css";
import { useState } from "react";
import TimerProvider from "../../pages/timer";

const Card = ({ candidateArray, giveVote }) => {
  const remainingTime = TimerProvider();
  const [pin, setPin] = useState("");
  const [showTextBox, setShowTextBox] = useState(false);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleVote = (id, address, index) => {
    setSelectedCandidateIndex(index);
    setShowTextBox(true); // Show the text box
    // Call giveVote function passing id and address as arguments
    // giveVote(id, address, pin);
  };
  return (
    <div className={Style.Card}>
      {candidateArray.map((el, i) => (
        <div className={Style.Card_box}>
          <div className={Style.image}>
            <img src={el[3]} alt="profile" height={100} width={100} />
          </div>

          <div className={Style.Card_info}>
            <h2>
              {el[1]} # {el[2].toNumber()}
            </h2>
            <p>Age : {el[0]}</p>
            <p>Address : {el[6].slice(0, 30)}...</p>
          </div>

          {typeof remainingTime === "undefined" && (
            <p className={Style.total}>Total Vote</p>
          )}
          {typeof remainingTime === "undefined" && (
            <div className={Style.Card_vote}>
              <p>{el[4].toNumber()}</p>
            </div>
          )}
          {typeof remainingTime !== "undefined" && (
            <div className={Style.card_button}>
              <button onClick={() => handleVote(el[2].toNumber(), el[6], i)}>
                Vote
              </button>
              {/* <button
                onClick={() =>
                  giveVote({ id: el[2].toNumber(), address: el[6] })
                }
              >
                Vote
              </button> */}
            </div>
          )}
          {i === selectedCandidateIndex && showTextBox && (
            <div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
              >
              </button>
              <button
                onClick={() =>
                  giveVote({ id: el[2].toNumber(), address: el[6], pin: pin })
                }
              >
                Submit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Card;
