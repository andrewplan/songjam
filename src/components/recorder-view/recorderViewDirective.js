import './recorder-view.scss';
import recorderViewHtml from './recorder-view-tmpl.html'
import recorderViewCtrl from './recorderViewCtrl.js'

function recorderViewDir () {
    return {
        restrict: 'EA'
        , replace: true
        , template: recorderViewHtml
        , controller: recorderViewCtrl
        , link: ( scope, elem, attrs ) => {
              angular
                  .element( elem[ 0 ].querySelector( '#songjam-heading' ) )
                  .addClass( 'color-header-recorder-view-default' );

              angular
                  .element( elem[ 0 ].querySelector( '#record-button' ) )
                  .on( 'click', () => {
                      elem
                          .addClass( 'recording-active' );
                      angular
                          .element( elem[ 0 ].querySelector( '#songjam-heading' ) )
                          .removeClass( 'color-header-recorder-view-default' );
                  } );

              angular
                  .element( elem[ 0 ].querySelector( '#stop-button' ) )
                  .on( 'click', () => {
                      elem
                          .removeClass( 'recording-active' );
                      angular
                          .element( elem[ 0 ].querySelector( '#songjam-heading' ) )
                          .addClass( 'color-header-recorder-view-default' );
                  } );
        }
    };
}

export default recorderViewDir;
