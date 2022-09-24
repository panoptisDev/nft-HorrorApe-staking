import { Grid, Card, Text, Spacer } from "@nextui-org/react";
import ABI from './ABI.json'
import { NFTCONTRACT, moralisapikey, moralisapi } from './config'
import { useState } from 'react'
import axios from "axios";

export const Nft = ({ image, tokenId }) => {
 

    return (
      <Grid xs={5} sm={12}>
      <Card isHoverable css={{ mw: "400px" }}>
        <Card.Body>
          <Card.Image css={{br:"$2xl"}} src={image} />
          <Spacer />
          <Card.Divider />
          <Text h6 size={15} color="warning" css={{ dflex:"center" }}>
            HAC 333 #{tokenId}
          </Text>
        </Card.Body>
      </Card>
      </Grid>
    );
}