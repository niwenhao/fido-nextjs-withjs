'use client'
import { credentail, getChallenge, registerFIDO } from "./fido";
const base64url = require('base64url');

function convertString2UInt8Array(str) {
  const encodedStr = base64url.encode(str)
  const buf = new ArrayBuffer(encodedStr.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = encodedStr.length; i < strLen; i++) {
    bufView[i] = encodedStr.charCodeAt(i);
  }
  return bufView;
}

const fidoId = base64url.toBuffer(base64url.encode('0e10af4a-3fff-4662-94de-f74d48561fda'))
const fidoName = 'TestFIDO';
const challenge1 = base64url.toBuffer(base64url.encode('98f08119-ce9c-4e60-bd58-69a95ad01368'))
const challenge2 = base64url.toBuffer(base64url.encode('7c753aba-4c3c-431f-a158-5be4635c1191'))
var credentialId = "";

const publicKeyCredentialCreationOptions = {
  challenge: challenge1,
  rp: { name: "Example Corp" },
  user: {
    id: fidoId,
    name: "user@example.com",
    displayName: "User Example",
  },
  pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256
  authenticatorSelection: {
    userVerification: "preferred"
  },
  timeout: 60000,
  attestation: "direct"
};


export default function Home() {
  const initRegister = async () => {

    const publicKeyCredential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    });
    credentialId = publicKeyCredential.rawId;
    console.log(`credentialId:${credentialId}`);
    console.log(JSON.stringify(publicKeyCredential));
    registerFIDO(JSON.stringify(publicKeyCredential));
  }

  const getCredential = async () => {
    console.log(base64url.encode(credentialId));
    const assertion = await navigator.credentials.get({
      challenge: challenge2,
      timeout: 120000,
      userVerification: "preferred",
      allowCredentials: [
        {
          id: credentialId,
          type: "public-key"
        }
      ]
    });
    credentail(JSON.stringify(assertion));
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => initRegister()}>Init Certification</button>
      <h/>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => getCredential()}>Authorization</button>
    </div>
  );
}
