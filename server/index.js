const {secp256k1} = require("ethereum-cryptography/secp256k1");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "035923157625dbf68f05cc6ecfefcc7a8d68e50c5acfca6e050d9c13dd9319b79b": 100,
  "0221e3db0e3c7833b1aff8853682a09f628c2563155d85ba295838464b6674fc80": 50,
  "020d87fecd1859ef4e5ccccb06f0625f3ce70c9d2ef805aa865714238ad5ded728": 75,
};

// 69b2ea1db0b86894dd4855fcaf18dd36eb921fa7ffc531f6df841fd493b1f88f
// 59af563ff093308cdd65a716c8e1891c8868d09441fbb579d3be07b1b5db19ab
// 2f2cacac0d59f31a96d335338d8dab786cb53079066030bb43f0d6ae4ceaaff6


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: Get a signature from the client-side application
  // recover the public address from the signature
  // const secp256k1 = require('secp256k1');

  const { sender, recipient, amount, signatureHex } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);


  // if ( signatureHex.recoverPublicKey() ) {
  //   res.status(400).send({ message: "Bad signature!" });
  // }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
