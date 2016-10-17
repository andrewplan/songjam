const Recording = require( './Recording' );
const User = require( './../user/User' );

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
    , getRecordingsByUserId ( req, res ) {
        // declare empty array that will hold recordings
        // loop through recordings
        // if recording has req._id, push recording to array
        // return array to front end
        console.log( 'getRecordingsByUserId working!');
    }
    , getRecordingById ( req, res ) {
        // loop through recordings
        // if recording has req._id, return recording to front end
        console.log( 'getRecordingById working!');

        // Recording.findById( req.params.recording_id, ( err, recording ) => {
        //     if ( err ) {
        //         return res.status( 500 ).json( err );
        //     }
        //     return res.status( 200 ).json( recording );
        // } );
    }
    , deleteRecordingById ( req, res ) {
        // use location/Etag to delete from s3 bucket
        // remove recording from database
        console.log( 'deleteRecordingById working!' );
        Recording.remove( req.params.recording_id, ( err, response ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            return res.status( 200 ).json( response );
        } );
    }
    , addMarkerToRecording ( req, res ) {
        // find recording by id
        // push marker information to recording marker array
        console.log( 'addMarkerToRecording working!' );
    }
};
