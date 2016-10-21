function playbackViewCtrl ( $scope, $state, $stateParams ) {
    $scope.isLyricEditorActive = false;

    if ( !$stateParams.recording ) {
        $state.go( 'library-view' );
    }
    
    $scope.openLyricsEditor = () => {
        $scope.isLyricEditorActive = !$scope.isLyricEditorActive;
    };
}

export default playbackViewCtrl;
