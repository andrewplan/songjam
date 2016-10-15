const mongoose = require( 'mongoose' );

const Marker = new mongoose.Schema( {
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    position: { type: String }
    , notes: { type: String }
} );

const Recording = new mongoose.Schema( {
    userId: { type: mongoose.Schema.Types.ObjectId }
    , Etag: { type: String }
    , location: { type: String }
    , created: { type: Date, default: Date.now() }
    , markers: [ Marker ]
    , notes: { type: String }
} );

module.exports = mongoose.model( 'Recording', Recording );
