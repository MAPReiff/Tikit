// I pledge my honor that I have abided by the Stevens Honor System.

import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Note: You will need to change the code below to have the collection required by the assignment!
export const tickets = getCollectionFn("tickets");
export const users = getCollectionFn("users");
// not sure whatelse we might need here
