// import { erode } from "@techstark/opencv-js";
import React, { useState, useEffect } from "react";

const TimerProvider = () => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const fetchRemainingTime = async () => {
      try {
        const response = await fetch("http://localhost:3001/remaining-time");
        const data = await response.json();
        setRemainingTime(data.remainingTime);
      } catch (error) {
        console.log(error);
        setRemainingTime(undefined);
      }
    };
    fetchRemainingTime();
  }, []);
  // {console.log(remainingTime)};
  return remainingTime;
  // typeof remainingTime === 'undefined' ? ('undefined') : remainingTime
};

export default TimerProvider;
