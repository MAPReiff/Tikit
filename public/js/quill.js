// rich text editor
Quill.register("modules/imageCompressor", imageCompressor);
var quill = new Quill("#editor", {
  modules: {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      ["image"],
      [{ list: "ordered" }, { list: "bullet" }],
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

// get the hidden input - from https://stackoverflow.com/a/67682117
let inputElement = document.getElementById("contentInput");
quill.on("text-change", function () {
  // console.log(quill.getText())
  let richText = quill.getText().trim().replaceAll(/\s+/g, "");
  // console.log(richText.length)
  if (richText.length !== 0 || richText === "\n") {
    // inputElement.value = JSON.stringify(quill.getContents());
    inputElement.value = quill.root.innerHTML;
  } else {
    inputElement.value = "";
  }
});
