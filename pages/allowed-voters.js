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

const allowedVoters = () => {
  const [fileUrl, setFileURL] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });

  const router = useRouter();
  const { createVoter, voterArray, getAllVoterData } =
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
    getAllVoterData();
  }, []);

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="voter_image" height={100} width={100} />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name : <span> &nbps; {formInput.name}</span>
              </p>
              <p>
                Address : <span> &nbps; {formInput.address.slice(0, 20)}</span>
              </p>
              <p>
                Position : <span> &nbps; {formInput.position}</span>
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
              {voterArray.map((el, i) => (
                <div key={i + 1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el[2]} alt="photo" height={100} width={100} />
                  </div>
                  <div className={Style.car_info}>
                    <p>{el[1]}</p>
                    <p>Address : {el[3].slice(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h1>Create new voter</h1>
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
            placeholder="Voter Name"
            handleClick={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Voter address"
            handleClick={(e) =>
              setFormInput({ ...formInput, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Positions"
            placeholder="Voter Positions"
            handleClick={(e) =>
              setFormInput({ ...formInput, position: e.target.value })
            }
          />
        </div>

        <div className={Style.Button}>
          <Button
            btnName="Authorize voter"
            handleClick={() => createVoter(formInput, fileUrl, router)}
          />
        </div>
      </div>
      {/* <image src={image} alt="ok" /> */}
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

export default allowedVoters;
