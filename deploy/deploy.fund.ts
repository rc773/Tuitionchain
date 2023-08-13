import { Sch } from './src/contracts/sch'
import {
    bsv,
    TestWallet,
    DefaultProvider,
    sha256,
    toByteString,
} from 'scrypt-ts'
import { PubKey,toHex } from 'scrypt-ts'
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
    await Sch.compile()

    // TODO: Adjust the amount of satoshis locked in the smart contract:
    const amount = 10000
    const targetGPA = BigInt(350)
    const oraclePubKey = "3613311451428299106652623126889304806272207160176165432587216040062126055219012914947012585209417815617718474182834590107903881552990965334144548749344578203114636906085659868175091020219892619398254853957854719205537592174923463389754264623607883622175574556862995240817816613730736266580675478093642662966580207224353003883308064625275706394217393636901341288468145408692922831945404623358393363771784811987953775083858829469693850232760072143766451768252509937778115205997994555641418813090811333331268774601001170976568900608837051707856171662678541678179527505578806493462950845158370433349667120279905329125327049966422735203672648088000281875655449149018129714940415041452093925570891873556970177034522032383648914047009623636923647396300986906435648540785762829617476711234655198909324525813321295945503106902942938623861400625994973735751568036798389701386702491785673596529002725990481185359416773920087477887713101n"
    const scolarshipAmout = "1n"
    const universityPubKey = "n4G9Cr9ZeQcLssDMFrYX22fP1qNWnJ52uV"

    const instance = new Sch(
        amount,
        targetGPA,
        oraclePubKey,
        PubKey(toHex(universityPubKey)),
        scolarshipAmout,
    )
    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)
    console.log(`Sch contract deployed: ${deployTx.id}`)
}

main()
