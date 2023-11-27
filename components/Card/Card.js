import React from "react";
import Image from "next/image";

import Style from "../Card/Card.module.css";

import TimerProvider from "../../pages/timer";

const Card = ({ candidateArray, giveVote }) => {
  const remainingTime = TimerProvider();
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
          
          {typeof remainingTime === 'undefined' && (<p className={Style.total}>Total Vote</p>)}
          {typeof remainingTime === 'undefined' && (<div className={Style.Card_vote}>
            <p>{el[4].toNumber()}</p>
          </div>)}
          {typeof remainingTime !== 'undefined' && (<div className={Style.card_button}>
            <button
              onClick={() => giveVote({ id: el[2].toNumber(), address: el[6] })}
            >
              Vote
            </button>
          </div>)}
        </div>
      ))}
    </div>
  );
};

export default Card;