const User = require( './User' );
const Recording = require( './../recording/Recording' );

module.exports = {
  findOrCreateUser ( req, res ) {
      // create new user from req.body and save to mongoDB
      console.log( 'findOrCreateUser working!' );
      let profile = req.body;

      User.findOrCreate( { email: profile.email }, ( err, user ) => {
          if ( err ) {
              return res.status( 500 ).json( err );
          }
          User.findOneAndUpdate( { email: user.email }, { $set: {
                  firstName: profile.given_name
                  , lastName: profile.family_name
                  , profileImgUrl: profile.picture
              } }, ( err, user ) => {
              if ( err ) {
                  return res.status( 500 ).json( err );
              }
              if ( user.recordings !== [] ) {
                  User
                  .findOne( { email: profile.email } )
                  .populate( 'recordings' )
                  .exec( ( err, user ) => {
                    if ( err ) {
                      return res.status( 500 ).json( err );
                    }
                    return res.status( 200 ).json( user );
                  } );
              }
              else {
                  return res.status( 200 ).json( user );
              }
            } );
          } );
  }
  , getUsers ( req, res ) {
      console.log( 'getUsers working!' );
      User
        .find()
        .populate( 'recordings' )
        .exec( ( err, users ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            console.log( users );
            return res.status( 200 ).json( users );
        } );
  }
  , getUserById ( req, res ) {
      // find user by ID and return response to client-side
      console.log( 'getUserById working!' );
      User
        .findById( req.params.user_id )
        .populate( 'recordings' )
        .exec( ( err, users ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            console.log( user );
            return res.status( 200 ).json( user );
        } );
  }
  , updateUserById ( req, res ) {
      // find user by ID and set updated properties with req.body
      // return response containing updated user
      console.log( 'updateUserById working!' );
      User.findOneAndUpdate( { _id: req.params.user_id }, { $set: req.body }, ( err, user ) => {
          if ( err ) {
              console.log( err );
              return res.status( 500 ).json( err );
          }
          User.findById( user._id, ( err, user ) => {
              if ( err ) {
                  return res.status( 500 ).json( err );
              }
              return res.status( 200 ).json( user );
          } );
      } );
  }
  /****** STRETCH GOAL:  delete user *******/
  // , deleteUserById ( req, res ) {
  //     // find user by ID and delete from mongoDB
  //     User.findById( req.params.user_id, ( err, user ) => {
  //       // delete recordings from AmazonS3
  //       // deleting user from Auth0
  //       // delete recordings + whatever assets from MongoDB
  //     } );
  //     console.log( 'deleteUserById working!' );
  // }
}
