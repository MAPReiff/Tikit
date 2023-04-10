import {dbConnection, closeConnection} from './config/mongoConnection.js';
import comments from './data/comments.js';
import tickets from './data/tickets.js';
import users from './data/users.js';

const db = await dbConnection();
await db.dropDatabase();



/*** Just using this for testing purposes now. Will have to update with real data later-***/
try { 
    const ticket1 = await tickets.create("Testing Ticket", "This is a ticket for testing my database", "To Do", "Low", "", '641f8e18c0e10f3dd6d24eea', "Test Category", ["Databases", "Angular"],);
    const ticket2 = await tickets.create("Testing Ticket 2", "This is another ticket for testing my database", "In Progress", "Low", "", '641f8e18c0e10f3dd6d24eea', "Test Category", ["Databases"]);
    console.log(ticket2._id)
    const removed = await tickets.remove(ticket2._id);
    const getAll = await tickets.getAll();
    console.log(getAll)
} catch (e) { 
    console.log(e); 
}



await closeConnection();
