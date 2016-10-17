
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
        return $http.put( 'api/users', { email: profile.email } ).then( user => {
            currentUser = user.data;
            console.log( 'user is ', currentUser );
        } );
    };

    this.updateCurrentUser = () => {

    }
}

export default userService;
