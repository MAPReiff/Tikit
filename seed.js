import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import comments from "./data/comments.js";
import tickets from "./data/tickets.js";
import users from "./data/users.js";

const db = await dbConnection();
await db.dropDatabase();

/*** Just using this for testing purposes now. Will have to update with real data later-***/
const user1 = await users.create(
  "David",
  "Bajo",
  "dbajo1",
  "Password!23",
  "Password!23",
  "dbajollar1@yahoo.com",
  "Admin",
  "creator"
);
const user2 = await users.create(
  "David1",
  "Bajo",
  "dbajo2",
  "Password!23",
  "Password!23",
  "dbajollar1@hotmail.com",
  "User",
  "Developer"
);
const user3 = await users.create(
  "Ryan",
  "Bajo",
  "rbajo",
  "Password!23",
  "Password!23",
  "rbajollar1@yahoo.com",
  "User",
  "Developer"
);

const ticket1 = await tickets.create(
  "Testing Ticket",
  "This is a ticket for testing my database",
  "To Do",
  "Low",
  "",
  user3._id,
  [user2._id, user3._id],
  "Test Category",
  ["Databases", "Angular"]
);
const ticket2 = await tickets.create(
  "Testing Ticket 2",
  "This is another ticket for testing my database",
  "In Progress",
  "Low",
  "",
  user2._id,
  [user3._id],
  "Test Category",
  ["Databases"]
);
let newOwners = [];// = ticket2.owners.map((owner) => {return owner.toString() });
newOwners.push(user3._id.toString());
const ticket2Update = await tickets.update(
  ticket2._id,
  "Testing Ticket 2 Updated",
  "This is another ticket for testing my database, but with an update",
  "In Progress",
  "Low",
  "",
  newOwners,
  "Test Category 2",
  ["Databases", "Mongo"]
);

const allUser = await users.getAll();
const getUser = await users.get(user1._id);
const removeUser = await users.remove(user1._id);
const updatedUser = await users.update(
  user3._id,
  "Ari",
  "Bajo",
  "abajo",
  "rbajollar1@yahoo.com",
  "Admin",
  "Lead",
  [ticket1._id],
  [ticket1._id, ticket2._id],
  []
);
//console.log(removeUser)

const comment1 = await comments.create(
  ticket2._id,
  user2._id,
  "this is my fist comment"
);
const comment2 = await comments.create(
  ticket2._id,
  user2._id,
  "this is my second comment"
);
const comment3 = await comments.create(
  ticket2._id,
  user2._id,
  "this is my third comment"
);
const getAllComments = await comments.getAll(ticket2._id);
const getComment = await comments.get(comment1._id);
const removeComment = await comments.remove(comment1._id);

const updatedComment = await comments.update(
  comment2._id,
  "This is my updated second comment"
);
//console.log(updatedComment);
let cursor = await tickets.search("2");
//console.log(cursor);
const ticket3 = await tickets.create(
  "ith with With handlebar 3",
  "This is another ticket for testing my database",
  "In Progress",
  "Low",
  "",
  user2._id,
  [user3._id],
  "Test Category",
  ["Databases"]
);
cursor = await tickets.search("handlebar");
//console.log(cursor);
//console.log(ticket2Update);
// try {
//     //console.log(ticket2._id)
//     //const removed = await tickets.remove(ticket2._id);
//     const getAll = await tickets.getAll();
//     console.log(getAll)
// } catch (e) {
//     console.log(e);
// }

await closeConnection();
