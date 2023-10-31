import React, { useEffect, useState } from "react";
import Image from "next/image";

import Style from "../VoterCard/VoterCard.module.css";

const VoterCard = ({ voterArray }) => {
  //   useEffect(() => {
  //     console.log(voterArray);
  //   }, []);

  {/* changes here to divide the page into two columns as per voted or not */}
  const [votedVoters, setVotedVoters] = useState([]);

  useEffect(() => {
    const newVotedVoters = voterArray.filter((voter) => voter[6] === true);
    setVotedVoters(newVotedVoters);
  }, [voterArray]);

  return (
    <div className={Style.card}>
      <div className={Style.column}>
        {
          votedVoters.map((el, i) => (
            <div className={Style.card_box} key={i}>
              <div className={Style.image}>
                <img src={el[2]} alt="profile_photo" width={100} height={100} />
              </div>
              <div className={Style.card_info}>
                <h2>
                  {el[1]} # {el[0].toNumber()}
                </h2>
                <p>Address : {el[3].slice(0, 30)}...</p>
                <p>Details</p>
                <p className={Style.vote_status} style={{ color: "green" }}>
                  Already Voted
                </p>
              </div>
            </div>
          ))
        }
      </div>

      <div className={Style.column}>
        {/* {
          voterArray.map((el, i) => {
            if (!votedVoters.includes(el)) {
              return (
                <div className={Style.card_box} key={i}>
                  <div className={Style.image}>
                    <img src={el[2]} alt="profile_photo" width={100} height={100} />
                  </div>
                  <div className={Style.card_info}>
                    <h2>
                      {el[1]} # {el[0].toNumber()}
                    </h2>
                    <p>Address : {el[3].slice(0, 30)}...</p>
                    <p>Details</p>
                    <p className={Style.vote_status} style={{ color: "red" }}>
                      Not Voted
                    </p>
                  </div>
                </div>
              );
            }
          })} */}
        {
          voterArray.filter((voter) => voter[6] === false).map((el, i) => (
            <div className={Style.card_box} key={i}>
              <div className={Style.image}>
                <img src={el[2]} alt="profile_photo" width={100} height={100} />
              </div>
              <div className={Style.card_info}>
                <h2>
                  {el[1]} # {el[0].toNumber()}
                </h2>
                <p>Address : {el[3].slice(0, 30)}...</p>
                <p>Details</p>
                <p className={Style.vote_status} style={{ color: "red" }}>
                  Not Voted
                </p>
              </div>
            </div>
          ))
        }

      </div>
      
      {/* changes here to divide the page into two columns as per voted or not */}

      {/* {voterArray.map((el, i) => (
        <div className={Style.card_box} style={{ flexDirection: el[6] == true ? "row" : "row-reverse" }}>
          <div className={Style.image}>
            <img src={el[2]} alt="profile_photo" width={100} height={100} />
          </div>
          <div className={Style.card_info}>
            <h2>
              {el[1]} # {el[0].toNumber()}
            </h2>
            <p>Address : {el[3].slice(0, 30)}...</p>
            <p>Details</p>
            <p className={Style.vote_status} style={{ color: el[6] == true ? "green" : "red" }}>
              {el[6] == true ? "Already Voted" : "Not Voted"}
            </p>
          </div>
        </div>
      ))} */}

    </div>
  );
};

export default VoterCard;
