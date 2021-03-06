function markerDir() {
    return {
        restrict: 'EA'
        , scope: {
            bookmark: '='
            , duration: '='
            , marker: '='
            , waveformWidth: '='
        }
        , link: ( scope, elem, attrs ) => {
              scope.$watchGroup( [ 'duration', 'marker', 'bookmark', 'waveformWidth' ], () => {
                  let markerPosition;
                  if ( scope.bookmark ) {
                    markerPosition = scope.bookmark.position;
                  }
                  else if ( scope.marker ){
                    markerPosition = scope.marker.position;
                  }
                  let markerPositionEm = ( markerPosition / scope.duration ) * scope.waveformWidth;
                  angular.element( elem[ 0 ] ).css( { 'position': 'absolute', 'left': markerPositionEm + 'em' } );
              }, true );

        }
    }
}

export default markerDir;
