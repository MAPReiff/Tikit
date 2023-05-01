let form;
document.addEventListener("DOMContentLoaded", function () {
  form = document.getElementById("userEdit-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let role = document.getElementById("roleInput").value;
      let title = document.getElementById("titleInput").value;
      let errorP = document.getElementById("error");
      try {
        role = checkRole(role);
        title = checkTitle(title, "title");
        form.submit();
      } catch (e) {
        errorP.innerHTML = `${e}`;
        errorP.hidden = false;
      }
    });
  }
});

const checkRole = (role) => {
  if (typeof role == "undefined") {
    throw new Error("please supply a role string");
  } else if (typeof role != "string") {
    throw new Error("please supply a role string");
  }

  role = role.trim().toLowerCase();

  if (role != "user" && role != "admin") {
    throw new Error("role must be either user or admin");
  }

  return role;
};

function checkTitle(data, type) {
  if (typeof data == "undefined") {
    throw new Error(`please provide a ${type} string`);
  } else if (typeof data != "string") {
    throw new Error(`please provide a ${type} string`);
  }

  data = data.trim();

  if (data.replaceAll(" ", "").length == 0) {
    throw new Error(`${type} string must contain text and not only spaces`);
  }

  if (data.length < 2) {
    throw new Error(`${type} must be atleast 2 characters long`);
  } else if (data.length > 25) {
    throw new Error(`${type} must be no longer than 25 characters`);
  }

  return data;
}
