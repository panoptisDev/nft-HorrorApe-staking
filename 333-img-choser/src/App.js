import logo from './logo.svg';
import './App.css';
import { Container, Input, Button, Grid, Card, Switch, Text } from '@nextui-org/react';
import { useState, useRef } from 'react'
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import truncateEthAddress from 'truncate-eth-address';
import axios from 'axios';
import ABI from './ABI.json'
import IMAGEABI from './IMAGEABI.json'
import { NFTCONTRACT, IMAGECONTRACT, moralisapikey, moralisapi } from './config'
import { Nft } from './Nft'

var web3 = null;
var account = null;
var contract = null;
var imageContract = null;


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


function App() {
  const [ selected, setSelected ] = useState(true)
  const [nftstk, getStk] = useState([])
  const [fresh, setFresh] = useState([])
  const inputRef = useRef();

  async function callApi() {
    var provider = await web3Modal.connect();
    web3 = new Web3(provider);
    var accounts = await web3.eth.getAccounts();
    account = accounts[0];
    var finalAccount = `${truncateEthAddress(account)}`
    document.getElementById('wallet-address').textContent = finalAccount;
    contract = new web3.eth.Contract(ABI, NFTCONTRACT);
    imageContract = new web3.eth.Contract(IMAGEABI, IMAGECONTRACT);
    let config = {'X-API-Key': moralisapikey, 'accept': 'application/json'};
   const nfts = await axios.get((moralisapi + `${account}/nft/${NFTCONTRACT}?chain=bsc&format=decimal`), {headers: config})
   .then(output => {
      const { result } = output.data
      return result;
    })
    const unstkuriarr = [];
     await Promise.all(nfts.map(async i => {
    let item = {
      tokenId: i.token_id,
      holder: i.owner_of,
    }
    const nftunstkURI = await contract.methods.tokenURI(item.tokenId).call()
    let fetchstkRes = await fetch(nftunstkURI).then(res => res.json()).then((d) =>  { let cleanUri = d.image.replace("ipfs://","https://ipfs.io/ipfs/"); let nftstkobj = {tokenid: d.id, image:cleanUri};
   unstkuriarr.push(nftstkobj)})
     return fetchstkRes
    }))
    setFresh(unstkuriarr)
    getStk(nftstk)

  }

  async function changeImage() {
    const inpR = inputRef.current.value
    if (selected == true ) {
      if (inpR.length > 1) {
        imageContract.methods.selectVersios( [inpR], 1 ).send({from: account })
      }
      else {
        imageContract.methods.selectVersion( inpR, 1 ).send({from: account })
      }
    }

    else {
          if (inpR.length > 1) {
         imageContract.methods.selectVersios( [inpR], 0 ).send({from: account })
       }
         else {
         imageContract.methods.selectVersion( inpR, 0 ).send({from: account })
      }
    }

  }


  return (
<Container css={{
  ta:"center",
}}>
  <Container css={{
    dflex:"center",
    mt:"$15",
  }}>
      <Button id='wallet-address' auto color="warning" style={{color:"black"}} onClick={callApi} >Connect Wallet</Button>
  </Container>
  <Container css={{
    dflex:"center",
    mt:"$8",
  }}>
      <Button auto color="warning" onClick={callApi} style={{color:"black"}} >Refresh NFTs</Button>
  </Container>
  <Text h6 size={18} color="warning" css={{ mt: "$5", dflex:"center",tdl:"underline" }}>
    Tutorial:
    </Text>
  <Text h6 size={16} color="warning" css={{ mt: "$1", dflex:"center", }}>
  Step 1: Connect Your Wallet.<br /> Step 2: Input Your NFT(s) Token ID | Separate Multiple NFT's with commas. (example: 1,2,3,4,5) <br /> Step 3: Click "Swap To Alt" & Approve the Transaction; Wait a moment, Then Refresh The Page to view your NFT alt. <br />  Step 3.5: Click "Swap To Original" to Swap back to the original image & metadata if you choose to. 
  </Text>

  <Input  bordered status='warning' labelPlaceholder="tokenId(s)" ref={inputRef} css={{
    mt:"$10"
  }} />
    <Container css={{
    dflex:"center",
    mt:"$15",
  }}>
{selected ? <Button auto color="warning" style={{color:"black", marginRight:"20px"}} onClick={changeImage}>
    Swap to Alt
  </Button>
  :
  <Button auto color="warning" style={{color:"black", marginRight:"20px"}} onClick={changeImage}>
    Swap to Original
  </Button>
  }
  <Switch color="warning" checked={true} size="xs" onChange={() => setSelected(!selected)} />
  </Container>
  <Text h3 size={38} color="warning" css={{ mt: "$10", dflex:"center", tdl:"underline"}}>
    Your NFTs
  </Text>
        <Grid.Container gap={2} justify="center" css={{ mt: "$10" }}>
  {fresh.map((nft, i) => {
     return <Nft key={i} image={nft.image} tokenId={nft.tokenid} />
  })}
</Grid.Container>

</Container>
  );
}

export default App;
