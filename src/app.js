import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'auth0-lock';
import 'angular-lock';
import 'angular-jwt';

import './components/landing-page-view/landing-page.scss';
import landingPageHtml from './components/landing-page-view/landingPageTmpl.html'
import landingPageCtrl from './components/landing-page-view/landingPageCtrl'

import loginViewHtml from './components/login-view/login-view-tmpl.html'
import loginViewCtrl from './components/login-view/loginViewCtrl.js'

import mainViewHtml from './components/main-view/mainViewTmpl.html'
import mainViewCtrl from './components/main-view/mainViewCtrl.js'

import './components/library-view/library-view.scss';
import libraryViewHtml from './components/library-view/libraryViewTmpl.html'
import libraryViewCtrl from './components/library-view/libraryViewCtrl'

import recorderService from './services/recorderService.js'
import recorderViewDir from './components/recorder-view/recorderViewDirective'

import './components/playback-view/playback-view.scss';
import playbackViewHtml from './components/playback-view/playback-view-tmpl.html'
import playbackViewCtrl from './components/playback-view/playbackViewCtrl.js'

import topNavBar from './components/top-nav-bar-directive/topNavBarDirective';
import mp3PlayerDir from './components/mp3-player-directive/mp3PlayerDirective'
import playerDir from './components/player-directive/playerDirective'
import markersContainerDir from './components/markers-container-directive/markersContainerDirective'
import markerDir from './components/marker-directive/markerDirective'

import userService from './services/userService.js'
import authService from './services/authService.js'

angular.module( 'songJamApp', [ 'auth0.lock', 'angular-jwt', uiRouter, 'ngMaterial', ] )
    .run( function( $rootScope, $state, $timeout, authService, authManager, jwtHelper, lock ) {
        // Intercept the hash that comes back from authentication
        // to ensure the `authenticated` event fires
        lock.interceptHash();

        // Put the authService on $rootScope so its methods
        // can be accessed from the nav bar
        $rootScope.authService = authService;

        // Put the authService on $rootScope so its methods
        // can be accessed from the nav bar
        authService.registerAuthenticationListener();

        // Use the authManager from angular-jwt to check for
        // the user's authentication state when the page is
        // refreshed and maintain authentication
        authManager.checkAuthOnRefresh();

        // Listen for 401 unauthorized requests and redirect
        // the user to the login page
        authManager.redirectWhenUnauthenticated();

        $rootScope.$on('$stateChangeStart', function(event, to, toParams) {
           var token = localStorage.getItem('id_token');
           if (to.data && to.data.requiresLogin) {
               if (jwtHelper.isTokenExpired(token)) {
                  $timeout(function() {
                      $state.go('landing-page');
                  });
               }
           }
         });
    } )
    .value( '$anchorScroll', angular.noop )
    .service( 'authService', authService )
    .service( 'userService', userService )
    .service( 'recorderService', recorderService )
    .directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element(document.getElementsByClassName('library-view-wrapper-library-audio-wrapper')[0]).bind("scroll", function() {
             if (this.scrollTop > 460) {
                 angular.element(document.getElementsByClassName('top-nav-bar-main-view-wrapper')[0]).addClass( 'nav-bar-transition' );
                 angular.element(document.getElementsByClassName('top-nav-bar-main-view-wrapper-search-bar-icon')[0]).addClass( 'search-icon-transition' );
             } else {
                 angular.element(document.getElementsByClassName('top-nav-bar-main-view-wrapper')[0]).removeClass( 'nav-bar-transition' );
                 angular.element(document.getElementsByClassName('top-nav-bar-main-view-wrapper-search-bar-icon')[0]).removeClass( 'search-icon-transition' );
             }
            scope.$apply();
        } );
      };
    })
    .directive( 'topNavBar', topNavBar )
    .directive( 'mp3PlayerDir', mp3PlayerDir )
    .directive( 'markersContainerDir', markersContainerDir )
    .directive( 'markerDir', markerDir )
    .directive( 'playerDir', playerDir )
    .directive( 'recorderViewDir', recorderViewDir )
    .config( function( $httpProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, lockProvider, jwtOptionsProvider, jwtInterceptorProvider ) {

        lockProvider.init( {
          clientID: 'QWzoH8reUjNZRsM9pGqlZFEyUjnSoKuX',
          domain: 'songjam.auth0.com'
          , options: {
              autoclose: false
              , auth: {
                  redirect: false
              }
              , languageDictionary: {
                  emailInputPlaceholder: "something@youremail.com",
                  title: "SongJam"
              }
              , theme: {
                  primaryColor: '#F4511E'
              }
          }
        } );

        jwtOptionsProvider.config({
          tokenGetter: function() {
            return localStorage.getItem('id_token');
          }
        } );

        $httpProvider.interceptors.push('jwtInterceptor');


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
                , controller: mainViewCtrl
                , data: {
                    requiresLogin: true
                }
                , resolve: {
                    user ( userService, $stateParams ) {
                      return userService.findOrCreateUser( $stateParams.profile );
                    }
                }
                , params: {
                    profile: null
                }
            } )
            .state( 'login-view', {
                url: '/login'
                , template: loginViewHtml
                , controller: loginViewCtrl
            } )
            .state( 'library-view', {
                url: '/library'
                , parent: 'main-view'
                , template: libraryViewHtml
                , controller: libraryViewCtrl
                , resolve: {
                    user ( userService, $stateParams ) {
                      return userService.findOrCreateUser( $stateParams.profile );
                    }
                }
                , params: {
                    profile: null
                }
            } )
            .state( 'recorder-view', {
                url: '/recorder'
                , parent: 'main-view'
                , template: '<recorder-view-dir></recorder-view-dir>'
            } )
            .state( 'playback-view', {
                url: '/playback'
                , parent: 'main-view'
                , template: playbackViewHtml
                , controller: playbackViewCtrl
                , params: {
                    recording: null
                }
            } )
    } );
