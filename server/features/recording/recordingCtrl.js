const Recording = require( './Recording' );

module.exports = {
    getRecordingsByUserId ( req, res ) {
        // declare empty array that will hold recordings
        // loop through recordings
        // if recording has req._id, push recording to array
        // return array to front end
    }
    , getRecordingById ( req, res ) {
        // loop through recordings
        // if recording has req._id, return recording to front end
        Recording.findById( req.params._id, ( err, recording ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            return res.status( 200 ).json( recording );
        } );
    }
    , deleteRecordingById ( req, res ) {
        // use location/Etag to delete from s3 bucket
        // remove recording from database
    }
    , addMarkerToRecording ( req, res ) {
        // find recording by id
        // push marker information to recording marker array
    }
};
