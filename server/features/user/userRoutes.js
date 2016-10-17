const userCtrl = require( './userCtrl' );

module.exports = app => {
    app.route( '/api/users' )
        .get( userCtrl.getUsers )
        .put( userCtrl.findOrCreateUser );

    app.route( '/api/users/:user_id' )
        .get( userCtrl.getUserById )
        .put( userCtrl.updateUserById );
        // .delete( userCtrl.deleteUserById );
};
