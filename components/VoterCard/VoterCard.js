import React, { useEffect } from "react";
import Image from "next/image";

import Style from "../card/Card.module.css";
import voterCardStyle from "../VoterCard/VoterCard.module.css";

const VoterCard = ({ voterArray }) => {
  //   useEffect(() => {
  //     console.log(voterArray);
  //   }, []);
  return (
    <div className={Style.card}>
      {voterArray.map((el, i) => (
        <div className={Style.card_box}>
          <div className={Style.image}>
            <img src={el[2]} alt="profile_photo" width={100} height={100} />
          </div>
          <div className={Style.card_info}>
            <h2>
              {el[1]} # {el[0].toNumber()}
            </h2>
            <p>Address : {el[3].slice(0, 30)}...</p>
            <p>Details</p>
            <p className={voterCardStyle.vote_status}>
              {el[6] == true ? "You Already Voted" : "Not Voted"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoterCard;
