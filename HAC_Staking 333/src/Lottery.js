import './App.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import 'sf-font';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';
import truncateEthAddress from 'truncate-eth-address';
import { Navbar,Nav } from 'react-bootstrap'
import LOGO from './art.png'
import { Route, Link } from 'react-router-dom';
import App from './App'


const ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [
      { internalType: "address", name: "have", type: "address" },
      { internalType: "address", name: "want", type: "address" },
    ],
    name: "OnlyCoordinatorCanFulfill",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  { stateMutability: "payable", type: "fallback" },
  {
    inputs: [
      { internalType: "uint256", name: "_newDuration", type: "uint256" },
    ],
    name: "changeDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "endTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tickets", type: "uint256" }],
    name: "enter",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "entryCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "entryIdToParticipant",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestWinner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lotteryDuration",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lotteryID",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_newMaxAmountPerTx", type: "uint256" },
      {
        internalType: "uint256",
        name: "_newMaxAmountPerPlayer",
        type: "uint256",
      },
      { internalType: "uint256", name: "_newFee", type: "uint256" },
    ],
    name: "maxParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxTicketsPerPlayer",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxTicketsPerTx",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "participantEntries",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "pastWinner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "payoutLottery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pickWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "previousWinner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "requestId", type: "uint256" },
      { internalType: "uint256[]", name: "randomWords", type: "uint256[]" },
    ],
    name: "rawFulfillRandomWords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "s_randomWords",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "s_requestId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "start",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_destination", type: "address" },
    ],
    name: "transferTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

const TOKENABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "controller", type: "address" }],
    name: "addController",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "controller", type: "address" }],
    name: "removeController",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

var web3 = null;
var account = null;
var contract = null;
var tokencontract = null;

const TOKENADDRESS = "0xceA4195AeCc3622179334e346cF526312F32D836";
const ADDRESS = "0x548C724F5095De7F6A3F1b319047C8373626FF64";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: 'https://bsc-dataseed1.binance.org'
      },
      chainId: 56
    }
  }
}

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
  theme: "dark",
});


  async function connectwallet() {
    var provider = await web3Modal.connect();
    web3 = new Web3(provider);
    var accounts = await web3.eth.getAccounts();
    account = accounts[0];
    var finalAccount = `${truncateEthAddress(account)}`
    document.getElementById('wallet-address').textContent = finalAccount;
    contract = new web3.eth.Contract(ABI, ADDRESS);
  tokencontract = new web3.eth.Contract(TOKENABI, TOKENADDRESS);
  var getbalance = await tokencontract.methods.balanceOf(account).call()
  var int = String(getbalance).split(",")[0];
  var balrwd = Web3.utils.fromWei(int);
  var totalbal = Number(balrwd).toFixed(2);
  document.getElementById("total-token").textContent = totalbal;
  var lotto = await contract.methods.lotteryID().call();
  document.getElementById("lottery-id").textContent = lotto;
  var ticketAmount = await contract.methods.participantEntries(account).call();
  document.getElementById("total-ticket").textContent = ticketAmount;
  /* var winner = await contract.methods.previousWinner().call()
  console.log(winner);
  document.getElementById("winner").textContent = winner; */
  var maxTx = await contract.methods.maxTicketsPerTx().call()
  console.log(maxTx);
 document.getElementById("max-slot").textContent = maxTx;
 var maxRx = await contract.methods.maxTicketsPerPlayer().call()
 console.log(maxRx);
document.getElementById("max-round").textContent = maxRx;
  var btndis = document.getElementById('enter-btn');
  var getLotteryState = await contract.methods.isActive().call();
  console.log(getLotteryState);
  if(getLotteryState == false) {
    btndis.style.display = "none";
  document.getElementById("closed-lotto").style.display = "flex";
  }
  fee();
  balance()
}
async function enter() {
  var _ticketAmount = Number(document.querySelector("[name=amount]").value);
  contract.methods.enter(_ticketAmount).send({ from: account });
}

/* async function balance () {
        const etherscan = await axios.get(endpoint + `?module=account&action=tokenbalance&contractaddress=${TOKENADDRESS}&address=${account}&tag=latest&apikey=${apikey}`)
        document.getElementById('balance').innerHTML = etherscan;
    } */

    async function balance() {
      var getbalance = await tokencontract.methods.balanceOf(account).call()
      var int = String(getbalance).split(",")[0];
      var balrwd = Web3.utils.fromWei(int);
      var totalbal = Number(balrwd).toFixed(2);
      document.getElementById("total-token").textContent = totalbal;
      var lotto = await contract.methods.lotteryID().call();
      document.getElementById("lottery-id").textContent = lotto;
      var ticketAmount = await contract.methods.participantEntries(account).call();
      document.getElementById("total-ticket").textContent = ticketAmount;
      var btndis = document.getElementById('enter-btn');
      var getLotteryState = await contract.methods.isActive().call();
      console.log(getLotteryState);
      if(getLotteryState == false) {
        btndis.style.display = "none";
      document.getElementById("closed-lotto").style.display = "flex";
      }
      fee();
      var maxTx = await contract.methods.maxTicketsPerTx().call()
      console.log(maxTx);
     document.getElementById("max-slot").textContent = maxTx;
     var maxRx = await contract.methods.maxTicketsPerPlayer().call()
     console.log(maxRx);
    document.getElementById("max-round").textContent = maxRx;
    var checkApprovalStats = await tokencontract.methods.allowance(account, ADDRESS).call();
    console.log(checkApprovalStats)
    var init = checkApprovalStats.toString();
    var balapp = Web3.utils.fromWei(init);
    var totalapp = Number(balapp);
    console.log(totalapp)
    if(totalapp <= 1000) {
      document.getElementById("approval").style.display = "flex"
    }
    
    }


async function approve() {
  var val = Web3.utils.toWei("1000000000000000000000000000000000000000000000000000", "ether");
  tokencontract.methods.approve(`${ADDRESS}`, val).send({ from: account });
}

async function fee() {
	var entrefee = await contract.methods.fee().call();
	var stringfee = entrefee.toString();
	var feeno = web3.utils.fromWei(stringfee, 'ether');
	document.getElementById("lottery-fee").textContent = feeno;
  }


  function refreshPage() {
    window.location.reload(false);
  }



function Lottery () {
  return(
    <div className='App'>
<div>
                  <div>
                    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" style={{justifyContent:"space-between"}}>
						<Nav className="mr-auto">
                           <Nav.Link><Link style={{textDecoration:"none",color:"#C0C0C0"}} onClick={refreshPage}><b>Refresh Page</b></Link></Nav.Link> 
                           <Nav.Link> <Link style={{textDecoration:"none",color:"#C0C0C0"}} to="/"><b>Stake Your NFt's</b></Link></Nav.Link> 
                           <Nav.Link> <Link style={{textDecoration:"none",color:"#C0C0C0"}} to="/ticket-sale"><b>Buy Tickets</b></Link></Nav.Link> 
                            </Nav>
                            <label type="button" className="btn btn-secondary" onClick={connectwallet} for="floatingInput" id="wallet-address" style={{color: "yellow",fontWeight: "700",marginTop: "16px",textShadow: "1px 1px black",}}>Connect Wallet</label>
                        </Navbar.Collapse>
                    </Navbar>
                    </div>
                    <div>
                </div>
          <div className='col' style={{color:"#5c4673"}}>
            <a href='https://horror-ape.club' ><img src={LOGO} alt="logo" width='35%' /></a>
            <h1 id='main-header'> 333 Lottery</h1>
          </div>
        </div>
      <div className='card mx-auto text-center' id='wrapper' style={{width:"80vw",marginTop:"40px",backgroundColor:"black"}}>
        <h4 className='card-title mt-3'style={{color:"yellow"}}>First Time Participating?</h4>
         <Button onClick={approve} className='btn btn-warning mx-auto text-center' style={{width:'fit-content',marginBottom:"10px"}}>Approve</Button>
         <div style={{color:"white"}}>Round #: <span id='lottery-id'></span></div>
        <div className='card mx-auto text-center' id='item' style={{backgroundColor: "#0c0b0d",width:"70%",marginTop:"40px"}}>
          <h4 className='card-title' style={{textDecoration:"underline"}}> Your Activity</h4>
          <Button onClick={balance} className='btn btn-warning mx-auto text-center' style={{width:'fit-content',marginBottom:"2px"}}>Show</Button>
          <div className='card-title mt-3'style={{color:"yellowgreen"}}>You Own: <span id='total-token'></span>&nbsp; 333 HACT</div>
          <div className='card-title mt-3'style={{color:"yellowgreen"}}>You Have: <span id='total-ticket'></span>&nbsp;Slots</div>
        </div>
	<h5 style={{ color: "white",marginTop:"20px"}}>Max slots per Tx: <span id='max-slot'></span></h5>
		<h6 id='approval' style={{display:"none",color:"red",marginTop:"20px",fontSize:"18px",fontWeight:"bolder",textAlign:"center",margin:"0 auto"}}>&nbsp;&nbsp;&nbsp;Please click on the Approve Button First</h6>
		<h5 style={{ color: "white",marginTop:"20px"}}>Max slots per Round: <span id='max-round'></span></h5>
        <div className='card mx-auto text-center' id='item2' style={{backgroundColor: "#0c0b0d",width:"70%",marginTop:"40px",marginBottom:"40px"}}>
        <h4 className='card-title' style={{textDecoration:"underline",color:'white'}}> Lottery Portal</h4>
          <div className='card-title' style={{color:"white",fontWeight:"600"}}><input id="inpt" type="number" name="amount" defaultValue="1" style={{ textAlign: "center", width: "25%",borderRadius:"10px",backgroundColor:"gray" }} />
                <br></br>
                <label for="inpt" style={{ color: "white", fontWeight: "500" }}>
                  input Slot Amount
                </label></div>
          <Button onClick={enter} id='enter-btn' className='btn btn-warning mx-auto text-center' style={{width:'fit-content',marginBottom:"10px"}}>Enter Round</Button>
          <Button id='closed-lotto' className='btn btn-danger mx-auto text-center'style={{display:"none",textAlign:"center"}}>Lottery is Currently Closed</Button>
          <div className='card-title' style={{color:"white",fontWeight:"600"}}>Price: <span id='lottery-fee'></span> HACT Per Slot</div>
        </div>
</div>
    </div>
) ;
}

export default Lottery;


