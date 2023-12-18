var memory = [];
memory.push({
  role: "system",
  content:
    "You are a helpful assistant that assists in fixing software bugs. You just answer the question and don't add any other prompt. If the given prompt contains code which have bugs then, generate the corrected code with code explanation",
});

var previousChatJSON = JSON.parse(localStorage.getItem("PreviousChat"));
// console.log(previousChatJSON[0])
// console.log("previousChatJSON=", previousChatJSON.user[0])
const filenamePattern = /"name":"([^"]+)"/g;
var filenames = "";
let match;
if (previousChatJSON) {
  while ((match = filenamePattern.exec(previousChatJSON.user)) !== null) {
    // filenames.push(match[1]);
    if (filenames.length === 0) filenames += match[1];
    else filenames += ", " + match[1];
  }
// console.log(filenames);
  var isMultipleFiles = false;
  if (previousChatJSON.user[0] === "[") {
    isMultipleFiles = true;
  }
  memory.push({ role: "user", content: previousChatJSON.user });
  memory.push({ role: "assistant", content: previousChatJSON.assistant });
  var initialText = document.getElementById("initialText");
  initialText.className = "displayNone";
  var memoryDiv = document.getElementById("memory");
  memoryDiv.innerHTML = "";
  for (var i = 1; i < memory.length; i++) {
    var entry = memory[i];
    var entryDiv = document.createElement("div");
    var entryContentDiv = document.createElement("div");
    if (isMultipleFiles) {
      entryContentDiv.innerHTML =
        'Files <span style="color:#aaa;">' + filenames + "</span> uploaded";
      isMultipleFiles = false;
    } else {
      entryContentDiv.innerHTML = entry.content;
    }
    entryContentDiv.className = "chatBorder code";
    entryDiv.className = entry.role === "user" ? "chat left" : "chat right";
    entryDiv.appendChild(entryContentDiv);
    memoryDiv.appendChild(entryDiv);
  }
}
localStorage.removeItem("PreviousChat");
// console.log(memory)


function handleFocus() {
  var chatInput = document.getElementById("chatInput");
  if (chatInput.textContent === "Type your message here...") {
    chatInput.textContent = "";
  }
}

function handleBlur() {
  var chatInput = document.getElementById("chatInput");
  if (chatInput.textContent === "") {
    chatInput.textContent = "Type your message here...";
  }
}

function handleKeyDown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chat();
  }
}

function chat() {
  var loadingGif = document.getElementById("loadingGif");
  var sendQuestion = document.getElementById("sendQuestion");
  if (
    loadingGif.className === "loading" ||
    document.getElementById("chatInput").textContent ===
      "Type your message here..." ||
    document.getElementById("chatInput").textContent === ""
  ) {
    return;
  }
  loadingGif.className = "loading";
  sendQuestion.className = "displayNone";
  var initialText = document.getElementById("initialText");
  initialText.className = "displayNone";
  var chatInput = document.getElementById("chatInput");
  // console.log(chatInput.innerHTML)
  // console.log(chatInput.textContent)
  // var codeInput = chatInput.textContent.replace(/\n/g, '<br>');
  var codeInput = chatInput.innerHTML;
  // console.log(codeInput)
  chatInput.textContent = "";
  memory.push({ role: "user", content: codeInput });
  // console.log(memory)
  var memoryDiv = document.getElementById("memory");
  memoryDiv.innerHTML = "";
  for (var i = 1; i < memory.length; i++) {
    var entry = memory[i];
    var entryDiv = document.createElement("div");
    var entryContentDiv = document.createElement("div");
    entryContentDiv.innerHTML = entry.content;
    entryContentDiv.className = "chatBorder code";
    entryDiv.className = entry.role === "user" ? "chat left" : "chat right";
    entryDiv.appendChild(entryContentDiv);
    memoryDiv.appendChild(entryDiv);
  }
  // fetch('https://codeguardian.vercel.app/chat', {
  fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code:previousChatJSON,
      question: codeInput,
    }),
  })
    .then((response) => response.json())
    .then((chatOutput) => {
      var co = chatOutput.chatOutput;
      var chatOp = co.replace(/\n/g, "<br>");
      memory.push({ role: "assistant", content: chatOp });
      var memoryDiv = document.getElementById("memory");
      var entry = memory[memory.length - 1];
      var entryDiv = document.createElement("div");
      var entryContentDiv = document.createElement("div");
      entryContentDiv.innerHTML = entry.content;
      entryContentDiv.className = "chatBorder code";
      entryDiv.appendChild(entryContentDiv);
      entryDiv.className = "chat right";
      memoryDiv.appendChild(entryDiv);
      loadingGif.className = "displayNone";
      sendQuestion.className = "";
    })
    .catch((error) => {
      console.error("Error:", error);
      sendQuestion.className = "";
      loadingGif.className = "displayNone";
    });
  // console.log(memory)
}
