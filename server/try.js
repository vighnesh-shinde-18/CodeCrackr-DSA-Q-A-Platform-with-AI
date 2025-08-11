import fetch from "node-fetch";

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
const API_KEY = "9db300b0a8mshc279794aaec0042p1384ecjsn7ed238228577"; // from RapidAPI

// async function runCode() {
//   const response = await fetch(JUDGE0_URL, {
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//       "X-RapidAPI-Key": API_KEY,
//       "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
//     },
//     body: JSON.stringify({
//       language_id: 71,
//       source_code: 'print(1+1)',
//       stdin: ""
//     })
//   });

//   const result = await response.json();
//   console.log("Output:", result.stdout);
//   console.log("Status:", result.status.description);
// }

// runCode();

// import axios from "axios";

// const options = {
//   method: 'POST',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
//   headers: {
//     'Content-Type': 'application/json',
//     'X-RapidAPI-Key': API_KEY, // Replace with your RapidAPI key
//     'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
//   },
//   data: {
//     language_id: 63, // JavaScript (Node.js 18)
//     source_code: `
//         const fs = require('fs');
//         const input = fs.readFileSync(0, 'utf8').trim().split('\\n');
//         const n = parseInt(input[0]);
//         const arr = input[1].split(' ').map(Number);
//         console.log(arr.reduce((a, b) => a + b, 0));
//     `,
//     stdin: `5\n10 20 30 40 50`
//   }
// };

// axios.request(options)
//   .then(response => {
//     console.log("Output:", response.data.stdout);
//   })
//   .catch(error => {
//     console.error(error);
//   });


async function runCode(sourceCode, languageId, stdin) {
  try {
    // 1️⃣ Submit code
    const submitRes = await fetch(`${JUDGE0_URL}?base64_encoded=false&wait=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin
      }),
    });

    const submitData = await submitRes.json();
    const token = submitData.token;
    console.log(`Submitted! Token: ${token}`);

    // 2️⃣ Poll until done
    let statusId = 1;
    let result;
    while (statusId !== 3 && statusId !== 6) {
      await new Promise(r => setTimeout(r, 1500)); // wait 1.5 sec
      const checkRes = await fetch(`${JUDGE0_URL}/${token}?base64_encoded=false`, {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      });
      result = await checkRes.json();
      statusId = result.status.id;
      console.log(`Status: ${result.status.description}`);
    }

    // 3️⃣ Print output
    console.log("=== Final Result ===");
    console.log("Stdout:", result.stdout);
    console.log("Stderr:", result.stderr);
    console.log("Compile Output:", result.compile_output);
    console.log("Exit Code:", result.exit_code);
  } catch (err) {
    console.error("Error running code:", err);
  }
}

// Example: Python program that takes multiple inputs
const code = `
n = int(input())
arr = list(map(int, input().split()))
print(sum(arr))
`;

const inputData = `5
10 20 30 40 50`;

runCode(code, 71, inputData);
