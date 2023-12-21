import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";

import { VotingAddress, VotingAddressABI } from "./constants";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";
import { GetIpfsUrlFromPinata } from "./utils";

// // Function to get the URL for a given address
// function getUrlForAddress(address, array) {
//   console.log(address, array);
//   for (let i = 0; i < array.length; i++) {
//     const innerArray = array[i];
//     const innerAddress = innerArray[5];
//     console.log(innerAddress);
//     const innerUrl = innerArray[2];

//     if (innerAddress === address) {
//       return innerUrl;
//     }
//   }

//   // If no matching address is found
//   return null;
// }

function getUrlForAddress(address, array) {
  const result = array
    .map(innerArray => {
      const innerAddress = innerArray[3].toLowerCase();
      const innerUrl = innerArray[2];
      return innerAddress === address ? innerUrl : null;
    })
    .filter(url => url !== null);

  return result.length > 0 ? result[0] : null;
}

function processImageComparisonResult(response) {
  if (response) {
    console.log("Received result from popup:", response);
    if (response.result === "not matching") {
      return 0;
    }
    else {
      return 1;
    }
  } else {
    console.error("Image comparison failed.");
    return -1;
  }
}

export const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();
export const VotingProvider = ({ children }) => {
  const votingTitle = "Voting contract";
  const router = useRouter();
  let vlen = 0;
  let clen = 0;
  let ca = "";
  const [currentAccount, setCurrentAccount] = useState(ca);
  const [candidateLength, setCandidateLength] = useState(clen);
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);

  const [error, SetError] = useState("");
  const highestVote = [];

  const pushVoters = [];
  const [voterArray, setVoterArray] = useState(pushVoters);
  const [voterLength, setVoterLength] = useState(vlen);
  const [voterAddress, setVoterAddress] = useState([]);
  const [fileURL, setFileURL] = useState(null);

  // connecting wallet

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return SetError("please install metamask");

    const account = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (account.length) {
      ca = "";
      ca += account[0];
      setCurrentAccount(account[0]);
      console.log(ca);
    } else {
      SetError("please install metamask & Reload");
    }
  };

  // connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return SetError("please install metamask");
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(account[0]);
  };

  //create voters
  const createVoter = async (formInput, fileURL, router) => {
    try {
      const { name, address, position, pin } = formInput;
      if (!name || !address || !position || !pin) {
        SetError("Input data is missing");
      }

      //connecting smart contract
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = { name, address, position, image: fileURL };
      const pinataUrl = await uploadJSONToIPFS(data);
      const ipfsUrl = GetIpfsUrlFromPinata(pinataUrl.pinataURL);

      const voter = await contract.voterRight(address, name, fileURL, ipfsUrl);
      await voter.wait();

      let result = await fetch("http://localhost:3001/add-pin", {
        method: "POST",
        body: JSON.stringify({
          address,
          pin,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      result = result.json();
      console(result);
      if (result) {
        router.push("/voterList");
      }

      console.log(voter);
      router.push("/voterList");
    } catch (error) {
      SetError("Error in creating the voter");
    }
  };

  const getAllVoterData = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);
      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterData(el);
        pushVoters.push(singleVoterData);
      });

      const voterList = await contract.getVoterLength();
      // console.log(voterList.toNumber());
      vlen = voterList.toNumber();
      // console.log(vlen);
      setVoterLength(vlen);

      // setVoterLength(voterList.toNumber());

      console.log(voterLength);
    } catch (error) {
      SetError("Something went wrong in fetching voter");
    }
  };

  const setCandidate = async (candidateForm, fileURL, router) => {
    try {
      const { name, address, age } = candidateForm;
      if (!name || !address || !age) {
        SetError("Input data is missing");
      }

      console.log(name, address, age, fileURL);
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = { name, address, age, image: fileURL };
      const pinataUrl = await uploadJSONToIPFS(data);
      const ipfsUrl = GetIpfsUrlFromPinata(pinataUrl.pinataURL);

      const candidate = await contract.setCandidate(
        address,
        age,
        name,
        fileURL,
        ipfsUrl
      );
      await candidate.wait();
      console.log(candidate);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const getNewCandidate = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      console.log(contract);
      try {
        console.log(await contract.getCandidates());
      } catch (error) {
        console.log(error);
      }
      const allCandidates = await contract.getCandidates();
      // console.log(allCandidates);
      allCandidates.map(async (ele) => {
        const singleCandidate = await contract.getCandidateData(ele);
        pushCandidate.push(singleCandidate);
        candidateIndex.push(singleCandidate[2].toNumber());
      });

      console.log(pushCandidate);
      // console.log(currentAccount);

      const allCandidatesLength = await contract.getCandidateLength();
      clen = allCandidatesLength.toNumber();
      setCandidateLength(clen);
    } catch (error) {
      SetError("Something went wrong in fetching candidate");
    }
  };

  const giveVote = async (id) => {
    try {
      const candidateAddress = id.address;
      const candidateId = id.id;
      const pin = id.pin;
      const voterImgLink = getUrlForAddress(currentAccount.toLowerCase(), voterArray);

      // localStorage.setItem("voterImgLink", voterImgLink); // Replace with actual link

      const faceVerificationPromise = new Promise((resolve, reject) => {
        window.open("http://localhost:3001/index.html?voterImgLink=" + voterImgLink, "image");

        window.addEventListener("message", handleFaceVerificationResult);

        function handleFaceVerificationResult(event) {
          if (event.origin === "http://localhost:3001") {
            const resFaceMatch = processImageComparisonResult(event.data);
            window.removeEventListener("message", handleFaceVerificationResult);
            resolve(resFaceMatch === 1);
          }
        }
      });

      // const pinVerificationPromise = fetch(
      //   `http://localhost:3001/get-pin/${currentAccount}/${pin}`,
      //   {
      //     method: "GET",
      //     headers: { "Content-Type": "application/json" },
      //   }
      // ).then((result) => result.status === 200);

      const [faceMatch] = await Promise.all([faceVerificationPromise]);

      if (faceMatch) {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);
        const voteredList = await contract.vote(candidateAddress, candidateId);
        console.log(voteredList);
      }
      else {
        // Handle verification failures
        SetError("Face or PIN verification failed");
      }
    } catch (error) {
      console.log(error);
      SetError("Error in giving vote");
    }

    // window.open("http://localhost:3001/index.html?voterImgLink=" + voterImgLink, "image");
    // window.addEventListener("message", (event) => {
    //   if (event.origin === "http://localhost:3001") { // Verify origin for security
    //       let resFaceMatch = processImageComparisonResult(event.data);
    //   }
    // });

    //   if (resFaceMatch === 1) {
    //     let result = await fetch(
    //       `http://localhost:3001/get-pin/${currentAccount}/${pin}`,
    //       {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );

    //     if (result.status === 200) {
    //       const web3modal = new Web3Modal();
    //       const connection = await web3modal.connect();
    //       const provider = new ethers.providers.Web3Provider(connection);
    //       const signer = provider.getSigner();
    //       const contract = fetchContract(signer);
    //       const voteredList = await contract.vote(candidateAddress, candidateId);
    //       console.log(voteredList);
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    //   SetError("Error in giving vote");
    // }
  };
  return (
    <VotingContext.Provider
      value={{
        votingTitle,
        checkIfWalletIsConnected,
        connectWallet,
        createVoter,
        getAllVoterData,
        giveVote,
        setCandidate,
        getNewCandidate,
        error,
        voterArray,
        voterLength,
        voterAddress,
        currentAccount,
        candidateLength,
        candidateArray,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
