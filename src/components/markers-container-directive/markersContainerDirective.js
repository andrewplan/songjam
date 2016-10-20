function markersContainerDir() {
    return {
        restrict: 'EA'
        , scope: {
            bookmarks: '='
            , duration: '='
            , recording: '='
            , waveformWidth: '='
        }
    }
}

export default markersContainerDir;
