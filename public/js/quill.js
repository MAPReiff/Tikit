// rich text editor
Quill.register("modules/imageCompressor", imageCompressor);
var quill = new Quill("#editor", {
  modules: {
    toolbar: [
      // [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic"], //, "underline", "strike"],
      // In slack, prof hill said "Strong and Em are fine to use", but we can not use <u> and <s> so we commented them out
      // https://stevenswebdevs2023.slack.com/archives/C04GT4VC2CW/p1683320626601129?thread_ts=1683320245.987919&cid=C04GT4VC2CW
      ["image"],
      [{ list: "bullet" }],
      ["clean"],
    ],
    imageCompressor: {
      quality: 0.7,
      maxWidth: 500, // default
      maxHeight: 500, // default
      imageType: "image/jpeg",
    },
  },
  theme: "snow",
});

// get the hidden input - inspired by https://stackoverflow.com/a/67682117
let route = window.location.pathname;
let inputElement;
if (route.startsWith("/tickets/view")) {
  inputElement = document.getElementById("contentInput");
} else if (route.startsWith("/tickets/makeTicket")) {
  inputElement = document.getElementById("ticketDescription");
} else if (route.startsWith("/tickets/edit")) {
  inputElement = document.getElementById("ticketDescription");
  inputElement.value = quill.root.innerHTML;
}

quill.on("text-change", function () {
  let richText = quill.getText().trim().replaceAll(/\s+/g, "");
  if (
    richText.length !== 0 ||
    richText === "\n" ||
    quill.root.innerHTML.includes("<img src=")
  ) {
    // inputElement.value = JSON.stringify(quill.getContents());
    inputElement.value = quill.root.innerHTML.replaceAll(`<img src="`, `<img alt="Ticket Image" src="`);
  } else {
    inputElement.value = "";
  }
});

// set the title attribute for each of the obejcts in the toolbar for accessibility

quill.container.previousSibling
  .querySelector("button.ql-bold")
  .setAttribute("title", "Bold");
quill.container.previousSibling
  .querySelector("button.ql-italic")
  .setAttribute("title", "Italic");
// quill.container.previousSibling
//   .querySelector("button.ql-underline")
//   .setAttribute("title", "Underline");
// quill.container.previousSibling
//   .querySelector("button.ql-strike")
//   .setAttribute("title", "Strike");
quill.container.previousSibling
  .querySelector("button.ql-image")
  .setAttribute("title", "Insert Image");
quill.container.previousSibling
  .querySelector("button.ql-list")
  .setAttribute("title", "Bullet List");
quill.container.previousSibling
  .querySelector("button.ql-clean")
  .setAttribute("title", "Clear Formatting");
