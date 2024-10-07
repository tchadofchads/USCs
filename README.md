# USCs - Message Signature Verification

Welcome to the USCs community ! This guide will show you how to verify messages signed by `amanofchads` using a public key and associated signature files. Follow the steps below to ensure that the messages are indeed from `amanofchads`.

## Prerequisites

- **Node.js** must be installed on your machine. You can download it [here](https://nodejs.org/).
- A dedicated folder on your computer to store the public key, signature files, and the verification script.
 If you're not familiar with navigating through your files, it’s easiest to create a new folder directly on your Desktop.

## Step 1: Download the Files

1. **Public Key** (`public_key.pem`):  Download this file once and place it in the folder you created.
2. **Signature Files** (`signature00.base64`, `signature01.base64`, etc.): Download the signature file corresponding to each message you want to verify.

## Step 2: Verification Script

Download the verification script below, name it `verify.js`, and place it in the same folder as the public key and signature files.

```javascript
const { readFileSync } = require('fs');
const { verify } = require('crypto');

// Load the public key
const publicKey = readFileSync('public_key.pem', 'utf8');

// Replace with the text of the message you want to verify
const message = "The text of the message to verify";

// Replace with the corresponding signature file name
const signatureBase64 = readFileSync('signature01.base64', 'utf8');
const signature = Buffer.from(signatureBase64, 'base64');

// Verify the signature
const isVerified = verify("sha256", Buffer.from(message), {
    key: publicKey,
}, signature);

console.log('The signature is valid:', isVerified, new Date().toLocaleString());
```

## Step 3: Verifying a Message

1. Open the `verify.js` file in a text editor.
2. Replace the content of the `message` variable with the text of the message you want to verify.
3. Replace the signature file name in `signatureBase64` with the one corresponding to the message.
4. Save the changes.
5. In a terminal, navigate to the folder containing the files and run the following command:

```bash
node verify.js
```

6. The terminal will display whether the signature is valid (`true`) or not (`false`).

## Step 4: Adding New Signatures

Whenever `amanofchads` releases a new signed message:
1. Download the corresponding signature file.
2. Follow the verification steps outlined above.

---

# USCs - Message Encryption

Welcome to the USCs encryption section! This guide will show you how to encrypt messages using a public key. Follow the steps below to ensure your messages are secure.

### Prerequisites

- **Node.js** must be installed on your machine. You can download it [here](https://nodejs.org/).
- A dedicated folder on your computer to store the public key and the encryption script. If you're not familiar with navigating through your files, it’s best to create a new folder directly on your desktop.

## Step 1: Download the Files

- **Public Key (public_key.pem)**: Download this file once and place it in the folder you created.

## Step 2: Encryption Script

Download the encryption script below, name it `encrypt.js`, and place it in the same folder as the public key.

```javascript
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { publicEncrypt } = require('crypto');
const path = require('path');
const readline = require('readline');
const zlib = require('zlib');
const { exec } = require('child_process'); // For copying to clipboard

// Load the public key
const publicKey = readFileSync('public_key.pem', 'utf8');

// Create a readline interface for input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to generate a unique file name
const getNextFileName = (basePath) => {
    let index = 1;
    let filePath = path.join(basePath, `encrypted_data_${index}.txt`);
    while (existsSync(filePath)) {
        index++;
        filePath = path.join(basePath, `encrypted_data_${index}.txt`);
    }
    return filePath;
};

// Ask the user to enter their wallet address
rl.question('Please enter your wallet address: ', (wallet) => {
    // Encrypt the wallet address with the public key
    const encryptedWallet = publicEncrypt(publicKey, Buffer.from(wallet));

    // Ask the user to enter a message
    rl.question('Please enter your message to encrypt: ', (message) => {
        console.log('Loading...');

        // Delay of 2 seconds before proceeding to encryption
        setTimeout(() => {
            // Compress the message before encrypting
            const compressedMessage = zlib.deflateSync(Buffer.from(message));

            // Encrypt the compressed message with the public key
            const encryptedMessage = publicEncrypt(publicKey, compressedMessage);

            // Convert the encrypted messages to text format (Base64)
            const encryptedWalletBase64 = encryptedWallet.toString('base64');
            const encryptedMessageBase64 = encryptedMessage.toString('base64');

            // Display results in the console
            console.log('W:', encryptedWalletBase64);
            console.log('M:', encryptedMessageBase64);

            // Save the data in a text file
            const basePath = path.join(__dirname, 'encrypted_messages'); // Folder for messages
            if (!existsSync(basePath)) {
                mkdirSync(basePath); // Create the folder if it doesn't exist
            }
            const filePath = getNextFileName(basePath); // Get a unique file name
            const dataToSave = `W : ${encryptedWalletBase64}\nM : ${encryptedMessageBase64}\n\n`;
            writeFileSync(filePath, dataToSave); // Write the data to the file
            console.log(`Data saved in: ${filePath}`);

            // Function to copy to clipboard
            const copyToClipboard = (data) => {
                let command;
                if (process.platform === 'win32') {
                    command = `echo ${data} | clip`; // For Windows
                } else if (process.platform === 'darwin') {
                    command = `echo ${data} | pbcopy`; // For macOS
                } else {
                    command = `echo "${data}" | xclip -selection clipboard`; // For Linux (with xclip)
                }

                exec(command, (err) => {
                    if (err) {
                        console.error('Error copying to clipboard:', err);
                    } else {
                        console.log('Data copied to clipboard!');
                    }
                });
            };

            // Copy both messages
            copyToClipboard(`W : ${encryptedWalletBase64}`);
            copyToClipboard(`M : ${encryptedMessageBase64}`);

            // Close the readline interface
            rl.close();
        }, 2000); // Delay of 2 seconds
    });
});
```

## Step 3: Encrypting a Message

1. **Open the `encrypt.js` file** in a text editor.
2. **Run the script** using the following command in your terminal:

   ```bash
   node encrypt.js
   ```

3. **Enter your wallet address** when prompted.
4. **Enter the message** you wish to encrypt.
5. After a few seconds, the script will display your wallet address and your encrypted message in Base64 format in the terminal. These values will also be copied to your clipboard.

### Step 4: Saving Encrypted Messages

- The script will create a text file containing the encrypted data (your wallet address and message) in a folder called `encrypted_messages` inside the folder where the script is located.
- The files will be uniquely named (encrypted_data_1.txt, encrypted_data_2.txt, etc.), allowing you to keep a history of your encrypted messages.

## Conclusion

You have successfully encrypted your message! Make sure to keep the public key safe and do not share your encrypted messages with unauthorized persons. For any questions or issues, feel free to reach out to the USCs community.

---
