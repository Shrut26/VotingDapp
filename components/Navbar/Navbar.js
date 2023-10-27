import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";

import { VotingContext } from "../../context/Voters";
import Style from "../Navbar/Navbar.module.css";

const Navbar = () => {
  const { connectWallet, error, currentAccount } = useContext(VotingContext);

  const [openNav, setOpenNav] = useState(true);

  const openNavigation = () => {
    if (openNav) {
      setOpenNav(false);
    } else {
      setOpenNav(true);
    }
  };
  return (
    <div className={Style.nabar}>
      {error === "" ? (
        ""
      ) : (
        <div className={Style.message_box}>
          <div className={Style.message}>
            <p>{error}</p>
          </div>
        </div>
      )}
      <div className={Style.connect}>
        {currentAccount ? (
          <div>
            <div className={Style.connect_flex}>
              <button onClick={() => openNavigation()}>
                {currentAccount.slice(0, 10)}..
              </button>
              {currentAccount && (
                <span>
                  {openNav ? (
                    <AiFillUnlock onClick={() => openNavigation()} />
                  ) : (
                    <AiFillLock onClick={() => openNavigation()} />
                  )}
                </span>
              )}
            </div>
            {openNav && (
              <div className={Style.navigation}>
                <p>
                  <Link href={{ pathname: "/" }}>Home </Link>
                </p>
                <p>
                  <Link href={{ pathname: "/candidate-registration" }}>
                    Register Candidates
                  </Link>
                </p>
                <p>
                  <Link href={{ pathname: "/allowed-voters" }}>
                    Register Voter
                  </Link>
                </p>
                <p>
                  <Link href={{ pathname: "/voterList" }}>Voters List </Link>
                </p>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => connectWallet()}>Connect Wallet</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
