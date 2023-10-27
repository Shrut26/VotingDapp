import React, { useState, useEffect, useContext } from "react";
import Countdown from "react-countdown";
import Image from "next/image";

import { VotingContext } from "../context/Voters";
import Card from "../components/Card/Card";
import Style from "../styles/index.module.css";

const index = () => {
  const {
    getNewCandidate,
    candidateArray,
    getAllVoterData,
    giveVote,
    checkIfWalletIsConnected,
    candidateLength,
    currentAccount,
    voterLength,
  } = useContext(VotingContext);

  useEffect(() => {
    checkIfWalletIsConnected();
    getNewCandidate();
    getAllVoterData();
    console.log("voter", voterLength);
    console.log("candidates", candidateArray);
  }, []);
  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                Number of candidates : <span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                Number of voters : <span>{voterLength}</span>
              </p>
            </div>
          </div>

          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 1000000} />
            </small>
          </div>
        </div>
      )}

      <Card candidateArray={candidateArray} giveVote={giveVote} />
    </div>
  );
};

export default index;
