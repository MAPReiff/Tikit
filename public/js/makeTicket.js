

var formTicket = document.getElementById("makeTicketForm");
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
    }
    });
}
  


function checkTicketDescription(data, type) {
    if (typeof data == "undefined") {
      throw new Error(`please provide a ${type} string`);
    } else if (typeof data != "string") {
      throw new Error(`please provide a ${type} string`);
    }
  
    data = data.trim();
  
    if (data.length < 10) {
      throw new Error(`${type} must be atleast 10 characters long`);
    } else if (data.length > 200) {
      throw new Error(`${type} must be no longer than 200 characters`);
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

  if (data.length < 4) {
    throw new Error(`${type} must be atleast 4 characters long`);
  } else if (data.length > 30) {
    throw new Error(`${type} must be no longer than 30 characters`);
  }

  return data;
}


function checkTicketCategory(data, type) {
    if (typeof data == "undefined") {
        throw new Error(`please provide a ${type} string`);
    } else if (typeof data != "string") {
        throw new Error(`please provide a ${type} string`);
    }

    if (
        category != "Service Request" &&
        category != "Incident" &&
        category != "Problem" &&
        category != "Change Request"
    ) {
        throw new Error("category must be a string equal to Service Request, Incident, Problem, or Change Request");
    }

    return data; 
}


function checkTicketPriority(data) {
    if (typeof data == "undefined") {
        throw new Error(`please provide a ${type} string`);
    } else if (typeof data != "string") {
        throw new Error(`please provide a ${type} string`);
    }

    if (
        priority != "Low" &&
        priority != "Normal" &&
        priority != "High" &&
        priority != "Critical"
    ) {
        throw new Error("priority must be a string equal to Low, Normal, High, or Critical");
    }

    return data; 
}


function checkTicketDeadline(data) {
    if (typeof data == "undefined") {
        return NaN;
    } else if (typeof data != "string") {
        throw new Error(`please provide a ${type} string`);
    }

    var t = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if(t !== null){
        var d = +t[1], m = +t[2], y = +t[3];
        var date = new Date(y, m - 1, d);
        if(date.getFullYear() === y && date.getMonth() === m - 1) {
            if (new Date(deadline).getTime() === NaN) {
                throw new Error("provided dealine is not a valid timestamp");
            } else if (new Date(deadline).getTime() < createdOn) {
                throw new Error("provided dealine in the past");
            }
            return data;   
        }else{
            throw Error("ticket deadline must be in the format YYYY-DD-MM");
        }
    }else{
        throw Error("ticket deadline must be in the format YYYY-DD-MM");
    }

}