function proceed(val) {
  console.log("function called", val);
  if (val === 1) {
    document.location = "http://127.0.0.1:5501/frontend/editor.html";
  } else if (val === 2) {
    window.location.href = "http://127.0.0.1:5501/frontend/file.html";
  } else {
    window.location.href = "http://127.0.0.1:5501/frontend/chat.html";
  }
}
