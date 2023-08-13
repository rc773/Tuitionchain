import { Pay } from './src/contracts/Pay'
import { PubKey,toHex } from 'scrypt-ts';

import {
    bsv,
    TestWallet,
    DefaultProvider,
    Ripemd160,
    sha256,
    toByteString,
} from 'scrypt-ts'

import * as dotenv from 'dotenv'

// Load the .env file
dotenv.config()

// Read the private key from the .env file.
// The default private key inside the .env file is meant to be used for the Bitcoin testnet.
// See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
const privateKey = bsv.PrivateKey.fromWIF(process.env.PRIVATE_KEY || '')

// Prepare signer.
// See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
const signer = new TestWallet(
    privateKey,
    new DefaultProvider({
        network: bsv.Networks.testnet,
    })
)

async function main() {
    await Pay.compile()

    // TODO: Adjust the amount of satoshis locked in the smart contract:
    const amount = 10000000
    const withdrawIntervals = 10000n
    const withdrawAmount = 300000n
    const creatorPkh = "mvedcKA1zU9c8jQFquWMWeXY5xrGjuWHgk" //"creator(student)'s public key hash here"
    const universityPKH = "n4G9Cr9ZeQcLssDMFrYX22fP1qNWnJ52uV" //"University's public key hash here"
    const lastWithdrawTimestamp = 222n 
    // const lastWithdrawTimestamp = "2023-07-23 10:44:46"//"Timestamp here"

  // TODO: Adjust constructor parameter values:
    const instance = new Pay(
        withdrawIntervals,
        withdrawAmount,
        lastWithdrawTimestamp,
        PubKey(toHex(creatorPkh)),
        PubKey(toHex(universityPKH))


    )

    // Connect to a signer.
  
main()

    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)
    console.log(`Pay contract deployed: ${deployTx.id}`)
}

main()
