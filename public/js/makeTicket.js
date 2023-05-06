let formTicket;
document.addEventListener("DOMContentLoaded", function () {
  formTicket = document.getElementById("makeTicketForm");
  if (formTicket) {
    formTicket.addEventListener("submit", (event) => {
      event.preventDefault();
      let ticketName = document.getElementById("ticketName").value;
      let ticketDescription = document.getElementById("ticketDescription").value;
      let ticketCategory = document.getElementById("ticketCategory").value;
      let ticketDeadline = document.getElementById("ticketDeadline").value;
      let ticketPriority = document.getElementById("ticketPriority").value;
  
      // let role = document.getElementById("roleInput").value;
      let errorP = document.getElementById("error");
      try {
        checkTicketName(ticketName, "ticket name");
        checkTicketDescription(ticketDescription, "ticket description");
        checkTicketCategory(ticketCategory, "ticket category");
        checkTicketDeadline(ticketDeadline);
        checkTicketPriority(ticketPriority);
        formTicket.submit();
      } catch (e) {
        errorP.innerHTML = `${e}`;
        errorP.hidden = false;
        // scroll to top of page so they can see the error
        window.scrollTo(0, 0);
      }
    });
  }
});


function checkTicketDescription(data, type) {
  if (typeof data == "undefined") {
    throw new Error(`please provide a ${type} string`);
  } else if (typeof data != "string") {
    throw new Error(`please provide a ${type} string`);
  }

  data = data.trim();

  if (data.length == 0) {
    throw new Error(`please provide a ${type} string`);
  }

  return data;
}

function checkTicketName(data, type) {
  if (typeof data == "undefined") {
    throw new Error(`please provide a ${type} string`);
  } else if (typeof data != "string") {
    throw new Error(`please provide a ${type} string`);
  }

  data = data.trim();

  if (data.length == 0) {
    throw new Error(`please provide a ${type} string`);
  }

  return data;
}

function checkTicketCategory(data, type) {
  if (typeof data == "undefined") {
    throw new Error(`please provide a ${type} string`);
  } else if (typeof data != "string") {
    throw new Error(`please provide a ${type} string`);
  }

  data = data.trim();

  if (
    data != "Service Request" &&
    data != "Incident" &&
    data != "Problem" &&
    data != "Change Request"
  ) {
    throw new Error(
      "category must be a string equal to Service Request, Incident, Problem, or Change Request"
    );
  }

  return data;
}

function checkTicketPriority(data) {
  console.log(data)
  if (typeof data == "undefined") {
    throw new Error(`please provide a ${type} string`);
  } else if (typeof data != "string") {
    throw new Error(`please provide a ${type} string`);
  }

  data = data.trim();

  if (
    data != "Low" &&
    data != "Normal" &&
    data != "High" &&
    data != "Critical"
  ) {
    throw new Error(
      "priority must be a string equal to Low, Normal, High, or Critical"
    );
  }

  return data;
}

function checkTicketDeadline(data) {
  if (typeof data == "undefined") {
    return NaN;
  } else if (typeof data != "string") {
    throw new Error(`please provide a ${type} string`);
  }

  data = data.trim();
  if (data.length == 0) {
    return NaN;
  }

  let t = data.match(/^\d{4}-\d{2}-\d{2}$/);
  if (t !== null) {
    // var d = +t[1],
    //   m = +t[2],
    //   y = +t[3];
    let date = new Date(data);
    let y = data.substring(0, 4);
    let m = data.substring(5, 7);
    let d = data.substring(8, 10);    

    
    if (date.getFullYear() == y && date.getMonth() == m - 1) {
      if (new Date(data).getTime() === NaN) {
        throw new Error("provided dealine is not a valid timestamp");
      } 
      // else if (new Date(data).getTime() < createdOn) {
      //   throw new Error("provided dealine in the past");
      // }
      return data;
    } else {
      throw Error("ticket deadline must be in the format YYYY-DD-MM");
    }
  } else {
    throw Error("ticket deadline must be in the format YYYY-DD-MM");
  }
}
