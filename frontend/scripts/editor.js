var previousChat,
  userCode,
  mode = "python",
  selectedLanguage="python",
  codeMirrorInstance;
var codeMirrorInstance = CodeMirror(document.querySelector("#code"), {
  lineNumbers: true,
  tabSize: 4,
  value: "",
  mode: mode,
});
function selectLanguageFunction() {
  selectedLanguage = document.getElementById("selectLanguage").value;
  switch (selectedLanguage) {
    case "python":
      mode = "python";
      break;
    case "java":
      mode = "text/x-java";
      break;
    case "javascript":
      mode = "javascript";
      break;
    default:
      mode = "python";
  }
  document.getElementById("code").textContent = "";
  codeMirrorInstance = CodeMirror(document.querySelector("#code"), {
    lineNumbers: true,
    tabSize: 4,
    value: "",
    mode: mode,
  });
}
var run_btn = document.getElementById("run_btn");
run_btn.addEventListener(
  "click",
  function (event) {
    event.preventDefault();
    run();
  },
  false
);
function run() {
  var text = codeMirrorInstance.getValue();
  if (text === "") return;
  userCode = text;
  var user_input = document.getElementById("user_input").value;
  var loadingGif = document.getElementById("loadingGif");
  var run_btn = document.getElementById("run_btn");
  loadingGif.className = "loadingGif";
  run_btn.className = "displayNone";
  var corrected_code = document.getElementById("corrected_code");
  var correctCodeDiv = document.getElementById("correctCodeDiv");
  // fetch('https://codeguardian.vercel.app/compile', {
  fetch("http://127.0.0.1:5000/compile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: text,
      user_input: user_input,
      language: selectedLanguage,
    }),
  })
    .then((response) => response.json())
    .then((outputData) => {
      if (outputData.corrected_code !== undefined) {
        correctCodeDiv.className = "";
        // console.log(outputData.corrected_code)
        document.getElementById("corrected_code").textContent = "";
        CodeMirror(document.querySelector("#corrected_code"), {
          lineNumbers: true,
          tabSize: 4,
          value: outputData.corrected_code,
          mode: mode,
        });
      } else {
        correctCodeDiv.className = "display_none";
      }
      if (outputData.suggestion !== undefined) {
        var suggestions = outputData.suggestion.replace(/\n/g, "<br>");
        var suggestionMessageDiv = document.getElementById(
          "suggestionMessageDiv"
        );
        document.getElementById("suggestionDiv").className = "";
        suggestionMessageDiv.innerHTML = suggestions;
        previousChat = outputData.completeResponse;
      }
      loadingGif.className = "displayNone";
      run_btn.className = "run_btn";
    })
    .catch((error) => {
      console.error("Error:", error);
      loadingGif.className = "displayNone";
      run_btn.className = "run_btn";
    });
}
function continueToChatCOde() {
  var completeChat = { user: userCode, assistant: previousChat };
  localStorage.setItem("PreviousChat", JSON.stringify(completeChat));
  window.location.href = "http://127.0.0.1:5501/frontend/chat.html";
}
