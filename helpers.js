//some validation functions
import { ObjectId } from 'mongodb';
import validator from 'validator';

export const checkId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== 'string') throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
}

export const checkIdArray = (idArray, varName) => {
  if (!idArray || !Array.isArray(idArray))
    throw `You must provide an array of ${varName}`;
  for (let i in idArray) {
    if (typeof idArray[i] !== 'string' || idArray[i].trim().length === 0) {
      throw `One or more elements in ${varName} array is not a string or is an empty string`;
    }
    if (!ObjectId.isValid(idArray[i])) throw `Error: ${varName} contains an invalid object ID`;
    idArray[i] = idArray[i].trim();
  }
  if (!(idArray.length >= 1)) throw `You must provide an array, ${varName}, that has at least one element`;
  return idArray;
}

export const checkString = (strVal, varName) => {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
}

export const checkStringArray = (arr, varName) => {
  if (!arr || !Array.isArray(arr))
    throw `You must provide an array of ${varName}`;
  for (let i in arr) {
    if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
      throw `One or more elements in ${varName} array is not a string or is an empty string`;
    }
    arr[i] = arr[i].trim();
  }
  if (!(arr.length >= 1)) throw `You must provide an array, ${varName}, that has at least one element`;
  return arr;
}

export const validateEmail = (email) => { 
  if (!email) throw "Error: You must supply a email!";
  if (typeof email !== 'string') throw "Error: email must be a string!";
  email = email.trim(); 
  if(!(validator.isEmail(email))) throw "Error: Invalid Email Provided"
  return email; 
}
