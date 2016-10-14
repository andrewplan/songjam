import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';

// angular-recorder
import './components/angular-recorder/dist/angular-audio-recorder.js'
import 'lamejs';

// wavesurfer
// import './node_modules/wavesurfer.js/dist/wavesurfer.js'

// Landing page view
import './components/landing-page-view/landing-page.scss';
import landingPageHtml from './components/landing-page-view/landingPageTmpl.html'
import landingPageCtrl from './components/landing-page-view/landingPageCtrl'

// Main view
import mainViewHtml from './components/main-view/mainViewTmpl.html'

// Library view
import './components/library-view/library-view.scss';
import libraryViewHtml from './components/library-view/libraryViewTmpl.html'
import libraryViewCtrl from './components/library-view/libraryViewCtrl'

// Recorder view
import './components/recorder-view/recorder-view.scss';
import recorderViewHtml from './components/recorder-view/recorder-view-tmpl.html'
import recorderViewCtrl from './components/recorder-view/recorderViewCtrl.js'

// Playback view
import './components/playback-view/playback-view.scss';
import playbackViewHtml from './components/playback-view/playback-view-tmpl.html'
import playbackViewCtrl from './components/playback-view/playbackViewCtrl.js'

// Nav bar directive
import topNavBar from './components/top-nav-bar-directive/topNavBarDirective';

// Audio directive
import recordingDir from './components/audio-directive/audioDirective'

// Player directive
import playerDir from './components/player-directive/playerDirective'

angular.module( 'songJamApp', [ uiRouter, 'ngMaterial', ] )
    .directive( 'topNavBar', topNavBar )
    .directive( 'recordingDir', recordingDir )
    .directive( 'playerDir', playerDir )
    .filter( 'secondsToDateTime', [function() {
        return seconds => {
            let d = new Date( '0, 0, 0, 0, 0, 0, 0' );
            d.setSeconds( seconds );
            return d;
        }
    }] )
    .config( function( $stateProvider, $urlRouterProvider, $mdThemingProvider ) {
        $mdThemingProvider.theme( 'default' )
            .primaryPalette( 'deep-orange' )
            .accentPalette( 'yellow' )

        $urlRouterProvider.otherwise( '/' );

        $stateProvider
            .state( 'landing-page', {
                url: '/'
                , template: landingPageHtml
                , controller: landingPageCtrl
            } )
            .state( 'main-view', {
                url: '/main'
                , template: mainViewHtml
            } )
            .state( 'library-view', {
                url: '/library'
                , parent: 'main-view'
                , template: libraryViewHtml
                , controller: libraryViewCtrl
            } )
            .state( 'recorder', {
                url: '/recorder'
                , parent: 'main-view'
                , template: recorderViewHtml
                , controller: recorderViewCtrl
            } )
            .state( 'playback-view', {
                url: '/playback'
                , parent: 'main-view'
                , template: playbackViewHtml
                // , controller: playbackViewCtrl
            } )
    } );
