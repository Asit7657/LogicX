let isSpeaking = false;
const status = document.getElementById('status');
const conversation = document.getElementById('conversation');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const volumeControl = document.getElementById('volume');
const voiceLanguage = document.getElementById('voiceLanguage');

// Add messages to conversation window
function addMessage(sender, text, isCode = false) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  if (isCode) {
    msg.innerHTML = `<pre><code>${text}</code></pre>
                     <button class="explain-btn" onclick="explainCode(this)">Explain Code</button>`;
  } else {
    msg.textContent = text;
  }

  conversation.appendChild(msg);
  conversation.scrollTop = conversation.scrollHeight;
}

// Simple code explanations
function explainCode(button) {
  const codeBlock = button.previousElementSibling.textContent;
  const explanation = `This code performs the operation: ${codeBlock.split("\\n")[0]}`;
  addMessage('assistant', explanation);
  speak(explanation);
}

// Speech synthesis
function speak(text) {
  if (isSpeaking) return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voiceLanguage.value;
  utterance.volume = parseFloat(volumeControl.value);
  isSpeaking = true;
  speechSynthesis.speak(utterance);
  
  playBtn.disabled = true;
  stopBtn.disabled = false;
  status.textContent = "Speaking...";

  utterance.onend = function() {
    isSpeaking = false;
    stopBtn.disabled = true;
    playBtn.disabled = false;
    status.textContent = "Ready for your next question";
  };
}

stopBtn.onclick = () => {
  speechSynthesis.cancel();
  isSpeaking = false;
  stopBtn.disabled = true;
  playBtn.disabled = false;
  status.textContent = "Speech stopped";
};

// Predefined logic responses
function processQuery(query) {
  addMessage('user', query);
  
  let response = "";
  let isCode = false;

  if (query.toLowerCase().includes("reverse")) {
    response = `def reverse_string(s):\n    return s[::-1]\n\nprint(reverse_string("LogicX"))`;
    isCode = true;
  } else if (query.toLowerCase().includes("fibonacci")) {
    response = `def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a, end=" ")\n        a, b = b, a+b\n\nfibonacci(10)`;
    isCode = true;
  } else if (query.toLowerCase().includes("sort")) {
    response = `arr = [5, 2, 9, 1, 7]\narr.sort()\nprint(arr)`;
    isCode = true;
  } else if (query.toLowerCase().includes("binary search")) {
    response = `def binary_search(arr, x):\n    low, high = 0, len(arr)-1\n    while low <= high:\n        mid = (low+high)//2\n        if arr[mid] == x:\n            return mid\n        elif arr[mid] < x:\n            low = mid+1\n        else:\n            high = mid-1\n    return -1\n\nprint(binary_search([1,3,5,7,9], 5))`;
    isCode = true;
  } else {
    response = "I'm still learning. Try reverse string, Fibonacci, sorting, or binary search.";
  }

  addMessage('assistant', response, isCode);
  speak(response);
}
S