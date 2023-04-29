var temp = "{{priority}}";
var mySelect = document.getElementById("ticketPriority");

for (var i, j = 0; (i = mySelect.options[j]); j++) {
  if (i.value == temp) {
    mySelect.selectedIndex = j;
    break;
  }
}

var temp2 = "{{category}}";
var mySelect2 = document.getElementById("ticketCategory");

for (var i, j = 0; (i = mySelect2.options[j]); j++) {
  if (i.value == temp2) {
    mySelect2.selectedIndex = j;
    break;
  }
}
