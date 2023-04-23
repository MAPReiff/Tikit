// I pledge my honor that I have abided by the Stevens Honor System.

import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection, fieldObj) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
      await createIndexes(_col, fieldObj, collection);
    }

    return _col;
  };
};

export const createIndexes = async (db, fieldObj, name) => {
  if(db){
    db.createIndexes([{
      key: fieldObj,
      name: name
    }]);
  }
};

// Note: You will need to change the code below to have the collection required by the assignment!
export const tickets = getCollectionFn("tickets", {
  name: "text",
  description: "text",
});
export const users = getCollectionFn("users", {
  firstName: "text",
  lastName: "text",
  username: "text",
  email: "text"
});
// not sure whatelse we might need here
