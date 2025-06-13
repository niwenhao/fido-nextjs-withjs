'use server'

const base64url = require('base64url');
const cbor = require('cbor');

export async function getChallenge() {
    return "aaaaaaaaaaaaaaaaaaaaaa"
}

export async function registerFIDO(json) {
    const certification = JSON.parse(json);

    const clientDataJSON = base64url.decode(certification.response.clientDataJSON);
    const clientData = JSON.parse(clientDataJSON);
    console.log(`clientDataJSON:${clientDataJSON}`);
    console.log(`clientDataJSON:challenge:${base64url.decode(clientData.challenge)}`);

    const attestation = certification.response.attestationObject;
    const attestationBuffer = base64url.toBuffer(attestation);
    const attestationObject = cbor.decodeFirstSync(attestationBuffer);
    console.log(`publicKey:${JSON.stringify(attestationObject)}`);
}

export async function credentail(json) {
    const certification = JSON.parse(json);
    console.log(json);
}