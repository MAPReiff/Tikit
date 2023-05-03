// Have the edit ticket page automatically be filled with the past values
var priority = document.getElementById("ticketPriority").value;
console.log(priority);
var prioritySelect = document.getElementById('ticketPriority');
prioritySelect.selectedIndex = priority;


var category = document.getElementById("ticketCategory").value;
console.log(category);
var categorySelect = document.getElementById('ticketCategory');
categorySelect.selectedIndex = category;


var date = document.getElementById("ticketDeadline").value;
console.log(date)
var dateSelect = document.getElementById('ticketDeadline');
