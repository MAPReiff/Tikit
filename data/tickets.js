import * as helpers from "../helpers.js";
import { tickets } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const create = async (
  name, // string input
  description, // string input
  status, //string input, dropdown menu 
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

  // validate status
  status = helpers.checkString(status, "Status");
  if (
    status != "To Do" &&
    status != "In Progress" &&
    status != "Completed"
  ) {
    throw new Error("status must be a string equal to, To Do, In Progress, or Completed");
  }

  // validate priority
  priority = helpers.checkString(priority, "Priority");
  if (
    priority != "Low" &&
    priority != "Medium" &&
    priority != "High" &&
    priority != "Critical"
  ) {
    throw new Error("priority must be a string equal to, Low, Medium, High, or Critical");
  }

  // check if dadline is provided
  // deadline expected like this - timestamp
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local

  let createdOn = Date.now();
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

  let newTicket = {
    name: name,
    description: description,
    status: status,
    priority: priority,
    createdOn: createdOn,
    deadline: deadline,
    customerID: customerID,
    category: category,
    tags: tags,
    comments: []
  };
  const ticketCollection = await tickets();
  const insertInfo = await ticketCollection.insertOne(newTicket);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error: Could not add new ticket!';

  const newId = insertInfo.insertedId.toString();

  const ticket = await get(newId);
  return ticket;
};

//get all tickets
const getAll = async () => {
  const ticketCollection = await tickets();
  let ticketList = await ticketCollection.find({}).toArray();
  if (!ticketList) throw 'Error: Could not get all tickets!';
  ticketList = ticketList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return ticketList;
}

//get ticket based on id
const get = async (id) => {
  id = helpers.checkId(id, "Ticket ID");
  const ticketCollection = await tickets();
  const ticket = await ticketCollection.findOne({ _id: new ObjectId(id) });
  if (ticket === null) throw "Error: No ticket found with that ID";
  ticket._id = ticket._id.toString();
  return ticket;
};

//remove ticket based on id
const remove = async (id) => {
  id = helpers.checkId(id, "Ticket ID");
  const ticketCollection = await tickets();
  const deletionInfo = await ticketCollection.findOneAndDelete({
    _id: new ObjectId(id)
  });
  if (deletionInfo.lastErrorObject.n === 0) {
    throw `Could not delete ticket with id of ${id}`;
  }
  return `${deletionInfo.value.name} has been successfully deleted!`;

};

const update = async (
  id,
  name,
  description,
  status,
  priority,
  deadline,
  customerID,
  owners,
  tags
) => {

  // validate name
  name = helpers.checkString(name, "Name");

  // validate description
  description = helpers.checkString(description, "Description");

  // validate status
  status = helpers.checkString(status, "Status");
  if (
    status != "To Do" &&
    status != "In Progress" &&
    status != "Completed"
  ) {
    throw new Error("status must be a string equal to, To Do, In Progress, or Completed");
  }

  // validate priority
  priority = helpers.checkString(priority, "Priority");
  if (
    priority != "Low" &&
    priority != "Medium" &&
    priority != "High" &&
    priority != "Critical"
  ) {
    throw new Error("priority must be a string equal to, Low, Medium, High, or Critical");
  }

  // check if dadline is provided
  // deadline expected like this - timestamp
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local

  let createdOn = Date.now();
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
};


export default { create, getAll, get, remove, update};
