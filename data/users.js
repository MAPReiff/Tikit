import * as helpers from "../helpers.js";
import { users, tickets } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const create = async (
  firstName,
  lastName,
  username,
  // hashedPassword,
  password,
  confirmPassword,
  email,
  role,
  title
) => {
  firstName = helpers.checkString(firstName, "First Name");
  lastName = helpers.checkString(lastName, "Last Name");
  username = helpers.checkString(username, "Username");

  password = helpers.checkString(password, "Password");
  confirmPassword = helpers.checkString(confirmPassword, "Confirm Password");
  if (!(password === confirmPassword)) {
    throw "Error: Passwords do not match!";
  }

  password = helpers.checkPassword(password);

  let hashedPassword = await bcrypt.hashSync(password, 15);

  email = helpers.validateEmail(email);
  role = helpers.checkString(role);
  role = helpers.validateRole(role); //check that role is admin or user
  title = helpers.checkString(title);
  let createdTickets = []; //creating user now so should always be empty in this function
  let ticketsBeingWorkedOn = []; //creating user now so should always be empty in this function
 
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    username: username.toLowerCase(),
    hashedPassword: hashedPassword,
    email: email.toLowerCase(),
    role: role,
    title: title,
    createdTickets: createdTickets,
    ticketsBeingWorkedOn: ticketsBeingWorkedOn,
  };
  const userCollection = await users();

  const existingEmailUser = await userCollection.findOne({
    email: {
      $eq: email.toLowerCase(),
    },
  });

  if (existingEmailUser != null) {
    throw new Error("a user with this email already exists");
  }

  const existingUsernameUser = await userCollection.findOne({
    username: {
      $eq: username.toLowerCase(),
    },
  });

  if (existingUsernameUser != null) {
    throw new Error("a user with this username already exists");
  }

  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: Could not add new user!";

  const ticketCollection = await tickets();
  await updateTickets(ticketCollection, insertInfo.insertedId, ticketsBeingWorkedOn, createdTickets);

  const newId = insertInfo.insertedId.toString();

  const user = await get(newId);

  return user;
};

const getAll = async () => {
  const userCollection = await users();
  let userList = await userCollection.find({}).toArray();
  if (!userList) throw "Error: Could not get all tickets!";
  userList = userList.map((element) => {
    return toStringify(element);
  });
  return userList;
};

const getMultiple = async (ids) => {
  let retArr = [];
  for (const id of ids) {
    retArr.push(await get(id));
  }
  return retArr;
};

const get = async (id) => {
  id = helpers.checkId(id, "User ID");
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (user === null) throw "Error: No user found with that ID";
  return toStringify(user);
};

const remove = async (id,hasChildren) => {
  id = helpers.checkId(id, "User ID");
  const userCollection = await users();
  const deletionInfo = await userCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (deletionInfo.lastErrorObject.n === 0) {
    throw `Could not delete user with id of ${id}`;
  }
  return `${deletionInfo.value.username} has been successfully deleted!`;
};

const update = async (
  id,
  firstName,
  lastName,
  username,
  email,
  role,
  title,
  createdTickets,
  ticketsBeingWorkedOn
) => {
  id = helpers.checkId(id, "User ID");
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (user === null) throw "Error: No user found with that ID";

  firstName = helpers.checkString(firstName, "First Name");
  lastName = helpers.checkString(lastName, "Last Name");
  username = helpers.checkString(username, "username");

  email = helpers.validateEmail(email);
  role = helpers.checkString(role);
  title = helpers.checkString(title);

  const curUser = await get(id);

  if (createdTickets && Array.isArray(createdTickets)) {
    for (let [index, ticket] of createdTickets.entries()) {
      createdTickets[index] = new ObjectId(helpers.validateID(ticket));
    }
  } else {
    throw "Created Tickets is not a valid array";
  }

  if (ticketsBeingWorkedOn && Array.isArray(ticketsBeingWorkedOn)) {
    for (let [index, ticket] of ticketsBeingWorkedOn.entries()) {
      ticketsBeingWorkedOn[index] = new ObjectId(helpers.validateID(ticket));
    }
  } else {
    throw "Owned Tickets is not a valid array";
  }



  let updatedUser = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    hashedPassword: curUser.hashedPassword,
    email: email,
    role: role,
    title: title,
    createdTickets: createdTickets,
    ticketsBeingWorkedOn: ticketsBeingWorkedOn
  };

  const objID = new ObjectId(id);
  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: objID},
    { $set: updatedUser },
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw "Error: could not update user successfully!";
  }

  const ticketCollection = await tickets();
  await updateTickets(ticketCollection, objID, ticketsBeingWorkedOn, createdTickets);

  return toStringify(updatedInfo.value);
};

const checkUser = async (email, password) => {
  email = helpers.validateEmail(email);
  password = helpers.checkString(password, "Password");

  const userCollection = await users();
  const existingUser = await userCollection.findOne({
    email: {
      $eq: email,
    },
  });

  if (existingUser === null) {
    throw "No user found with that email";
  }

  if (!(await bcrypt.compareSync(password, existingUser.hashedPassword))) {
    throw "Either the email address or password is invalid";
  }

  return {
    _id: existingUser._id.toString(),
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    username: existingUser.username,
    email: existingUser.email,
    role: existingUser.role,
    title: existingUser.title,
  };
};

const search = async (query) => {
  if (!query) return getAll();
  if (typeof query !== "string") throw `Error: Search Query must be a string!`;
  query = query.trim();
  if(query.length === 0){
    return getAll();
  }

  const userCollection = await users();
  return await (
  userCollection.find( 
    {$text: {$search: `${query}`, $caseSensitive: false}},
    { score: { $meta: "textScore" } }
  )
  .sort( { score: { $meta: "textScore" } } )
  ).toArray();
}


const editUserRoleTitle = async (userID, adminID, role, title) => {
  userID = helpers.checkId(userID, "User ID");
  adminID = helpers.checkId(adminID, "Admin ID");
  role = helpers.checkString(role);
  title = helpers.checkString(title);

  const userCollection = await users();

  const user = await userCollection.findOne({ _id: new ObjectId(userID) });
  if (user === null) throw "Error: No user found with that ID";

  const admin = await userCollection.findOne({ _id: new ObjectId(adminID) });

  if (admin === null) throw "Error: No user found with that ID";
  if (admin.role.toLowerCase() !== "admin") throw "Error: You are not an admin";

  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(userID) },
    { $set: { role: role, title: title } },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw "Error: could not update user successfully!";
  }

  return toStringify(updatedInfo.value);
};

const updateTickets = async (ticketCollection, userID, owned, created) => {
  let updatedInfo;

  for(let ownedUser of owned) {
    updatedInfo = await ticketCollection.findOneAndUpdate(
     { _id: new ObjectId(ownedUser) },
     { $addToSet: {
       owners: userID
      } 
     },
     { returnDocument: "after" }
   );

   if (updatedInfo.lastErrorObject.n === 0) {
     throw "Error: could not update user successfully!";
   }
 }
  
  for(let createdTickets of created) {
    updatedInfo = await ticketCollection.findOneAndUpdate(
     { _id: new ObjectId(createdTickets) },
     { $set: {
       customerID: userID
      } 
     },
     { returnDocument: "after" }
   );

   if (updatedInfo.lastErrorObject.n === 0) {
     throw "Error: could not update user successfully!";
   }
 }
}

const toStringify = (user) => {
  user._id = user._id.toString();
  user.createdTickets = user.createdTickets.map((ticket) => {
    return ticket.toString();
  });
  user.ticketsBeingWorkedOn = user.ticketsBeingWorkedOn.map((ticket) => {
    return ticket.toString();
  });

  return user;
}

export default {
  create,
  getAll,
  get,
  getMultiple,
  remove,
  update,
  checkUser,
  editUserRoleTitle,
  search
};
