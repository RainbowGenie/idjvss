import "./styles.css";
import React, { useState } from "react";
import axios from "axios";
import QrCode from "./components/QrCode";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import "./styles.css";

export default function App() {
  const [otp, setOtp] = useState(0);
  const [ref, setRef] = useState(0);
  const [transactionHash, setTxHash] = useState("");
  const [success, setSuccess] = useState("");
  const getTX = async () => {
    try {
      console.log("gettx");

      const res = await axios.get("http://localhost:5000/api/users/trx", { params: { otp, ref } });
      console.log(res);
      setTxHash(res.data);
    } catch (e) {
      console.log(e);
    }
  };




  const checkTX = async () => {
    console.log("moralis api")
    await Moralis.start({
      apiKey: "Gnvj4czmwJzkIiyXaTKnum7T8oo4C5C8nrmLbdhdOKNBvqhcQF3YT6Y1F1CkpeGY",
      // ...and any other configuration
    });
    const chain = "0x1";

    await Moralis.EvmApi.transaction.getTransaction({
      transactionHash,
      chain,
    })
      .then( async(res)=> {
        console.log("moralis success",res);
        if(res === null){
          const chain = "0x38";
          await Moralis.EvmApi.transaction.getTransaction({
            transactionHash,
            chain,
          }).then(res => {
            if (res?.toJSON().receipt_status === "1") {
              console.log(res)
              const amount1 = res?.toJSON().value / 10 ** 18
              setSuccess("Transaction is success in bscscan!"+ "(" + amount1 + ")");
              console.log("result is success in bscscan")
            } else if(res?.toJSON().receipt_status === "0"){
              setSuccess("Transaction is fail in bscscan")
            }
          })
          .catch(err => {
            console.log(err);
            setSuccess("transaction_hash is not a valid hex address")
          })
        }
        if (res?.toJSON().receipt_status === "1") {
          const amount2 = res?.toJSON().value / 10 ** 18
          console.log(res?.toJSON().value)
          setSuccess("Transaction is success in etherscan!" + "(" + amount2 + ")");
          console.log("result is success in etherscan")
        } else if(res?.toJSON().receipt_status === "0"){

          setSuccess("Transaction is fail in etherscan!")
        }
      })
      .catch(err => {
        console.log(err)
        setSuccess("transaction_hash is not a valid hex address")
      })


  }


  return (
    <div className="App">
      otp :{" "}
      <input
        placeholder="OTP"
        value={otp}
        style={{
          marginRight: "10px"
        }}
        onChange={(e) => {
          setOtp(e.target.value);
        }}
      ></input>
      ref :{" "}
      <input
        placeholder="REFERENCE"
        value={ref}
        style={{
          marginRight: "10px"
        }}
        onChange={(e) => {
          setRef(e.target.value);
        }}
      ></input>
      <button onClick={getTX}>Get TxHash</button>
      <div style={{ margin: "20px" }}>{transactionHash}</div>
      {transactionHash ?
        <button onClick={checkTX}>confirm</button> :
        <p>transaction value</p>}

      <p>{success}</p>

      <div className="section container">
        <QrCode />
      </div>

    </div>
  );
}
