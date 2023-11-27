import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";

import { VotingAddress, VotingAddressABI } from "./constants";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";
import { GetIpfsUrlFromPinata } from "./utils";

import cv from "@techstark/opencv-js";

// Define a function to load and process an image
function loadImageAndProcess(fileURL) {
  // Load the image from the fileURL and convert to grayscale
  
  console.log(fileURL);
  // let img = cv.imread(fileURL);
  cv.imread(fileURL);
  // let gray_img = new cv.Mat();
  // cv.cvtColor(img, gray_img, cv.COLOR_BGR2GRAY);

  // // Create a SIFT object and detect keypoints and descriptors
  // let sift = new cv.SIFT();
  // let kp_img = new cv.KeyPointVector();
  // let des_img = new cv.Mat();
  // sift.detectAndCompute(gray_img, new cv.Mat(), kp_img, des_img);

  // // Return the image, keypoints, and descriptors
  // return [img, kp_img, des_img];
}

// Define a function to verify the face using SIFT features
function verifyFace(fileURL, threshold) {
  // Load and process the image from the fileURL
  let cap = new cv.VideoCapture(0);
  loadImageAndProcess(fileURL);
  // let [img, kp_img, des_img] = loadImageAndProcess(fileURL);
  // console.log(img);

  // // Open the camera and capture a frame
  // let cap = new cv.VideoCapture(0);
  // let frame = new cv.Mat();
  // cap.read(frame);

  // // Convert the frame to grayscale and detect keypoints and descriptors
  // let gray_frame = new cv.Mat();
  // cv.cvtColor(frame, gray_frame, cv.COLOR_BGR2GRAY);
  // let kp_frame = new cv.KeyPointVector();
  // let des_frame = new cv.Mat();
  // sift.detectAndCompute(gray_frame, new cv.Mat(), kp_frame, des_frame);

  // // Match the descriptors using Brute Force Matcher and sort by distance
  // let bf = new cv.BFMatcher(cv.NORM_L1, true);
  // let matches = new cv.DMatchVector();
  // bf.match(des_img, des_frame, matches);
  // matches.sort((a, b) => a.distance - b.distance);

  // // Draw the matched keypoints and display the result
  // let matching_result = new cv.Mat();
  // cv.drawMatches(img, kp_img, frame, kp_frame, matches, matching_result);
  // cv.imshow("Matching Result", matching_result);

  // // Calculate the ratio of matches to keypoints and compare with threshold
  // let ratio = matches.size() / kp_img.size();
  // if (ratio >= threshold) {
  //   console.log("Face verified");
  // } else {
  //   console.log("Face not verified");
  // }

  // // Release the camera and close the windows
  // cap.release();
  // cv.destroyAllWindows();
}

// verifyFace("https://ipfs.io/ipfs/QmQCutTj8gCnHfQ64mBcRu1b2DAuxgKXYoUrgwmJPhXkvB", 0.7);

export const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();
export const VotingProvider = ({ children }) => {
  const votingTitle = "Voting contract";
  const router = useRouter();
  let vlen = 0;
  let clen = 0;
  const [currentAccount, setCurrentAccount] = useState("");
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
      setCurrentAccount(account[0]);
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
      const { name, address, position } = formInput;
      if (!name || !address || !position) {
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
      // verifyFace(fileURL, 0.7);

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

      const allCandidatesLength = await contract.getCandidateLength();
      clen = allCandidatesLength.toNumber();
      setCandidateLength(clen);
    } catch (error) {
      SetError("Something went wrong in fetching candidate");
    }
  };

  // useEffect(() => {
  //   getNewCandidate();
  // }, []);
  //upload to ipfs voter image
  const giveVote = async (id) => {
    try {
      const candidateAddress = id.address;
      const candidateId = id.id;
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voteredList = await contract.vote(candidateAddress, candidateId);
      console.log(voteredList);
    } catch (error) {
      console.log(error);
      SetError("Error in giving vote");
    }
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
