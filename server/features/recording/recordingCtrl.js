const Recording = require( './Recording' );
const User = require( './../user/User' );

const AWS = require( 'aws-sdk' );
AWS.config.loadFromPath( './server/configs/awsConfig.json' );

module.exports = {
    addRecordingToUser ( req, res ) {
        // make new Recording doc from req.body and save to database
        // add objectId of new recording to user
        console.log( 'addRecordingToUser working!' );
        new Recording( req.body ).save( ( err, recording ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            User.findByIdAndUpdate( recording.userId, { $push: { recordings: recording._id } }, ( err, user ) => {
                if ( err ) {
                    return res.status( 500 ).json( err );
                }
                User
                    .findOne( { _id: user._id } )
                    .populate( 'recordings' )
                    .exec( ( err, user ) => {
                        if ( err ) {
                            return res.status( 500 ).json( err );
                        }
                        return res.status( 200 ).json( user );
                    } )
                } );
            } );
    }
    , getAllRecordings ( req, res ) {
        // for debugging purposes only
        console.log( 'getAllRecordings working!' );
        Recording.find( {}, ( err, recordings ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            return res.status( 200 ).json( recordings );
        } );
    }
    , getRecordingById ( req, res ) {
        // loop through recordings
        // if recording has req._id, return recording to front end
        console.log( 'getRecordingById working!');

        Recording.findById( req.params.recording_id, ( err, recording ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            return res.status( 200 ).json( recording );
        } );
    }
    , deleteRecordingById ( req, res ) {
        console.log( 'deleteRecordingById working!, req.params.recording_id is ', req.params.recording_id );
        Recording.findById( req.params.recording_id, ( err, recording ) => {
            if ( err ) {
                console.log( 'Error in Recording.findById' );
                return res.status( 500 ).json( err );
            }
            console.log( 'Recording.findById is working, recording is ', recording );

          User.findById( recording.userId, ( err, user ) => {
              if ( err ) {
                  return res.status( 500 ).json( err );
              }
              let myUser = user;
              console.log( 'User.findById is working! User is ', myUser );
              for ( let i = 0; i < myUser.recordings.length; i++ ) {
                  if ( recording._id.toString() === myUser.recordings[ i ].toString() ) {
                      console.log( 'myUser.recordings is ', myUser.recordings );
                      myUser.recordings.splice( i, 1 );
                  }
                  else {
                      console.log( 'Recording id not found in user.' );
                  }
              }

              saveUser( myUser, req, res );
              deleteFromS3( recording );

              function saveUser( userToSave, req, res ) {
                userToSave.save( ( err, result ) => {
                  if ( err ) {
                    return res.status( 500 ).json( err );
                  }
                  return res.status( 200 ).json( user );
                } );
              }

              function deleteFromS3( recording ) {
                  let s3obj = new AWS.S3();

                  const params = {
                      Bucket: recording.s3Bucket
                      , Key: recording.s3Key
                  };

                  s3obj.deleteObject( params, ( err, data ) => {
                      if ( err ) {
                          console.log( 's3 delete encountered an error: ', err, err.stack );
                      }
                      else {
                          console.log( 's3 delete worked: ', data );
                      }
                  } );
              }

          } );
      } );

    }
    , addMarkerToRecording ( req, res ) {
        // find recording by id
        // push marker information to recording marker array
        console.log( 'addMarkerToRecording working!' );

        Recording.findByIdAndUpdate( req.params.recording_id, { $push: { markers: req.body } }, ( err, recording ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            Recording.findById( recording._id, ( err, recording ) => {
                if ( err ) {
                    return res.status( 500 ).json( err );
                }
                return res.status( 201 ).json( recording );
            } );
        } );
    }
};
