
function userService ( $http ) {
    this.getUser = function() {
        return $http.get( '/user' );
    };
}

export default userService;
