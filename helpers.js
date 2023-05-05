//some validation functions
import { ObjectId } from "mongodb";
import * as EmailValidator from "email-validator";
import passwordValidator from "password-validator";

export const renderError = (res, code, msg) => {
  res.status(code).render("404", {
    title: `Error ${code}`,
    msg: `Error ${code}: ${msg}`});
}

// export const renderErrorGeneric = (res, code, msg) => {
//   res.status(code).render("error", {
//     title: `Error ${code}`,
//     msg: `Error ${code}: ${msg}`});
// }

export const checkId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};

export const checkIdArray = (idArray, varName) => {
  if (!idArray || !Array.isArray(idArray))
    throw `You must provide an array of ${varName}`;
  for (let i in idArray) {
    if (typeof idArray[i] !== "string" || idArray[i].trim().length === 0) {
      throw `One or more elements in ${varName} array is not a string or is an empty string`;
    }
    if (!ObjectId.isValid(idArray[i]))
      throw `Error: ${varName} contains an invalid object ID`;
    idArray[i] = idArray[i].trim();
  }
  if (!(idArray.length >= 1))
    throw `You must provide an array, ${varName}, that has at least one element`;
  return idArray;
};

export const checkString = (strVal, varName) => {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0 && varName != "ticket tags")
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
};

export const checkStringArray = (arr, varName) => {
  if (!arr || !Array.isArray(arr))
    throw `You must provide an array of ${varName}`;
  for (let i in arr) {
    if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
      throw `One or more elements in ${varName} array is not a string or is an empty string`;
    }
    arr[i] = arr[i].trim();
  }
  if (!(arr.length >= 1))
    throw `You must provide an array, ${varName}, that has at least one element`;
  return arr;
};

export const validateID = (id) => {
  if (!id) throw "Error: ID must be provided.";
  if (typeof id !== "string") throw "Error: ID must be a string.";
  id = id.trim();
  if ((id.length === 0, "ID string cannot be empty"));
  if ((!ObjectId.isValid(id), "ID is invalid"));
  return id;
};


export const checkEmail = (emailAddress) => {
  if (typeof emailAddress == "undefined") {
    throw new Error("please provide an email string");
  } else if (typeof emailAddress != "string") {
    throw new Error("please provide an email string");
  }

  emailAddress = emailAddress.trim().toLowerCase();

  if (emailAddress.replaceAll(" ", "").length == 0) {
    throw new Error("email string must contain text and not only spaces");
  }

  if (!EmailValidator.validate(emailAddress)) {
    throw new Error("please enter a valid email address");
  }

  return emailAddress;
};

export const checkPassword = (password) => {
  if (typeof password == "undefined") {
    throw new Error("please supply a password string");
  } else if (typeof password != "string") {
    throw new Error("please supply a password string");
  }

  if (password.replaceAll(" ", "").length == 0) {
    throw new Error(
      "password string must contain a password and not only spaces"
    );
  }

  if (password.length < 8) {
    throw new Error("passwords must be atleast 8 characters long");
  }

  let passwordParams = new passwordValidator()
    .is()
    .min(8)
    .has()
    .uppercase()
    .has()
    .digits()
    .has()
    .symbols();

  if (!passwordParams.validate(password)) {
    throw new Error(
      "your passwords must conatin at least one uppercase character, there has to be at least one number and there has to be at least one special character"
    );
  }

  return password;
};


export const validateRole = (role) => { 
  if (!role) throw "Error: No role provided!";
  if(typeof role  !== 'string') throw 'Error: Role must be a string.';
  role = role.trim();
  role = role.toLowerCase();
  if(role !== "admin" && role !== "user") throw "Error: Invalid role passed!";
  return role; 
}


//https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
export const timeConverter = (UNIX_timestamp) => {
  let a = new Date(UNIX_timestamp * 1);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  if(min < 10){ 
    min = "0" + min; 
  }
  let sec = a.getSeconds();
  if(sec < 10){ 
    sec = "0" + sec; 
  }
  let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

export const dateFormatter = (date) => {
  if(!(date instanceof Date)) {
    date = new Date(date);
  }

  if(date.toString() === 'Invalid Date') {
    throw 'Error: Invalid date passed into date formatter';
  }

  const formatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC'
  };

  return new Intl.DateTimeFormat([], formatOptions)
        .format(date);
}

export const isEqualDay = (date1, date2) => {
  if(!(date1 instanceof Date)) {
    date1 = new Date(date1);
  }

  if(!(date2 instanceof Date)) {
    date2 = new Date(date2);
  }

  if(date1.toString() === 'Invalid Date') {
    throw 'Error: Invalid date passed into date formatter';
  }

  if(date2.toString() === 'Invalid Date') {
    throw 'Error: Invalid date passed into date formatter';
  }

  return date1.getUTCMonth() === date2.getUTCMonth()
        && date1.getUTCDate() === date2.getUTCDate()
        && date1.getUTCFullYear() === date2.getUTCFullYear();
}