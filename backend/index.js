const express = require("express");
const cors = require("cors");
const Moralis = require("moralis").default;
require("dotenv").config();
const app = express();
const port = 3000;

app.use(cors());

app.get("/getBalance", async (req, res) => {

    const { query } = req;

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address: query.address,
        chain: "80001",
        tokenAddresses: ["0x326C977E6efc84E512bB9C30f76E30c160eD06FB"]
    })


    const bal = response.raw[0]?.balance / 1E18;

    if(bal){
        res.send({balance: bal.toFixed(2)});
    }else{
        res.send({balance: "0.00"})
    }
  
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for reqs`);
  });
});
