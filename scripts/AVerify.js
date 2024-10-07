const { readFileSync } = require('fs');
const { verify } = require('crypto');
const path = require('path');
const { Buffer } = require('buffer');

// Adresse de portefeuille à encoder
const wallet = '0xblablabla'; // Remplacer par l'adresse du portefeuille du vérificateur

// Encodage en Base64 de l'adresse du portefeuille
const encodedWallet = Buffer.from(wallet).toString('base64');

// Charger la clé publique
const publicKey = readFileSync('public_key.pem', 'utf8');

// Remplacer par le texte du message à vérifier
const message = "Voici un message "; // Modifier le message ici

// Spécifier le fichier de signature à vérifier
const signatureFileName = 'signature_0.base64'; // Modifier avec le fichier de signature correspondant
const signatureBase64 = readFileSync(path.join('signatures', signatureFileName), 'utf8');
const signature = Buffer.from(signatureBase64, 'base64');

// Vérification de la signature
const isVerified = verify("sha256", Buffer.from(message), {
    key: publicKey,
}, signature);

// Affichage du résultat de la vérification, du fichier de signature, et de la date/heure
console.log(`Signature file "${signatureFileName}" is :`, isVerified, 'on', new Date().toLocaleString());
console.log('W :', encodedWallet);
