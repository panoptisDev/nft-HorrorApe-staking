import './App.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useEffect, useState } from 'react'
import 'sf-font';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import axios from 'axios';
import ABI from './ABI.json'
import VAULTABI from './VAULTABI.json';
import truncateEthAddress from 'truncate-eth-address';
import { NFTCONTRACT, STAKINGCONTRACT, moralisapi, nftpng } from './config';
import { Navbar,Nav,NavDropdown,Form,FormControl } from 'react-bootstrap'
import { Link } from 'react-router-dom';

var web3 = null;
var account = null;
var vaultcontract = null;
var contract =  null;

const moralisapikey = "2VBV4vaCLiuGu6Vu7epXKlFItGe3jSPON8WV4CrXKYaNBEazEUrf1xwHxbrIo1oM";

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


export default function NFT() {
  const [apicall, getNfts] = useState([])
  const [nftstk, getStk] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
  }, [])

  async function callApi() {
    var provider = await web3Modal.connect();
    web3 = new Web3(provider);
    var accounts = await web3.eth.getAccounts();
    account = accounts[0];
    var finalAccount = `${truncateEthAddress(account)}`
    document.getElementById('wallet-address').textContent = finalAccount;
    contract = new web3.eth.Contract(ABI, NFTCONTRACT);
    vaultcontract = new web3.eth.Contract(VAULTABI, STAKINGCONTRACT);
    var approval = await contract.methods.isApprovedForAll(account,STAKINGCONTRACT).call();
    rewardinfo();
    if(approval == false) {
      document.getElementById("approval").style.display = "flex";}
      else{document.getElementById("approval").style.display = "none";}
		let config = {'X-API-Key': moralisapikey, 'accept': 'application/json'};
		const nfts = await axios.get((moralisapi + `${account}/nft/0xAFc7647b584730694B9606511F11F423A0816eFf?chain=bsc&format=decimal`), {headers: config})
    .then(output => {
        const { result } = output.data
        return result;
      })
    const apicall = await Promise.all(nfts.map(async i => {
      let item = {
        tokenId: i.token_id,
        holder: i.owner_of,
        wallet: account,
      }
      return item
    }))
    const stakednfts = await vaultcontract.methods.tokensOfOwner(account).call()
    .then(id => {
      return id;
    })
    const nftstk = await Promise.all(stakednfts.map(async i => {
      let stkid = {
        tokenId: i,
      }
      return stkid
    }))
      getNfts(apicall)
      getStk(nftstk)
      console.log(apicall);
      setLoadingState('loaded');
      var getstakednfts = await vaultcontract.methods.totalStaked().call();
      document.getElementById('total-staked').textContent = getstakednfts;
      var getbalance = Number(await vaultcontract.methods.balanceOf(account).call());
      document.getElementById('my-staked').textContent = getbalance;
      var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
      const arraynft = Array.from(rawnfts.map(Number));
      const tokenid = arraynft.filter(Number);
      var rwdArray = [];
      tokenid.forEach(async (id) => {
        var rawearn = await vaultcontract.methods.earningInfo(account, [id]).call();
        var array = Array.from(rawearn.map(Number));
        array.forEach(async (item) => {
          var earned = String(item).split(",")[0];
          var earnedrwd = Web3.utils.fromWei(earned);
          var rewardx = Number(earnedrwd).toFixed(2);
          var numrwd = Number(rewardx);
          rwdArray.push(numrwd)
        });
      });
      function delay() {
        return new Promise(resolve => setTimeout(resolve, 300));
      }
      async function delayedLog(item) {
        await delay();
        var sum = item.reduce((a, b) => a + b, 0);
        var formatsum = Number(sum).toFixed(2);
        document.getElementById('earned').textContent = formatsum;
      }
      async function processArray(rwdArray) {
        for (const item of rwdArray) {
          await delayedLog(item);
        }
      }
      return processArray([rwdArray]);
    } 

    async function connectwallet() {
        callApi();
       rewardinfo();
      }


      async function rewardinfo() {
        var getstakednfts = await vaultcontract.methods.totalStaked().call();
        document.getElementById('total-staked').textContent = getstakednfts;
        var getbalance = Number(await vaultcontract.methods.balanceOf(account).call());
        document.getElementById('my-staked').textContent = getbalance;
        var approval = await contract.methods.isApprovedForAll(account,STAKINGCONTRACT).call();
        if(approval == false) {
          document.getElementById("approval").style.display = "flex";}
          else{document.getElementById("approval").style.display = "none";}
        var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
        const arraynft = Array.from(rawnfts.map(Number));
        const tokenid = arraynft.filter(Number);
        var rwdArray = [];
        tokenid.forEach(async (id) => {
          var rawearn = await vaultcontract.methods.earningInfo(account, [id]).call();
          var array = Array.from(rawearn.map(Number));
          array.forEach(async (item) => {
            var earned = String(item).split(",")[0];
            var earnedrwd = Web3.utils.fromWei(earned, 'ether');
            var rewardx = Number(earnedrwd).toFixed(2);
            var numrwd = Number(rewardx);
            rwdArray.push(numrwd)
          });
        });
        function delay() {
          return new Promise(resolve => setTimeout(resolve, 300));
        }
        async function delayedLog(item) {
          await delay();
          var sum = item.reduce((a, b) => a + b, 0);
          var formatsum = Number(sum).toFixed(2);
          document.getElementById('earned').textContent = formatsum;
        }
        async function processArray(rwdArray) {
          for (const item of rwdArray) {
            await delayedLog(item);
          }
        }
        return processArray([rwdArray]);
        
      }
  
    async function enable() {
      contract.methods.setApprovalForAll(STAKINGCONTRACT, true).send({from:account});
    }


    async function claimit() {
      var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
      const arraynft = Array.from(rawnfts.map(Number));
      const tokenid = arraynft.filter(Number);
            await vaultcontract.methods.claim(tokenid).send({from: account})
    }
    async function stakeall() {
      var approval = await contract.methods.isApprovedForAll(account,STAKINGCONTRACT).call();
      console.log(approval)
      if(approval == false) {
        enable();
      }
      else {
        const tokenId = await contract.methods.walletOfOwner(account).call();
            await vaultcontract.methods.stake(tokenId).send({from:account});
           }
          let myInterval = setInterval(callApi(),20000);
           clearInterval(myInterval);
    }

    async function unstakeall() {
      var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
      const arraynft = Array.from(rawnfts.map(Number));
      const tokenid = arraynft.filter(Number);
      await vaultcontract.methods.unstake(tokenid).send({from: account })
      let myInterval = setInterval(callApi(),20000);
      clearInterval(myInterval);
    }

  const refreshNft = ()=>{
    callApi();  
  }

  function refreshPage() {
    window.location.reload(false);
  }

    return(
      <div className='App'>
        <div>
                  <div>
                    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" style={{justifyContent:"space-between"}}>
                            <Nav className="mr-auto">
                           <Nav.Link><Link style={{textDecoration:"none",color:"#C0C0C0"}} onClick={refreshPage}><b>Refresh Page</b></Link></Nav.Link> 
                           <Nav.Link> <Link style={{textDecoration:"none",color:"#C0C0C0"}} to="/lottery"><b>Enter Round</b></Link></Nav.Link> 
                           <Nav.Link> <Link style={{textDecoration:"none",color:"#C0C0C0"}} to="/ticket-sale"><b>Buy Tickets</b></Link></Nav.Link> 
                            </Nav>
                            <label type="button" className="btn btn-secondary" onClick={callApi} for="floatingInput" id="wallet-address" style={{color: "yellow",fontWeight: "700",marginTop: "16px",textShadow: "1px 1px black",}}>Connect Wallet</label>
                        </Navbar.Collapse>
                    </Navbar>
                    </div>
                    <div>
                </div>
          <div className='col' style={{color:"#5c4673"}}>
          <a href='https://horror-ape.club' ><img src='./logo3333.png' alt="logo" width='35%' /></a>
          </div>
        </div>
        <div className='card mx-auto text-center' id='wrapper' style={{width:"80vw",marginTop:"40px",backgroundColor:"black"}}>
          <h2 className='card-title mt-3'style={{color:"yellow"}}>Total NFT's Staked: <br /> <span style={{color:"yellowgreen"}} id='total-staked'></span></h2>
          <div className='card mx-auto text-center' id='item' style={{backgroundColor: "#0c0b0d",width:"70%",marginTop:"40px"}}>
            <h4 className='card-title' style={{textDecoration:"underline"}}> Your Activity</h4>
            <Button onClick={rewardinfo} className='btn btn-warning mx-auto text-center' style={{width:'fit-content',marginBottom:"2px"}}>Show</Button>
            <div className='card-title mt-3'style={{color:"yellow"}}>NFTs Staked: <span style={{color:"yellowgreen"}}  id='my-staked'></span></div>
            <div className='card-title mt-3'style={{color:"yellow"}}>Unclaimed Rewards: <span style={{color:"yellowgreen"}}  id='earned'></span></div>
          </div>

          <h6 id='approval' style={{display:"none",color:"red",marginTop:"30px",fontSize:"15px",fontWeight:"bolder",textAlign:"center"}}>&nbsp;&nbsp;&nbsp;Please click the stake button to approve</h6>
  
          <div className='card mx-auto text-center' id='item2' style={{backgroundColor: "#0c0b0d",width:"70%",marginTop:"40px",marginBottom:"40px"}}>
          <h4 className='card-title' style={{textDecoration:"underline",color:'white'}}> Staking Portal</h4>
            <div className='card-title' style={{color:"white",fontWeight:"400"}}>Stake All:&nbsp;&nbsp;<span>
            <Button onClick={stakeall}  className='btn btn-warning mx-auto text-center' style={{width:'fit-content',marginBottom:"10px"}}>Stake</Button></span></div>
            <div className='card-title' style={{color:"white",fontWeight:"400"}}>Claim Rewards:&nbsp;&nbsp;<span>
            <Button  onClick={claimit}  className='btn btn-warning mx-auto text-center' style={{width:'fit-content',marginBottom:"10px"}}>Claim</Button></span></div>
            <div className='card-title' style={{color:"white",fontWeight:"400"}}>Unstake All:&nbsp;&nbsp;<span>
            <Button  onClick={unstakeall} className='btn btn-warning mx-auto text-center' style={{width:'fit-content',marginBottom:"10px"}}>Unstake</Button></span></div>
          </div>
        </div>
        <div className='card mx-auto text-center mb-3' style={{backgroundColor:"#5c4673",width:"80%"}}></div>
        <div className='col'><h1 style={{color:"yellow",textDecoration:"underline"}} >YOUR NFT'S</h1></div>
        <Button className='btn btn-warning'  onClick={refreshNft}>Refresh</Button>
        <div className='nftportal mb-4'>
            <div className="container col-lg-11">
              <div className="row items px-3 pt-3">
                <div className=" ml-3 mr-3 nft-direction" style={{ gridTemplateColumns: "repeat(4, 5fr)", columnGap: "20px" }}>
                  {apicall.map((nft, i) => {
                    var owner = nft.wallet.toLowerCase();
                      if (owner.indexOf(nft.holder) !== -1) {
                    async function stakeit() {
                      vaultcontract.methods.stake([nft.tokenId]).send({ from: account });
                     let myInterval = setInterval(callApi(),20000);
                        clearInterval(myInterval);
                    }
                    return (
                      <div className="card nft-card mt-3 mb-3" key={i} >
                        <div className="image-over">
                          <img className="card-img-top" src={nftpng + nft.tokenId + '.png'} alt="" />
                        </div>
                        <div className="card-caption col-12 p-0">
                          <div className="card-body" >
                            <h5 className="mb-0">HAC 3333 NFT Collection #{nft.tokenId}</h5>
                            <h5 className="mb-0 mt-2">STATUS:<p style={{ color: "#39FF14", fontWeight: "bold", textShadow: "1px 1px 2px #000000" }}>Ready to Stake</p></h5>
                            <div className="card-bottom d-flex justify-content-between">
                              <input key={i} type="hidden" id='stakeid' value={nft.tokenId} />
                              <Button className='btn btn-warning mx-auto text-center' onClick={stakeit}>Stake it</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}})}
                    {nftstk.map((nft, i) => {
                      async function unstakeit() {
                        vaultcontract.methods.unstake([nft.tokenId]).send({ from: account });
                       let myInterval = setInterval(callApi(),20000);
                        clearInterval(myInterval);
                      }
                      return (
                        <div>
                        
                        <div className="card stakedcard mt-3 mb-3" key={i} >
                          <div className="image-over">
                            <img className="card-img-top" src={nftpng + nft.tokenId + '.png'} alt="image" />
                          </div>
                          <div className="card-caption col-12 p-0">
                            <div className="card-body">
                              <h5 className="mb-0">HAC 3333 NFT Collection #{nft.tokenId}</h5>
                              <h5 className="mb-0 mt-2">STATUS:<p style={{ color: "#15F4EE", fontWeight: "bold", textShadow: "1px 1px 2px #000000" }}>Currently Staked</p></h5>
                              <div className="card-bottom d-flex justify-content-between">
                                <input key={i} type="hidden" id='stakeid' value={nft.tokenId} />
                                <Button className='btn btn-warning mx-auto text-center' onClick={unstakeit}>Unstake it</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                      )})}
                </div>
              </div>
            </div>
            </div>
      </div>
  )
    }
    