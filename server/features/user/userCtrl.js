const User = require( './User' );

module.exports = {
  addUser ( req, res ) {
      // create new user from req.body and save to mongoDB
      console.log( 'addUser working!' );
  }
  , getUserById ( req, res ) {
      // find user by ID and return response to client-side
      console.log( 'getUserById working!' );
  }
  , updateUserById ( req, res ) {
      // find user by ID and set updated properties with req.body
      // return response containing updated user
      console.log( 'updateUserById working!' );
  }
  , deleteUserById ( req, res ) {
      // find user by ID and delete from mongoDB
      // delete recordings from Amazon S3
      // delete recordings from mongoDB
      console.log( 'deleteUserById working!' );
  }
}
