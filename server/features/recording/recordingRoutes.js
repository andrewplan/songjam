const recordingCtrl = require( './recordingCtrl' );

module.exports = app => {
    app.route( '/api/recordings/' )
        .post( recordingCtrl.addRecording )
        .get( recordingCtrl.getAllRecordings );

    app.route( '/api/recordings/user_id/:user_id' )
        .get( recordingCtrl.getRecordingsByUserId );

    app.route( '/api/recordings/:recording_id' )
        .get( recordingCtrl.getRecordingById )
        .delete( recordingCtrl.deleteRecordingById )
        .put( recordingCtrl.addMarkerToRecording );
};
