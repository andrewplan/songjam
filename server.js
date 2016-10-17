const express = require( 'express' );
const BinaryServer = require( 'binaryjs' ).BinaryServer;
const fs = require( 'fs' );
const path = require( 'path' );
const { json } = require( 'body-parser' );
const cors = require( 'cors' );

const mongoose = require( 'mongoose' );
const mongoUri = "mongodb://localhost:27017/songjam";

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
app.use( express.static( `${ __dirname }` + '/dist' ) );
app.use( express.static( `${ __dirname }` + '/server/user-audio-previews' ) );

require( './server/masterRoutes' )( app );


mongoose.connect( mongoUri );
mongoose.connection.once( 'open', () => { console.log( `Mongoose listening at ${ mongoUri }`) } );

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

    let mp3FileName = meta.user_id + '-preview.mp3';

    if ( meta.type === 'bookmarks' ) {

        stream.on( 'data', data => {
            parts.push( data );
            console.log( parts );
        } );
    }
    else if ( meta.type === 'audio' ) {

      let streamClone = require( 'stream' );

      let stream1 = stream.pipe( new streamClone.PassThrough() );
      let stream2 = stream.pipe( new streamClone.PassThrough() );
      let stream3 = stream.pipe( new streamClone.PassThrough() );

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

      stream3
        .pipe( new lame.Encoder( {
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

          let mp3FilePath = __dirname + '/server/user-audio-previews/' + mp3FileName;
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
                } );
      }
});
});
