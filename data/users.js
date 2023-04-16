import * as helpers from "../helpers.js";
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';


const create = async (firstName,
    lastName,
    username,
    hashedPassword,
    email,
    role, //can be any string for now, will have the figure out the roles we define later
    title) => {

    firstName = helpers.checkString(firstName, "First Name");
    lastName = helpers.checkString(lastName, "First Name");
    username = helpers.checkString(username, "First Name");

    //will have to add logic for hashedPassword later, for now just pass string 'password'
    hashedPassword = helpers.checkString(hashedPassword, "Password")
    if (!(hashedPassword === "password")) throw "Error: Invalid Password"

    email = helpers.validateEmail(email);
    role = helpers.checkString(role);
    title = helpers.checkString(title);
    let createdTickets = []; //creating user now so should always be empty in this function 
    let ticketsBeingWorkedOn = []; //creating user now so should always be empty in this function 
    let commentsLeft = []; //creating user now so should always be empty in this function 

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        hashedPassword: hashedPassword,
        email: email,
        role: role,
        title: title,
        createdTickets: createdTickets,
        ticketsBeingWorkedOn: ticketsBeingWorkedOn,
        commentsLeft: commentsLeft
    };
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error: Could not add new user!';

    const newId = insertInfo.insertedId.toString();

    const user = await get(newId);
    return user;
}

const getAll = async () => {
    const userCollection = await users();
    let userList = await userCollection.find({}).toArray();
    if (!userList) throw 'Error: Could not get all tickets!';
    userList = userList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return userList;
}

const getMultiple = async (ids) => {
    let retArr = [];
    for(const id of ids){
        retArr.push(await get(id));
    }
    return retArr;
}

const get = async (id) => {
    id = helpers.checkId(id, "User ID");
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (user === null) throw "Error: No user found with that ID";
    user._id = user._id.toString();
    return user;
}

const remove = async (id) => {
    id = helpers.checkId(id, "User ID");
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (deletionInfo.lastErrorObject.n === 0) {
        throw `Could not delete user with id of ${id}`;
    }
    return `${deletionInfo.value.username} has been successfully deleted!`;
}

const update = async (id,
    firstName,
    lastName,
    username,
    email,
    role,
    title,
    createdTickets,
    ticketsBeingWorkedOn,
    commentsLeft) => {

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

    let updatedUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        hashedPassword: curUser.hashedPassword,
        email: email,
        role: role,
        title: title,
        createdTickets: curUser.createdTickets,
        ticketsBeingWorkedOn: curUser.ticketsBeingWorkedOn,
        commentsLeft: curUser.commentsLeft
    };

    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (updatedInfo.lastErrorObject.n === 0) {
        throw "Error: could not update user successfully!";
    }
    updatedInfo.value._id = updatedInfo.value._id.toString();
    return updatedInfo.value;
}


export default { create, getAll, get, getMultiple, remove, update }; 