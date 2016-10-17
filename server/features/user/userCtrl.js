const User = require( './User' );


module.exports = {
  findOrCreateUser ( req, res ) {
      // create new user from req.body and save to mongoDB
      console.log( 'findOrCreateUser working!' );
      User
        .findOrCreate( { email: req.body.email }, ( err, user ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            if ( user.recordings !== [] ) {
                User
                  .findOne( { email: user.email } )
                  .populate( 'recordings' )
                  .exec( ( err, user ) => {
                      if ( err ) {
                          return res.status( 500 ).json( err );
                      }
                      return res.status( 200 ).json( user );
                  } )
            }
            else {
                return res.status( 200 ).json( user );
            }
      } );
  }
  , findUser ( req, res ) {
      // create new user from req.body and save to mongoDB
      console.log( 'findUser working!' );
      User
        .find( { email: req.body.email }, ( err, user ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            console.log( err, user );
            return res.status( 200 ).json( user );
      } );
  }
  , getUsers ( req, res ) {
      console.log( 'getUsers working!' );
      User.find( {}, ( err, response ) => {
          if ( err ) {
              return res.send( 500 ).json( err );
          }
          console.log( response );
          return res.status( 200 ).json( response );
      } );
  }
  , getUserById ( req, res ) {
      // find user by ID and return response to client-side
      console.log( 'getUserById working!' );

  }
  , updateUserById ( req, res ) {
      // find user by ID and set updated properties with req.body
      // return response containing updated user
      console.log( 'updateUserById working!' );
      // User.findByIdAndUpdate( req.params.user_id,  )
  }
  , deleteUserById ( req, res ) {
      // find user by ID and delete from mongoDB
      // delete recordings from Amazon S3
      // delete recordings from mongoDB
      console.log( 'deleteUserById working!' );
  }
}
