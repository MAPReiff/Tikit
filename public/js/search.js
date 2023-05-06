let searchForm = document.getElementById("search-form");
let searchFormUsers = document.getElementById("search-form-users");

let navForm = document.getElementById("nav-search-form");

if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    // Does not check !query because that is considered valid input (null/undefined/empty is considered an empty search i.e. everything is returned)
    // Also does not check empty strings, as that is also considered valid input (same reason as above)
    event.preventDefault();
    let query = document.getElementById("searchTickets").value;
    if (query && typeof query !== "string")
      throw `Error: Search Query must be a string!`;
    searchForm.submit();
  });
}

if (searchFormUsers) {
  searchFormUsers.addEventListener("submit", (event) => {
    // Does not check !query because that is considered valid input (null/undefined/empty is considered an empty search i.e. everything is returned)
    // Also does not check empty strings, as that is also considered valid input (same reason as above)
    event.preventDefault();
    let query = document.getElementById("searchUsers").value;
    if (query && typeof query !== "string")
      throw `Error: Search Query must be a string!`;
    searchFormUsers.submit();
  });
}

if (navForm) {
  navForm.addEventListener("submit", (event) => {
    // Does not check !query because that is considered valid input (null/undefined/empty is considered an empty search i.e. everything is returned)
    // Also does not check empty strings, as that is also considered valid input (same reason as above)
    event.preventDefault();
    let query = document.getElementById("search").value;
    if (query && typeof query !== "string")
      throw `Error: Search Query must be a string!`;
    navForm.submit();
  });
}
