import * as helpers from "../helpers.js";
import { tickets, createIndexes } from "../config/mongoCollections.js";
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
  if (status != "To Do" && status != "In Progress" && status != "Completed" && status != "Problem") {
    throw new Error(
      "status must be a string equal to To Do, In Progress, or Completed"
    );
  }

  // validate priority
  priority = helpers.checkString(priority, "Priority");

  if (
    priority != "Low" &&
    priority != "Normal" &&
    priority != "High" &&
    priority != "Critical"
  ) {
    throw new Error(
      "priority must be a string equal to Low, Normal, High, or Critical"
    );
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
      throw new Error("provided deadline is not a valid timestamp");
    } else if (new Date(deadline).getTime() < createdOn) {
      throw new Error("provided deadline in the past");
    }
    deadline =  new Date(deadline);
  }

  // validate customerID
  customerID = helpers.checkId(customerID, "Customer ID");
  

  // validate category
  category = helpers.checkString(category, "Category");
  if (
    category != "Service Request" &&
    category != "Incident" &&
    category != "Problem" &&
    category != "Change Request"
  ) {
    throw new Error(
      "category must be a string equal to Service Request, Incident, Problem, or Change Request"
    );
  }

  customerID = new ObjectId(helpers.validateID(customerID));

  //validate owners
  if (owners && Array.isArray(owners)) {
    if(owners.length > 0){
      owners = helpers.checkIdArray(owners, "Owners ID Array");
    }

    for (let i = 0; i < owners.length; i++) {
      owners[i] = new ObjectId(helpers.validateID(owners[i]));
    }

  }else if (owners.length != 0) {
    throw "Owners is not a valid array";
    
  }else{
    owners = [];
  }

  var tagsArray;
  // check if tags are provided
  if (!tags || tags.length == 0) {
    tagsArray = [];
  } else {
    tags = helpers.checkString(tags, "Tags");
    tagsArray = tags.split(',');
    for(let tag in tagsArray){
      tag = tag.trim();
    }
  }


  let newTicket = {
    name: name,
    description: description,
    status: status,
    priority: priority,
    createdOn: new Date(createdOn),
    deadline: new Date(deadline),
    customerID: customerID,
    owners: owners,
    category: category,
    tags: tagsArray,
    comments: [],
  };

  const ticketCollection = await tickets();
  const insertInfo = await ticketCollection.insertOne(newTicket);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: Could not add new ticket!";

  const userCollection = await users();
  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(customerID) },
    {
      $addToSet: {
        createdTickets: insertInfo.insertedId,
      },
    },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw "Error: could not update user successfully!";
  }

  await updateOwners(userCollection, insertInfo.insertedId, owners, owners);

  const newId = insertInfo.insertedId.toString();

  const ticket = await get(newId);
  return ticket;
};

//get all tickets
const getAll = async (isAdmin, userID) => {
  const ticketCollection = await tickets();
  let ticketList = await ticketCollection.find({}).toArray();
  if (!ticketList) throw "Error: Could not get all tickets!";
  ticketList = ticketList.map((element) => {
    return toStringify(element);
  });

  return filterResults(ticketList, isAdmin, userID);
};

//gets multiple tickets based on an array of ids
const getMultiple = async (ids) => {
  let retArr = [];
  for (const id of ids) {
    retArr.push(await get(id));
  }
  return retArr;
};

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
    _id: new ObjectId(id),
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
  customerID,
  id,
  name,
  status,
  description,
  priority,
  deadline,
  owners,
  category,
  role,
  tags
) => {
  id = helpers.checkId(id, "Ticket ID");
  const ticketCollection = await tickets();

  // validate name
  name = helpers.checkString(name, "Name");


  // validate description
  description = helpers.checkString(description, "Description");

  const curTicket = await get(id);


  // validate priority
  priority = helpers.checkString(priority, "Priority");

  if (
    priority != "Low" &&
    priority != "Normal" &&
    priority != "High" &&
    priority != "Critical"
  ) {
    throw new Error(
      "priority must be a string equal to, Low, Medium, High, or Critical"
    );
  }

  // validate status
  if(status){
    status = helpers.checkString(status, "Status");
    if (status != "To Do" && status != "In Progress" && status != "Completed" && status != "Problem") {
      throw new Error(
        "status must be a string equal to To Do, In Progress, or Completed"
      );
    }
  }else{
    status = curTicket.status;
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
    const deadlinePruned = new Date(deadline).getTime();
    if (deadlinePruned === NaN) {
      throw new Error("provided deadline is not a valid timestamp");
    } else if (deadlinePruned < createdOn && !helpers.isEqualDay(deadlinePruned, curTicket.deadline)) {
      throw new Error("provided deadline in the past");
    }
  }

  // validate customerID
  customerID = helpers.checkId(customerID, "Customer ID");
  customerID = new ObjectId(helpers.validateID(customerID));


   //validate owners
  if (owners && Array.isArray(owners)) {
    if(owners.length > 0){
      owners = helpers.checkIdArray(owners, "Owners ID Array");
    }
    for (let i = 0; i < owners.length; i++) {
      owners[i] = new ObjectId(helpers.validateID(owners[i]));
    }

  } else if(!owners && role == "admin"){
    owners = [];
  } else if(!owners && role == "user"){
    owners = curTicket.owners;
  }else if (owners.length != 0) {
    throw "Owners is not a valid array";
  }



  // validate category
  category = helpers.checkString(category, "Category");
  if (
    category != "Service Request" &&
    category != "Incident" &&
    category != "Problem" &&
    category != "Change Request"
  ) {
    throw new Error(
      "category must be a string equal to Service Request, Incident, Problem, or Change Request"
    );
  }

  var tagsArray;

  // check if tags are provided
  if (!tags || tags.length == 0) {
    tagsArray = [];
  } else {
    tags = helpers.checkString(tags, "Tags");
    tagsArray = tags.split(',');
    for(let tag in tagsArray){
      tag = tag.trim();
    }
  }

  let updatedTicket = {
    name: name,
    description: description,
    priority: priority,
    status: status,
    createdOn: curTicket.createdOn,
    deadline: new Date(deadline),
    customerID: curTicket.customerID,
    owners: owners,
    category: category,
    tags: tagsArray,
    comments: curTicket.comments,
  };

  const objID = new ObjectId(id);
  const updatedInfo = await ticketCollection.findOneAndUpdate(
    { _id: objID },
    { $set: updatedTicket },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw "Error: could not update ticket successfully!";
  }


  const userCollection = await users();
  await updateOwners(userCollection, objID, owners, curTicket.owners);

  return toStringify(updatedInfo.value);
};

const search = async (query, userID, isAdmin) => {
  if (!query) return getAll(isAdmin, userID);
  if (typeof query !== "string") throw `Error: Search Query must be a string!`;
  query = query.trim();
  if (query.length === 0) {
    return getAll(isAdmin. userID);
  }
  userID = helpers.checkId(userID, "User ID");

  const ticketCollection = await tickets();
  let foundTickets = await ticketCollection
    .find(
      { $text: { $search: `${query}`, $caseSensitive: false } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .toArray();

    foundTickets = foundTickets.map((element) => {
      return toStringify(element);
    });

    return filterResults(foundTickets, isAdmin, userID);
};

const filterResults = async (inputTickets, isAdmin, userID) => {
  let returnVal = [];

  if(!isAdmin) {
    for(let ticket of inputTickets) {
      if(ticket.customerID === userID) {
        returnVal.push(ticket);
      }

      if(ticket.owners.includes(userID)){
        returnVal.push(ticket);
      }
    }
  } else{
    returnVal = inputTickets;
  }

  return returnVal;
}

const updateOwners = async (userCollection, ticketID, newOwners, oldOwners) => {

  if(newOwners && oldOwners){
    var removeOldOwners;

    if(oldOwners.length > newOwners.length){
      var removeOwners = oldOwners.filter(x => !newOwners.includes(x));
      for (let owner of removeOwners) {
          removeOldOwners = await userCollection.findOneAndUpdate(
          { _id: new ObjectId(owner) },
          {
            $pull: {
              ticketsBeingWorkedOn: ticketID,
            },
          },
          { returnDocument: "after" }
        );

        if (removeOldOwners.lastErrorObject.n === 0) {
          throw "Error: could not update user successfully!";
        }
      }
    }
  }

  let updatedInfo;

  for (let owner of newOwners) {
    updatedInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(owner) },
      {
        $addToSet: {
          ticketsBeingWorkedOn: ticketID,
        },
      },
      { returnDocument: "after" }
    );

    if (updatedInfo.lastErrorObject.n === 0) {
      throw "Error: could not update user successfully!";
    }
  }
};

const toStringify = (ticket) => {
  ticket._id = ticket._id.toString();
  ticket.customerID = ticket.customerID.toString();
  if(ticket.owners){
    ticket.owners = ticket.owners.map((owner) => {
      return owner.toString();
    });
  }

  return ticket;
};

export default { create, getAll, get, getMultiple, remove, update, search };
