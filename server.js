const express = require( 'express' );
const session = require( 'express-session' );
const BinaryServer = require( 'binaryjs' ).BinaryServer;
const fs = require( 'fs' );
const path = require( 'path' );
const { json } = require( 'body-parser' );
const cors = require( 'cors' );

const mongoose = require( 'mongoose' );
const mongoUri = "mongodb://localhost:27017/songjam";

const passport = require( 'passport' );
const Auth0Strategy = require( 'passport-auth0' );
const auth0Config = require( './server/configs/auth0Config' );
const mySecrets = require( './server/configs/mySecrets' );

const googleSpeechConfig = require( './server/configs/googleSpeechConfig' );
const Speech = require('google-cloud/node_modules/@google-cloud/speech');
const projectId = googleSpeechConfig.project_id;
process.env.GOOGLE_APPLICATION_CREDENTIALS = './server/configs/googleSpeechCredentials.json';

const AWS = require( 'aws-sdk' );
AWS.config.loadFromPath( './server/configs/awsConfig.json' );

const wav = require( 'wav' );
const lame = require( 'lame' );
const outFile = 'demo.wav';

const port = 4000;
const app = express();

app.listen( port, () => { console.log( `Listening on ${ port }` ) } );

app.use( json() );
app.use( session( { secret: mySecrets.secret } ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( express.static( `${ __dirname }/dist` ) );

require( './server/masterRoutes' )( app );

mongoose.connect( mongoUri );
mongoose.connection.once( 'open', () => { console.log( `Mongoose listening at ${ mongoUri }`) } );

/****** Passport authentication with Auth0 ******/
var strategy = new Auth0Strategy( {
     domain: auth0Config.domain
     , clientID: auth0Config.clientID
     , clientSecret: auth0Config.clientSecret
     , callbackURL: auth0Config.callbackURL
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile);
    }
);

passport.use(strategy);

app.get( '/auth/callback',
    passport.authenticate( 'auth0', { failureRedirect: '/#' }),
    function( req, res ) {
      if ( !req.user ) {
        throw new Error( 'user null' );
      }
      // console.log( 'req.user from CALLBACK is ', req.user );
      res.redirect( "/#/main/library");
    }
);

passport.serializeUser( ( user, done ) => done( null, user ) );
passport.deserializeUser( ( obj, done ) => done( null, obj ) );

app.get( '/user', ( req, res ) => {
    // console.log( 'req.user exists and is: ', req.user );
    res.send( req.user );
} );

// app.get('/login', (req, res) => {
//     res.render( 'account/login', { layout: 'layouts/empty' } );
// } );
// app.get('/login',
//     passport.authenticate( 'auth0', {}), function (req, res) {
//     res.redirect( "/" );
// } );

app.post( '/logout', ( req, res ) => {
    req.logout();
    res.redirect( '/dist/#' );
} );

/****** Audio streaming and speech recognition ******/
binaryServer = BinaryServer( { port: 9001 } );

binaryServer.on('connection', function(client) {
  console.log('new connection');

  var fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 44000,
    bitDepth: 16
  });

  const parts = [];

  client.on( 'stream', function(stream, meta) {
    console.log('new stream', meta );
    if ( meta.type === 'bookmarks' ) {

        stream.on( 'data', data => {
            parts.push( data );
            console.log( parts );
        } );
    }
    else {
      let streamClone = require( 'stream' );

      let stream1 = stream.pipe( new streamClone.PassThrough() );
      let stream2 = stream.pipe( new streamClone.PassThrough() );
      // let stream3 = stream.pipe( new streamClone.PassThrough() );

      stream1.pipe(fileWriter);

      stream1.on('end', function() {
          fileWriter.end();
          console.log('wrote to file ' + outFile);

          // Instantiates a client
          const speechClient = Speech({
            projectId: projectId
          });

          // The name of the audio file to transcribe
          const fileName = outFile;

          // The audio file's encoding and sample rate
          const options = {
            encoding: 'LINEAR16',
            sampleRate: 44000
          };

          // Detects speech in the audio file
          speechClient.recognize(fileName, options, (err, result) => {
            if (err) {
              console.error(err);
              return;
            }

            console.log(`Transcription: ${result}`);

            client.send( result, { type: 'transcription' } );
            fs.unlink( './' + outFile );
          });
      });

      let body = stream2.pipe( new lame.Encoder( {
            channels: 1
            , bitDepth: 16
            , float: false

            , bitRate: 192
            , outSampleRate: 44100
            , mode: lame.STEREO
          } ) )
        .on( 'close', () => { console.log( 'Done uploading to Amazon S3' ); } );

        let s3obj = new AWS.S3();

        const params = {
          Bucket: 'songjam-recordings'
          , Key: 'mySongJam2.mp3'
          , Body: body
          , ACL: 'public-read'
        };

        s3obj.upload( params )
            .on( 'httpUploadProgress', evt => { console.log( evt ); } )
            .send( ( err, data ) => {
                console.log( err, data );
                client.send( data, { type: 's3Data' } );
              } );


        // call mongoDB method to POST obj with S3 URL and transcription
            // then front end could make get request for the data posted to mongoDB
        // delete wav from server
      // });

      // stream3
      //   .pipe( new lame.Encoder( {
      //       channels: 1
      //       , bitDepth: 16
      //       , float: false
      //
      //       , bitRate: 192
      //       , outSampleRate: 44100
      //       , mode: lame.STEREO
      //     } ) )
      //   .pipe( fs.createWriteStream( path.resolve( __dirname, 'demo.mp3' ) ) )
      //   .on( 'close', () => { console.log( 'Done encoding to mp3' ); } );
    }
});
});
