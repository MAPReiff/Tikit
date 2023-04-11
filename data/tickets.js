import * as helpers from "../helpers.js";
import { tickets } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const create = async (
  name, // string input
  description, // string input
  status, //string input, dropdown menu 
  priority, // dropdown menue to select (probably strings)
  deadline, // optional timestamp
  customerID, // objectID of the account who did the action
  owners, //objectID array of who the tickets is assigned to
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

  //validate owners
  owners = helpers.checkIdArray(owners, "Owners ID Array")

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
    owners: owners,
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


/*for now I will not allow users to upate the owners of a ticket, 
because it make it alittle more complex, we need to go and update the ticketsBeingWorkedOn in the user
If we need this functionallity we can add it later */

/* also when we update a ticket do we change createdOn to when it got updated or leave it as is
for now I will just leave it as is*/

const update = async (
  id,
  name,
  description,
  status,
  priority,
  deadline,
  category,
  tags
) => {

  id = helpers.checkId(id, "Ticket ID");
  const ticketCollection = await tickets();
  const ticket = await ticketCollection.findOne({ _id: new ObjectId(id) });
  if (ticket === null) throw "Error: No ticket found with that ID";

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

  // validate category
  category = helpers.checkString(category, "Category");

  // check if tags are provided
  if (!tags) {
    tags = [];
  } else {
    tags = helpers.checkStringArray(tags, "Tags");
  }

  const curTicket = await get(id);

  let updatedTicket = { 
    name: name,
    description: description,
    status: status,
    priority: priority,
    createdOn: curTicket.createdOn,
    deadline: deadline,
    customerID: curTicket.customerID,
    owners: curTicket.owners,
    category: category,
    tags: tags,
    comments: curTicket.comments
  }
  const updatedInfo = await ticketCollection.findOneAndUpdate(
    {_id: new ObjectId(id)},
    {$set: updatedTicket},
    {returnDocument: 'after'}
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw "Error: could not update ticket successfully!";
  }
  updatedInfo.value._id = updatedInfo.value._id.toString();
  return updatedInfo.value;
};



export default { create, getAll, get, remove, update};
