'use server'

import base64url from "base64url";


export async function getChallenge() {
    return "aaaaaaaaaaaaaaaaaaaaaa"
}

export async function registerFIDO(json) {
    const certification = JSON.parse(json);
    console.log(`clientDataJSON:${base64url.decode(certification.response.clientDataJSON)}`);
    console.log(`publicKey:${base64url.decode(certification.response.publicKey)}`);
}
