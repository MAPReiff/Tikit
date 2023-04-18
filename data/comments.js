import * as helpers from "../helpers.js";
import { tickets } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';





/*I think we should do two different create functions
One for creating a brand new comment on a ticket 
and one for adding a reply to a ticket
We might be able to do it in one but I think it is simpler to do two functions
will just do the create comment on ticket for now */
/*create a comment */
const create = async (
    ticketId,
    userId, //author of the ticket
    content) => {

    ticketId = helpers.checkId(ticketId, "Ticket ID");

    const ticketCollection = await tickets();
    const ticket = await ticketCollection.findOne({ _id: new ObjectId(ticketId) });
    if (ticket === null) throw "Error: No ticket found with that ID";

    // validate the user is a valid ID
    userId = helpers.checkId(userId, "User ID");
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (user === null) throw "Error: No user found with that ID";

    content = helpers.checkString(content, "Content");

    // // if this is a reply to another comment
    // if (replyToID) {
    //     // validate the reply to comment is a valid ID
    //     replyToID = helpers.checkId(replyToID, "Reply to comment ID");

    //     // search for comment ID under the ticket
    //     // append this reply to that comment
    // } // if this is on the base ticket
    // else {
    //     // append this to the ticket's comments
    // }

    let commentedOn = Date.now();

    let newComment = {
        _id: new ObjectId(),
        ticketID: ticketId,
        author: userId,
        content: content,
        commentedOn: commentedOn,
        replies: []
    };
    const updatedInfoTicket = await ticketCollection.findOneAndUpdate(
        { _id: new ObjectId(ticketId) },
        { $push: { comments: newComment } },
        { returnDocument: 'after' }
    );
    if (updatedInfoTicket.lastErrorObject.n === 0) {
        throw "Error: could not update ticket successfully!";
    }

    const updateInfoUser = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $push: { commentsLeft: {_id: newComment._id} } },
        { returnDocument: 'after' }
    );

    if (updateInfoUser.lastErrorObject.n === 0) {
        throw "Error: could not update user successfully!";
    }

    newComment._id = newComment._id.toString();
    return newComment;
}

/*get all comments for a specific ticket(id of ticket passed to this function) */
const getAll = async (ticketId) => {
    if (!(ticketId)) throw "Error: Must pass ticketId to function!";
    ticketId = helpers.checkId(ticketId)
    const ticketCollection = await tickets();
    const ticket = await ticketCollection.findOne({ _id: new ObjectId(ticketId) });
    if (ticket === null) throw "Error: No ticket found with that ID";

    const comments = await ticketCollection.findOne({ _id: new ObjectId(ticketId) }, { projection: { _id: 0, comments: 1 } });
    if (!comments) {
        throw 'Could not find tickets for id, ' + ticketId;
    }
    let commentsArr = comments["comments"];
    for (let i = 0; i < commentsArr.length; i++) {
        commentsArr[i]._id = commentsArr[i]._id.toString()
    }
    return commentsArr;
}

/*get a specific comment(pass comment id) */
const get = async (commentId) => {
    if (!(commentId)) throw "Error: Must pass commentId to function!";
    commentId = helpers.checkId(commentId);
    const ticketCollection = await tickets();
    let comments = await ticketCollection.find({ "comments": { $elemMatch: { "_id": new ObjectId(commentId) } } }).toArray();
    if (comments.length === 0) throw "Error: No comment found with that id!"

    let comment = {};
    for (let i = 0; i < comments[0].comments.length; i++) {
        let curID = comments[0].comments[i]._id;
        if (curID.toString() === commentId) {
            comment = comments[0].comments[i];
            comments[0].comments[i]._id = comments[0].comments[i]._id.toString();
            break;
        }
    }
    return comment;

}

/*remove a specific comment(pass comment id) */
const remove = async (commentId) => {
    commentId = helpers.checkId(commentId); 

    //first remove from ticket
    const ticketCollection = await tickets();
    let ticketId = await ticketCollection.find({ "comments" : {$elemMatch: { "_id": new ObjectId(commentId)}}}).toArray();
    if (ticketId === null) throw "Error: No ticket found with that comment ID";
    ticketId = ticketId[0]._id.toString(); 

    const updatedInfoTicket = await ticketCollection.findOneAndUpdate(
        {_id: new ObjectId(ticketId)},
        {$pull: {comments: {_id: new ObjectId(commentId)}}}, 
        {returnDocument: 'after'}
      );
      if (updatedInfoTicket.lastErrorObject.n === 0) {
        throw "Error: could not update ticket successfully!";
      }

    //then remove from user
      let userCollection = await users(); 
      let userId = await userCollection.find({ "commentsLeft" : {$elemMatch: { "_id": new ObjectId(commentId)}}}).toArray();
      if (userId === null) throw "Error: No ticket found with that comment ID";
      userId = userId[0]._id.toString(); 

      const updatedInfoUser = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(userId)},
        {$pull: {commentsLeft: {_id: new ObjectId(commentId)}}}, 
        {returnDocument: 'after'}
      );
      if (updatedInfoUser.lastErrorObject.n === 0) {
        throw "Error: could not update ticket successfully!";
      }

      return updatedInfoTicket.value;
}


//function to update content of given comment
const update = async (commentId, content) => { 
    if(!commentId || !content) throw "Error: Must pass neccessary fields to function!";
    commentId = helpers.checkId(commentId); 
    content = helpers.checkString(content);

    let ticketCollection = await tickets();

    let curComment = await ticketCollection.findOne({ "comments": { $elemMatch: { "_id": new ObjectId(commentId) } } });
    if(!curComment) throw "Error: Could not find comment with that ID!";
    
    const result = await ticketCollection.findOneAndUpdate({ "comments": { $elemMatch: { "_id": new ObjectId(commentId)}}}, {$set: {"comments.$.content": content}}, {returnDocument: 'after'});
        
    if(!result.value) throw "Error: Failed to update comment!"
    return result.value;
}



export default { create, getAll, get, remove, update }; 