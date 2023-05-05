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
    replyingToID, //if missing means, new comment added to ticket, otherwise if parentId(commentId) passed then it is reply to this comment
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
    
    let username = user.username
    content = helpers.checkString(content, "Content");
    let commentedOn = Date.now();

    replyingToID = helpers.checkString(replyingToID, "Replying to ID"); 
    if (replyingToID !== 'null') { 
        replyingToID = helpers.checkId(replyingToID, "Replying to ID")
        let replyingToIDcurComment = await ticketCollection.findOne({ "comments": { $elemMatch: { "_id": new ObjectId(replyingToID) } } });
        if(!replyingToIDcurComment) throw "Error: Could not find comment with that replying to ID!";
    }

    let newComment; 
    if (replyingToID !== 'null') { //comment is replying to comment
        replyingToID = helpers.checkId(replyingToID, "Replying to ID");
        let curComment = await ticketCollection.findOne({ "comments": { $elemMatch: { "_id": new ObjectId(replyingToID) } } });
        if(!curComment) throw "Error: Could not find comment with that ID!";
        newComment = {
            _id: new ObjectId(),
            ticketID: new ObjectId(ticketId),
            author: new ObjectId(userId),
            replyingToID: new ObjectId(replyingToID), 
            createdBy: username,
            content: content,
            commentedOn: commentedOn,
        };
    } else { //comment is new 
        newComment = {
            _id: new ObjectId(),
            ticketID: new ObjectId(ticketId),
            author: new ObjectId(userId),
            replyingToID: null, 
            createdBy: username,
            content: content,
            commentedOn: commentedOn,
        };
    }



    const updatedInfoTicket = await ticketCollection.findOneAndUpdate(
        { _id: new ObjectId(ticketId) },
        { $push: { comments: newComment } },
        { returnDocument: 'after' }
    );
    if (updatedInfoTicket.lastErrorObject.n === 0) {
        throw "Error: could not update ticket successfully!";
    }


    newComment._id = newComment._id.toString();
    return newComment;
}

/*get all comments for a specific ticket(id of ticket passed to this function) */
const getAll = async (ticketId,curUserID) => {
    if(!(curUserID))throw "Error: Must pass curUserID to function!";
    if (!(ticketId)) throw "Error: Must pass ticketId to function!";
    ticketId = helpers.checkId(ticketId)
    curUserID = helpers.checkId(curUserID)

    const ticketCollection = await tickets();
    const ticket = await ticketCollection.findOne({ _id: new ObjectId(ticketId) });
    if (ticket === null) throw "Error: No ticket found with that ID";

    const comments = await ticketCollection.findOne({ _id: new ObjectId(ticketId) }, { projection: { _id: 0, comments: 1 } ,$orderby:{commentedOn:-1}});
    if (!comments) {
        throw 'Could not find tickets for id, ' + ticketId;
    }
    let commentsArr = comments["comments"];
    for (let i = 0; i < commentsArr.length; i++) {
        commentsArr[i]._id = commentsArr[i]._id.toString()
    }

    let allComments = []; //need to reorder comments for view
    for(let i = 0; i < commentsArr.length; i++) { 
        if (!commentsArr[i].replyingToID) { 
            commentsArr[i].commentedOn = helpers.timeConverter(commentsArr[i].commentedOn);
            commentsArr[i]['allReplies'] = [];
            if(curUserID === commentsArr[i].author.toString()){ 
                commentsArr[i]['allowDelete'] = true;
            } 
            //console.log("Parent ID: " + commentsArr[i]._id)
            for(let j = 0; j < commentsArr.length; j++) { 
                //console.log("Child ID: " + commentsArr[j].replyingToID)
                if (commentsArr[j].replyingToID !== null && commentsArr[i]._id === commentsArr[j].replyingToID.toString()) { 
                    commentsArr[j].commentedOn = helpers.timeConverter(commentsArr[j].commentedOn);
                    if(curUserID === commentsArr[j].author.toString()){ 
                        commentsArr[j]['allowDelete'] = true;
                    }
                    commentsArr[j]['_id'] =commentsArr[j]['_id'].toString(); 
                    commentsArr[j]['ticketID'] = commentsArr[j]['ticketID'].toString();
                    commentsArr[j]['author'] =  commentsArr[j]['author'].toString();
                    commentsArr[j]['replyingToID'] = commentsArr[j]['replyingToID'].toString();
                    commentsArr[i]['allReplies'].push(commentsArr[j]);
                }
            }
            commentsArr[i]['_id'] =commentsArr[i]['_id'].toString(); 
            commentsArr[i]['ticketID'] = commentsArr[i]['ticketID'].toString();
            commentsArr[i]['author'] =  commentsArr[i]['author'].toString();
            allComments.push(commentsArr[i]); 
        }
    }
    //console.log(allComments)

    return allComments;
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
const remove = async (commentId,hasChildren) => {
    commentId = helpers.checkId(commentId); 

    //if (!hasChildren) throw `Error: You must supply hasChildren!`;
    if (typeof hasChildren !== "boolean") throw `Error: hasChildren must be a boolean!`;

    const ticketCollection = await tickets();
    let ticketId = await ticketCollection.find({ "comments" : {$elemMatch: { "_id": new ObjectId(commentId)}}}).toArray();
    if (ticketId === null) throw "Error: No ticket found with that comment ID";
    ticketId = ticketId[0]._id.toString(); 


    //first remove from replies
    if (hasChildren) { 
        ticketCollection.updateMany(
            { _id: new ObjectId(ticketId)},
            { $pull: {comments: {replyingToID: new ObjectId(commentId)}}}
        );
    } 


    const updatedInfoTicket = await ticketCollection.findOneAndUpdate(
        {_id: new ObjectId(ticketId)},
        {$pull: {comments: {_id: new ObjectId(commentId)}}}, 
        {returnDocument: 'after'}
      );
      if (updatedInfoTicket.lastErrorObject.n === 0) {
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