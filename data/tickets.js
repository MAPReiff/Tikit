import * as helpers from "../helpers.js";
import { tickets } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const create = async (
  name, // string input
  description, // string input
  priority, // dropdown menue to select (probably strings)
  deadline, // optional timestamp
  customerID, // objectID of the account who did the action
  category, // dropdown menu to select (probably strings)
  tags // optional array of tags
) => {
  // validate name
  name = helpers.checkString(name, "Name");

  // validate description
  description = helpers.checkString(description, "Description");

  // validate priority
  priority = helpers.checkString(priority, "Priority");
  if (
    priority != "Low" ||
    priority != "Medium" ||
    priority != "High" ||
    priority != "Critical"
  ) {
    throw new Error("priority must be Low, Medium, High, or Critical");
  }

  let createdOn = Date.now();

  // check if dadline is provided
  // deadline expected like this - timestamp
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
  if (!deadline) {
    deadline = NaN;
    // no deadline so we just use NaN as a placeholder
  } else {
    // a dealine was provided
    if (new Date(deadline).getTime() === NaN) {
      throw new Error("provided dealine is not a valid timestamp");
    } else if (new Date(deadline).getTime() < createdOn) {
      throw new Error("provided dealine in the past");
    }
  }

  // validate customerID
  customerID = helpers.checkId(customerID, "Customer ID");

  // validate category
  category = helpers.checkString(category, "Category");

  // check if tags are provided
  if (!tags) {
    tags = [];
  } else {
    tags = helpers.checkStringArray(tags, "Tags");
  }

  // now the rest
  let status = logged;
  let comments = [];
};

const getAll = async () => {};

const get = async (ticketID) => {
  // validate the ticket is a valid ID
  let ticketID = helpers.checkId(ticketID, "Ticket ID");

  // check the DB for the that ticket
  // if found, return the ticket
  // if not found, error
};

const remove = async (ticketID, userID) => {
  // validate the ticket is a valid ID
  ticketID = helpers.checkId(ticketID, "Ticket ID");

  // check the DB for the that ticket
  // if found, procede
  // if not found, error

  // validate the user is a valid ID
  userID = helpers.checkId(userID, "User ID");
  // check DB if that user exists
  // if found
  //    check that the ID is either the ticket customer, or has a role that can close any ticket
  //      if good, procede
  //      if not, error
  // if not found, error
};

const update = async (
  ticketID,
  userID,
  name,
  description,
  status,
  priority,
  deadline,
  owners,
  tags
) => {
  // this function does not modify the comments or the createdOn attributes.

  // validate the ticket is a valid ID
  ticketID = helpers.checkId(ticketID, "Ticket ID");

  // check the DB for the that ticket
  // if found, procede
  // if not found, error

  // validate the user is a valid ID
  userID = helpers.checkId(userID, "User ID");
  // check DB if that user exists
  // if found, procede
  // if not found, error

  // validate name
  name = helpers.checkString(name, "Name");

  // validate description
  description = helpers.checkString(description, "Description");

  // validate status
  status = helpers.checkString(status, "Status");
  if (
    status != "Logged" ||
    status != "In Progress" ||
    status != "On Hold" ||
    status != "Resolved"
  ) {
    throw new Error("status must be Logged, In Progress, On Hold, or Resolved");
  }

  // validate priority
  priority = helpers.checkString(priority, "Priority");
  if (
    priority != "Low" ||
    priority != "Medium" ||
    priority != "High" ||
    priority != "Critical"
  ) {
    throw new Error("priority must be Low, Medium, High, or Critical");
  }

  let timeNow = Date.now();

  // check if dadline is provided
  if (!deadline) {
    deadline = NaN;
    // no deadline so we just use NaN as a placeholder
  } else {
    // a dealine was provided
    if (new Date(deadline).getTime() === NaN) {
      throw new Error("provided dealine is not a valid timestamp");
    } else if (new Date(deadline).getTime() < timeNow) {
      throw new Error("provided dealine in the past");
    }
  }

  // validate owners array
  if (typeof owners == "undefined") {
    throw new Error("please provide an array of owners");
  } else if (typeof owners != "object") {
    throw new Error("please provide an array of owners");
  }

  if (!Array.isArray(owners)) {
    throw new Error("please provide an array of owners");
  }

  if (owners.length != 0) {
    owners[i] = helpers.checkId(owners[i]);
    // check DB if that user exists
    // if found, procede
    // if not found, error
  } // no owners is acceptable (has not been assigned yet, un assigned, etc)

  if (tags.length != 0) {
    tags = helpers.checkStringArray(tags, "tags")
  } // no tags is acceptable
};

const comment = async (ticketID, userID, commentData, replyToID) => {
  // validate the ticket is a valid ID
  ticketID = helpers.checkId(ticketID, "Ticket ID");

  // check the DB for the that ticket
  // if found, procede
  // if not found, error

  // validate the user is a valid ID
  userID = helpers.checkId(userID, "User ID");
  // check DB if that user exists
  // if found, procede
  // if not found, error

  // validate the comment data
  commentData = helpers.checkString(commentData, "Comment data");

  // if this is a reply to another comment
  if (replyToID) {
    // validate the reply to comment is a valid ID
    replyToID = helpers.checkId(replyToID, "Reply to comment ID");

    // search for comment ID under the ticket
    // append this reply to that comment
  } // if this is on the base ticket
  else {
    // append this to the ticket's comments
  }
};

export default { create, getAll, get, remove, update, comment };
