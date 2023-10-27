import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

import { VotingContext } from "../context/Voters";
import image from "../assets/image";
import Style from "../styles/allowedVoters.module.css";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../context/pinata";
import { GetIpfsUrlFromPinata } from "../context/utils";

const candidateRegistration = () => {
  const [fileUrl, setFileURL] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    age: "",
  });

  const router = useRouter();
  const { setCandidate, getNewCandidate, candidateArray } =
    useContext(VotingContext);
  const onDrop = useCallback(async (file) => {
    console.log(file[0]);
    const response = await uploadFileToIPFS(file[0]);
    if (response.success === true) {
      const pinataUrl = GetIpfsUrlFromPinata(response.pinataURL);
      setFileURL(pinataUrl);
      console.log("Uploaded image to Pinata: ", pinataUrl);

      // setFileURL(response.pinataURL);
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  useEffect(() => {
    getNewCandidate();
    console.log(candidateArray);
  }, []);

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="candidate_image" height={100} width={100} />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name : <span> &nbps; {candidateForm.name}</span>
              </p>
              <p>
                Address :{" "}
                <span> &nbps; {candidateForm.address.slice(0, 20)}</span>
              </p>
              <p>
                Age : <span> &nbps; {candidateForm.age}</span>
              </p>
            </div>
          </div>
        )}
        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create Candidate for Voting</h4>
              <p className={Style.sideInfo_paragraph}> Contract Candidate</p>
            </div>
            <div className={Style.car}>
              {candidateArray.map((el, i) => (
                <div key={i + 1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el[3]} alt="photo" height={100} width={100} />
                  </div>
                  <div className={Style.car_info}>
                    <p>
                      {el[1]} # {el[2].toNumber()}
                    </p>
                    <p>{el[0]}</p>
                    <p>Address : {el[6].slice(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h1>Create new Candidate</h1>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={Style.voter_container_box_div_info}>
                  <p>Upload file : JPG, PNG</p>
                  <div className={Style.voter_container_box_div_image}>
                    <Image src="" alt="photo" />
                    <p>Drag & Drop File</p>
                    <p>or Browse media on device</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={Style.input_container}>
          <Input
            inputType="text"
            title="Name"
            placeholder="Candidate Name"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Candidate address"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Age"
            placeholder="Candidate Age"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, age: e.target.value })
            }
          />
        </div>

        <div className={Style.Button}>
          <Button
            btnName="Authorize Candidate"
            handleClick={() => setCandidate(candidateForm, fileUrl, router)}
          />
        </div>
      </div>
      {/* <image src={image} alt="ok" /> */}
      {/* {console.log(candidateForm)} */}
      {fileUrl ? (
        <div className={Style.createVoter}>
          <div className={Style.createdVoter_info}>
            <image src={fileUrl} alt="user profile" />
            <p>Notice for User</p>
            <p> Organiser</p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default candidateRegistration;
