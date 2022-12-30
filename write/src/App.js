import "./App.css";
import { useConnect, useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "./Moralis_logo.png";
import ABI from "./abi.json";
import useDebounce from "./useDebounce";

function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const [userBal, setUserBal] = useState(null);
  const [sendAmount, setSendAmount] = useState(0);
  const [receiver, setReceiver] = useState("");
  const debouncedSendAmount = useDebounce(sendAmount, 500);
  const debouncedReceiver = useDebounce(receiver, 500);
  const { config } = usePrepareContractWrite({
    address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    abi: ABI,
    chainId: 80001,
    functionName: 'transfer(address,uint256)',
    args: [debouncedReceiver, debouncedSendAmount],
    enabled: Boolean(debouncedSendAmount)
  })

  const { write } = useContractWrite(config)

  function changeSendAmount(e){
    setSendAmount(e.target.value)
  }

  function changeReceiver(e){
    setReceiver(e.target.value)
  }

  async function getBalance() {
    const response = await axios.get("http://localhost:3000/getBalance", {
      params: {
        address: address,
      },
    });

    setUserBal(response.data.balance);
  }


  useEffect(() => {
    if (!isConnected) {
      setUserBal(null);
      setReceiver("");
      setSendAmount(0);
      return;
    }

    getBalance();
  }, [isConnected, address]);

  return (
    <div className="App">
      <img src={Logo} alt="Logo image" width="102" height="82" />
      <h1>Send ChainLink</h1>
      {!isConnected ? (
        <button onClick={connect}>Connect Your Wallet</button>
      ) : (
        <>
          <h2>Connected Wallet:</h2>
          <h3>{address}</h3>
          {userBal && <p>(ChainLink Balance: {userBal} Link)</p>}
          <input type="number" value={sendAmount} onChange={changeSendAmount} placeholder="Enter amount" />
          <br/>
          <input type="text" value={receiver} onChange={changeReceiver} placeholder="Enter recipient" />
          <br/>
          <button disabled={!write} onClick={()=>write?.()}>Send</button>
        </>
      )}
    </div>
  );
}

export default App;
