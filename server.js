const express = require( 'express' );
const BinaryServer = require( 'binaryjs' ).BinaryServer;
const fs = require( 'fs' );
const path = require( 'path' );
const { json } = require( 'body-parser' );
const cors = require( 'cors' );
const https = require( 'http' );
const serverConfig = require( './server/configs/server_config.js' );
const mongoose = require( 'mongoose' );
const mongoUri = "mongodb://localhost:27017/songjam";
const port = serverConfig.serverPort;

const googleSpeechConfig = require( './server/configs/googleSpeechConfig' );
const Speech = require('google-cloud/node_modules/@google-cloud/speech');
const projectId = googleSpeechConfig.project_id;
process.env.GOOGLE_APPLICATION_CREDENTIALS = './server/configs/googleSpeechCredentials.json';
const ldKey = fs.readFileSync( './../../etc/letsencrypt/live/songjam.us/privkey.pem' );
const ldCert = fs.readFileSync( './../../etc/letsencrypt/live/songjam.us/fullchain.pem' );

const AWS = require( 'aws-sdk' );
AWS.config.loadFromPath( './server/configs/awsConfig.json' );

const wav = require( 'wav' );
const lame = require( 'lame' );
const outFile = 'demo.wav';

const options = {
    key: ldKey
    , cert: ldCert
};

console.log( options );

const app = express();
const httpServer = http.createServer( app );
httpServer.listen( port, () => { console.log( `Listening on ${ port }` ) } );
const binaryServer = BinaryServer( { port: 9000, server: httpServer } );

app.use( cors() );
app.use( json() );
app.use( express.static( `${ __dirname }` + '/dist' ) );
app.use( express.static( `${ __dirname }` + '/server/user-audio-previews' ) );

require( './server/masterRoutes' )( app );

mongoose.connect( mongoUri );
mongoose.connection.once( 'open', () => { console.log( `Mongoose listening at ${ mongoUri }`) } );

binaryServer.on('connection', function(client) {
  console.log('new connection');

  var fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 44000,
    bitDepth: 16
  } );

  const parts = [];
  let mp3FileName;
  let mp3FilePath;

  client.on( 'stream', ( stream, meta ) => {

    console.log('new stream', meta );

    if ( meta.type === 'bookmarks' ) {
        stream.on( 'data', data => {
            parts.push( data );
            console.log( parts );
        } );
    }
    else if ( meta.type === 'audio' ) {
      mp3FileName = meta.user_id + '-preview.mp3';
      mp3FilePath = __dirname + '/server/user-audio-previews/' + mp3FileName;

      let streamClone = require( 'stream' );

      let stream1 = stream.pipe( new streamClone.PassThrough() );
      let stream2 = stream.pipe( new streamClone.PassThrough() );

      stream1.pipe(fileWriter);

      stream1.on( 'end', function() {
          fileWriter.end();
          console.log('wrote to file ' + outFile);

          const speechClient = Speech({
            projectId: projectId
          });

          const fileName = outFile;

          // The audio file's encoding and sample rate
          const options = {
            encoding: 'LINEAR16',
            sampleRate: 44000,
            profanityFilter: true
          };

          // Detects speech in the audio file
          speechClient.recognize( fileName, options, (err, result) => {
            if (err) {
              console.error(err);
              client.send( result, { type: 'transcription' } );
              return;
            }

            console.log(`Transcription: ${result}`);

            client.send( result, { type: 'transcription' } );
            fs.unlink( './' + outFile );
          });
      });

      stream2.pipe( new lame.Encoder( {
            channels: 1
            , bitDepth: 16
            , float: false

            , bitRate: 192
            , outSampleRate: 44100
            , mode: lame.STEREO
          } ) )
        .pipe( fs.createWriteStream( path.resolve( __dirname, 'server/user-audio-previews', mp3FileName ) ) )
        .on( 'close', () => {
            console.log( 'Done encoding to mp3' );
            client.send( { filename: mp3FileName, url: 'http://localhost:4000/' + mp3FileName }, { type: 'mp3PreviewUrl' } );
          } );
      }

      else if ( meta.type === 'upload-to-S3' ) {
          console.log( 'uploading to S3' );
          let s3obj = new AWS.S3();

          let body = fs.createReadStream( mp3FilePath );

          const params = {
              Bucket: 'songjam-recordings/' + meta.email
              , Key: meta.user_id + '_' + new Date().toISOString() + '.mp3'
              , Body: body
              , ACL: 'public-read'
          };

          s3obj.upload( params )
              .on( 'httpUploadProgress', evt => { console.log( evt ); } )
              .send( ( err, data ) => {
                  console.log( err, data );
                  client.send( data, { type: 's3Data' } );
                  fs.unlink( mp3FilePath );
                  client.close();
                } );
      }
    } );
    /*********** END client.on( 'stream' ) ************/

    // client.on( 'close', () => {
    //     console.log( 'mp3FilePath is ', mp3FilePath );
    //     fs.open( mp3FilePath, 'wx', ( err, fd ) => {
    //         if ( err ) {
    //             if ( err.code === 'EEXIST' ) {
    //                 console.error( mp3FilePath, ' exists, deleting now.' );
    //                 fs.unlink( mp3FilePath );
    //                 return;
    //             }
    //         }
    //         // else {
    //         //     throw err;
    //         // }
    //     } );
    // // stretch goal:  instead of deleting upon connection close, maybe pause stream somehow?
    // } );
});
