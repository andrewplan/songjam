const userCtrl = require( './userCtrl' );

module.exports = app => {
    app.route( '/api/users' )
        .post( userCtrl.addUser );

    app.route( '/api/users/:user_id' )
        .get( userCtrl.getUserById )
        .put( userCtrl.updateUserById )
        .delete( userCtrl.deleteUserById );
}
