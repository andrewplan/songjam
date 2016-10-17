
function userService ( $http ) {
    this.findOrCreateUser = function( profile ) {
        if ( !profile ) {
          profile = JSON.parse( localStorage.profile );
        }
        // console.log( profile );
        return $http.put( 'api/users', { email: profile.email } );
    };
}

export default userService;
