import * as helpers from "../helpers.js"; 
import {tickets} from '../config/mongoCollections.js';
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';




/*create a comment */
const create = async (author,
    content, 
    commentedOn, 
    replies) => {

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



export default {create, getAll, get, remove}; 