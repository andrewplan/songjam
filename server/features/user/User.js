const mongoose = require( 'mongoose' );
const findOrCreate = require( 'mongoose-findorcreate' );

const User = new mongoose.Schema( {
    // userId: { type: mongoose.Schema.Types.ObjectId }
    userName: { type: String }
    , email: { type: String, required: true }
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

User.plugin( findOrCreate );

module.exports = mongoose.model( 'User', User );
