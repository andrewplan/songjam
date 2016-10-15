const userRoutes = require( './features/user/userRoutes' );
const recordingRoutes = require( './features/recording/recordingRoutes' );

module.exports = app => {
    userRoutes( app );
    recordingRoutes( app );
};
