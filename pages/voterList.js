import React, { useState, useEffect, useContext } from "react";

import VoterCard from "../components/VoterCard/VoterCard";
import Style from "../styles/voterList.module.css";
import { VotingContext } from "../context/Voters";

const voterList = () => {
  const { getAllVoterData, voterArray } = useContext(VotingContext);
  useEffect(() => {
    getAllVoterData();
  }, []);
  return (
    <div className={Style.voter_list}>
      <VoterCard voterArray={voterArray} />
    </div>
  );
};

export default voterList;
