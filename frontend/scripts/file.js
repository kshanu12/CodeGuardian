var selectedFiles = null,
  previousChat,
  userCode;

function triggerFileInput() {
  document.getElementById("fileInput").click();
}

document
  .getElementById("fileInput")
  .addEventListener("change", handleFileSelect);

var results = [];
async function handleFileSelect(event) {
  selectedFiles = event.target.files;
  var filenames = "";
  console.log("selected file");
  console.log(event.target.files);

  for (var i = 0; i < selectedFiles.length; i++) {
    const text = await readFileAsync(selectedFiles[i]);
    if (text === "") {
      continue;
    }

    if (i === 0) {
      filenames += selectedFiles[i].name;
    } else {
      filenames += ", " + selectedFiles[i].name;
    }

    results.push({
      code: text,
      name: selectedFiles[i].name,
    });
  }
  document.getElementById("selectedFileName").innerText = filenames;
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

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      console.log(text);
      resolve(text);
    };
    reader.onerror = function (e) {
      reject(e);
    };
    reader.readAsText(file);
  });
}

function replaceAlternate(inputString, pattern1) {
  var counter = 0;
  var regex = new RegExp(pattern1, "g");
  var result = inputString.replace(regex, function (match) {
    counter++;
    return counter % 2 === 1
      ? '\n<div style="font-family: monospace;background: #281a48;color: #aaa;padding: 10px;border-radius: 8px;font-size: 14px;">'
      : "</div>";
  });
  return result;
}

async function run() {
  if (!selectedFiles) {
    document.getElementById("errorDiv").innerText = `*Please select a file`;
    return;
  }
  userCode = JSON.stringify(results);
  var user_input = document.getElementById("user_input").value;
  var loadingGif = document.getElementById("loadingGif");
  var run_btn = document.getElementById("run_btn");
  loadingGif.className = "loadingGif";
  run_btn.className = "displayNone";
  var corrected_code = document.getElementById("corrected_code");
  var correctCodeDiv = document.getElementById("correctCodeDiv");
  // console.log(text)
  // fetch('https://codeguardian.vercel.app/compile', {
  fetch("http://127.0.0.1:5000/compileAll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: results, user_input: user_input }),
  })
    .then((response) => response.json())
    .then((outputData) => {
      if (outputData.suggestion !== undefined) {
        var suggestions = outputData.suggestion.replace(/\n/g, "<br>");
        console.log(suggestions);

        var replacedString = replaceAlternate(suggestions, "```");
        console.log(replacedString);

        var suggestionMessageDiv = document.getElementById(
          "suggestionMessageDiv"
        );
        document.getElementById("suggestionDiv").className = "";
        suggestionMessageDiv.innerHTML = replacedString;
        previousChat = outputData.suggestion;
      }

      loadingGif.className = "displayNone";
      run_btn.className = "run_btn";
    })
    .catch((error) => {
      loadingGif.className = "displayNone";
      run_btn.className = "run_btn";
      console.error("Error:", error);
    });
}

function writeToFile(content, filename) {
  console.log("flhvnfoivbaefrovhovhokvhnksvh");
  var blob = new Blob([content], { type: "text/plain" });
  var a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function continueToChatCOde() {
  var completeChat = { user: userCode, assistant: previousChat };
  localStorage.setItem("PreviousChat", JSON.stringify(completeChat));
  window.location.href = "http://127.0.0.1:5501/frontend/chat.html";
}
