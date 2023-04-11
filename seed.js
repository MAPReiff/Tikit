import {dbConnection, closeConnection} from './config/mongoConnection.js';
import comments from './data/comments.js';
import tickets from './data/tickets.js';
import users from './data/users.js';

const db = await dbConnection();
await db.dropDatabase();



/*** Just using this for testing purposes now. Will have to update with real data later-***/
const ticket1 = await tickets.create("Testing Ticket", "This is a ticket for testing my database", "To Do", "Low", "", '641f8e18c0e10f3dd6d24eea',["641f8e18c0e10f3dd6d24eea", "641f8e18c0e10f3dd6d24eea"], "Test Category", ["Databases", "Angular"],);
const ticket2 = await tickets.create("Testing Ticket 2", "This is another ticket for testing my database", "In Progress", "Low", "", '641f8e18c0e10f3dd6d24eea',["641f8e18c0e10f3dd6d24eea", "641f8e18c0e10f3dd6d24eea"], "Test Category", ["Databases"]);
const ticket2Update = await tickets.update(ticket2._id, "Testing Ticket 2 Updated", "This is another ticket for testing my database, but with an update", "In Progress", "Low", "", "Test Category 2", ["Databases", "Mongo"]);

const user1 = await users.create("David","Bajo","dbajo1","password","dbajollar1@yahoo.com", "Admin","creator");
const user2 = await users.create("David1","Bajo","dbajo2","password","dbajollar1@hotmail.com", "User","Developer");
const user3 = await users.create("Ryan","Bajo","rbajo","password","rbajollar1@yahoo.com", "User","Developer");
const allUser = await users.getAll();
const getUser = await users.get(user1._id);
const removeUser = await users.remove(user1._id);
const updatedUser = await users.update(user3._id,"Ari","Bajo","abajo","rbajollar1@yahoo.com", "Admin","Lead");
//console.log(removeUser)

const comment1 = await comments.create(ticket2._id,user2._id,"this is my fist comment");
const comment2 = await comments.create(ticket2._id,user2._id,"this is my second comment");
const comment3 = await comments.create(ticket2._id,user2._id,"this is my third comment");
const getAllComments = await comments.getAll(ticket2._id)
const getComment = await comments.get(comment1._id);
const removeComment = await comments.remove(comment1._id);
console.log(removeComment)

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
