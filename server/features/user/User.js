const mongoose = require( 'mongoose' );

const User = new mongoose.Schema( {
    // userId: { type: mongoose.Schema.Types.ObjectId }
    userName: { type: String }
    , firstName: { type: String }
    , lastName: { type: String }
    , city: { type: String }
    , country: { type: String }
    , bio: { type: String }
    , links: [ { type: String } ]
    , recordings: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Recording' } ]
    , profileImgUrl: { type: String }
    , bgImgUrl: { type: String }
} );

module.exports = mongoose.model( 'User', User );
