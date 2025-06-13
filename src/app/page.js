'use client'
import { getChallenge, registerFIDO } from "./fido";
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

export default function Home() {
  const initRegister = async () => {
    const challenge = await getChallenge();
    console.log(base64url.encode(challenge));
    // The publicKey.challenge property in navigator.credentials.create()
    // expects an ArrayBuffer. Assuming `getChallenge()` returns an
    // ArrayBufferView (e.g., Uint8Array), we use `.buffer` to get the
    // underlying ArrayBuffer.
    const publicKeyCredential = await navigator.credentials.create({
      publicKey: {
        challenge: convertString2UInt8Array(challenge),
        rp: {
          name: "Fido",
          id: "localhost"
        },
        user: {
          name: "test",
          id: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
          displayName: "test"
        },
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7
          }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform"
        },
        attestation: "direct"
      }
    });
    console.log(JSON.stringify(publicKeyCredential));
    registerFIDO(JSON.stringify(publicKeyCredential));
  }

  const getCredential = async () => {
    const challenge = await getChallenge();
    const assertion = await navigator.credentials.get({
      challenge: convertString2UInt8Array(challenge),
      userVerification: "preferred",
      rpId: "localhost"
    })
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => initRegister()}>Init Certification</button>
      <h/>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => getCredential()}>Authorization</button>
    </div>
  );
}
