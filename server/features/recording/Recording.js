const mongoose = require( 'mongoose' );

const Marker = new mongoose.Schema( {
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    position: { type: Number }
    , notes: { type: String }
} );

const Recording = new mongoose.Schema( {
    userId: { type: mongoose.Schema.Types.ObjectId }
    , s3ETag: { type: String }
    , s3Location: { type: String }
    , s3Bucket: { type: String }
    , s3Key: { type: String }
    , created: { type: Date, default: Date.now() }
    , markers: [ Marker ]
    , notes: { type: String }
    , favorited: { type: Boolean, default: false }
} );

module.exports = mongoose.model( 'Recording', Recording );
