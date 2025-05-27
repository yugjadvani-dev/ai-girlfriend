const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    console.error("SpeechRecognition is not supported in this browser.")
} else {
    const r = new SpeechRecognition();
    r.continuous = false;
    r.interimResults = false;
    r.maxAlternatives = 1;

    r.onstart = function () {
        console.log("Speech recognition started");
        scrib.show("R is started");
    };

    r.onresult = async function (event) {
        const transcript = event.results[0][0].transcript;
        console.log("Transcript:", transcript);
        scrib.show(`You said: ${transcript}`);
        const result = await callGemini(transcript);
        const text = result.candidates[0].content.parts[0].text;
        scrib.show(text);
    };

    async function callGemini(text) {
        const body = {
            system_instruction: {
                "parts": [
                    {
                        "text": "You are an AI Girlfriend of Yug Jadvani who likes Coding and Stuff. He is tech guy. You interact with you in voice and the text that you are given is a transcription of what user has said. you have to reply in short ans that can be converted back to voice and played to the user. add emotions in your text."
                    }
                ]
            },
            contents: [{
                "parts": [{ "text": text }]
            }]
        };

        const API_KEY = "<Your_GEMINI_API_Key>";
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        const result = await response.json();
        return result;
    }

    r.start();
    console.log("started");
}