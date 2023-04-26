import * as helpers from "../helpers.js";
import { tickets, createIndexes} from "../config/mongoCollections.js";
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
  
  if (description.length < 10) {
    throw new Error(`${type} must be atleast 10 characters long`);
  } else if (data.length > 200) {
    throw new Error(`${type} must be no longer than 200 characters`);
  }

  // validate status
  status = helpers.checkString(status, "Status");
  if (
    status != "To Do" &&
    status != "In Progress" &&
    status != "Completed"
  ) {
    throw new Error("status must be a string equal to To Do, In Progress, or Completed");
  }

  // validate priority
  priority = helpers.checkString(priority, "Priority");
  console.log(priority);
  if (
    priority != "Low" &&
    priority != "Normal" &&
    priority != "High" &&
    priority != "Critical"
  ) {
    throw new Error("priority must be a string equal to Low, Normal, High, or Critical");
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
  if (
    category != "Service Request" &&
    category != "Incident" &&
    category != "Problem" &&
    category != "Change Request"
  ) {
    throw new Error("category must be a string equal to Service Request, Incident, Problem, or Change Request");
  }

  customerID = new ObjectId(helpers.validateID(customerID));

  if (owners && Array.isArray(owners)) {
    for (let [index, user] of owners.entries()) {
      owners[index] = new ObjectId(helpers.validateID(user));
    }
  } else {
    throw "Owners is not a valid array";
  }

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

  const userCollection = await users();
  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(customerID) },
    { $addToSet: {
      createdTickets: insertInfo.insertedId,
     } 
    },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw "Error: could not update user successfully!";
  }

  await updateOwners(userCollection, insertInfo.insertedId, owners);

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
    return toStringify(element);
  });
  return ticketList;
}

//gets multiple tickets based on an array of ids
const getMultiple = async (ids) => {
  let retArr = [];
  for(const id of ids){
      retArr.push(await get(id));
  }
  return retArr;
}

//get ticket based on id
const get = async (id) => {
  id = helpers.checkId(id, "Ticket ID");
  const ticketCollection = await tickets();
  const ticket = await ticketCollection.findOne({ _id: new ObjectId(id) });
  if (ticket === null) throw "Error: No ticket found with that ID";
  return toStringify(ticket);
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
  owners,
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

  if (owners && Array.isArray(owners)) {
    for (let [index, user] of owners.entries()) {
      owners[index] = new ObjectId(helpers.validateID(user));
    }
  } else {
    throw "Owners is not a valid array";
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
    owners: owners,
    category: category,
    tags: tags,
    comments: curTicket.comments
  }
  const objID = new ObjectId(id);
  const updatedInfo = await ticketCollection.findOneAndUpdate(
    {_id: objID},
    {$set: updatedTicket},
    {returnDocument: 'after'}
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw "Error: could not update ticket successfully!";
  }

  const userCollection = await users();
  await updateOwners(userCollection, objID, owners);

  return toStringify(updatedInfo.value);
};

const search = async (query) => {
  const ticketCollection = await tickets();
  return await (
  ticketCollection.find( 
    {$text: {$search: `${query}`, $caseSensitive: false}},
    { score: { $meta: "textScore" } }
  )
  .sort( { score: { $meta: "textScore" } } )
  ).toArray();
}

const updateOwners = async (userCollection, ticketID, owners) => {
  let updatedInfo;
  
  for(let owner of owners) {
    updatedInfo = await userCollection.findOneAndUpdate(
     { _id: new ObjectId(owner) },
     { $addToSet: {
       ticketsBeingWorkedOn: ticketID
      } 
     },
     { returnDocument: "after" }
   );

   if (updatedInfo.lastErrorObject.n === 0) {
     throw "Error: could not update user successfully!";
   }
 }
}

const toStringify = (ticket) => {
  ticket._id = ticket._id.toString();
  ticket.customerID = ticket.customerID.toString();
  ticket.owners = ticket.owners.map((owner) => {
    return owner.toString();
  });

  return ticket;
}


export default { create, getAll, get, getMultiple, remove, update, search};
