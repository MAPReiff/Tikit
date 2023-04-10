import * as helpers from "../helpers.js";
import { tickets } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';




/*create a comment */
const create = async (
    ticketID,
    author,
    content,
    commentedOn,
    replies) => {
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

}

/*get all comments for a specific ticket(id of ticket passed to this function) */
const getAll = async (id) => {

}

/*get a specific comment(pass comment id) */
const get = async (id) => {

}

/*remove a specific comment(pass comment id) */
const remove = async (id) => {

}



export default { create, getAll, get, remove }; 