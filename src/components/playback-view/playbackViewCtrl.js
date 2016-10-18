function playbackViewCtrl ( $scope, $state, $stateParams ) {
    if ( !$stateParams.recording ) {
        $state.go( 'library-view' );
    }
}

export default playbackViewCtrl;
