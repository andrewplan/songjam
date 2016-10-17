
function userService ( $http ) {
    let currentUser = {};

    this.getCurrentUser = () => {
        return currentUser;
    }

    this.findOrCreateUser = function( profile ) {
        if ( !profile ) {
          profile = JSON.parse( localStorage.profile );
        }
        // console.log( profile );
        return $http.put( 'api/users', profile ).then( user => {
            currentUser = user.data;
            console.log( 'user is ', currentUser, profile );
            // add code for error that in essence calls findOrCreateUser
        } );
    };

    this.updateCurrentUser = () => {

    }
}

export default userService;
