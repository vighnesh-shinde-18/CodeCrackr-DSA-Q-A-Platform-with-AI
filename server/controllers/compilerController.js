// controllers/codeRunnerController.js
const axios = require("axios");
const dotenv = require("dotenv");


const JUDGE0_API = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = process.env.JUDGE0_KEY; // Store in .env

dotenv.config()
// Map of supported languages and their Judge0 IDs
const languageMap = {
    "c-gcc-14": 103,
    "cpp-gcc-14": 105,
    "csharp": 51,
    "java-17": 91,
    "go-1.23": 107,
    "javascript-22": 102,
    "php-8": 98,
    "python-3.13": 109,
    "ruby": 72,
    "rust-1.85": 108,
    "sql": 82,
    "swift": 83,
    "typescript-5.6": 101,
};


exports.runCode = async (req, res) => {
    try {
        console.log(1)
        const { language, sourceCode, input } = req.body;

        console.log(3)
        if (!languageMap[language]) {
            console.log(3)
            return res.status(400).json({ error: "Language not supported" });
        }
        console.log(4)

        // Prepare submission data
        const submissionData = {
            source_code: sourceCode,
            language_id: languageMap[language],
            stdin: input || "" // Default to empty if not provided
        };
        console.log(5)

        // Create submission request to Judge0
        const submission = await axios.post(
            `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
            submissionData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": JUDGE0_KEY,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
                }
            }
        );
        console.log(6)

        const result = submission.data;

        console.log(7)
        // Send back clean response to frontend
        res.json({
            output: result.stdout,
            error: result.stderr,
            compileOutput: result.compile_output,
            status: result.status ? result.status.description : null
        });
        console.log(8)
    } catch (error) {
        console.log(9)
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Error running code" });
    }
};
