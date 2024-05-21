// Initialize variables
let audioContext = null;
let analyser = null;
let microphoneStream = null;
let currentNote = '';
let isGameActive = false;

// Function to start the game
async function startGame() {
    if (!isGameActive) {
        isGameActive = true;
        document.getElementById('startButton').disabled = true;
        document.getElementById('feedback').textContent = '';

        // Initialize audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();

        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneStream = audioContext.createMediaStreamSource(stream);
        microphoneStream.connect(analyser);

        // Start analyzing
        setInterval(checkNote, 1000);
    }
}

// Function to check if the correct note is played
function checkNote() {
    if (currentNote === '') {
        // Generate a random note
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        currentNote = notes[Math.floor(Math.random() * notes.length)];

        // Display the note
        const noteDisplay = document.getElementById('noteDisplay');
        noteDisplay.textContent = `Play Note: ${currentNote}`;
    } else {
        // Analyze the pitch
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
        const pitch = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

        // Map pitch to musical notes
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteIndex = Math.floor((pitch / 255) * notes.length);
        const detectedNote = notes[noteIndex];

        // Display feedback
        const feedback = document.getElementById('feedback');
        if (detectedNote === currentNote) {
            feedback.textContent = 'Correct! Next note:';
            currentNote = ''; // Reset current note
        } else {
            feedback.textContent = 'Try again...';
        }
    }
}

// Event listener for the start button
document.getElementById('startButton').addEventListener('click', startGame);


