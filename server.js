const express = require( 'express' );
const BinaryServer = require( 'binaryjs' ).BinaryServer;
const fs = require( 'fs' );
const path = require( 'path' );
const { json } = require( 'body-parser' );

const googleSpeechConfig = require( './server/configs/googleSpeechConfig' );
const Speech = require('google-cloud/node_modules/@google-cloud/speech');
const projectId = googleSpeechConfig.project_id;
process.env.GOOGLE_APPLICATION_CREDENTIALS = './server/configs/googleSpeechCredentials.json';

const wav = require( 'wav' );
const lame = require( 'lame' );
const outFile = 'demo.wav';

const port = 4000;

const app = express();
// const server = require( 'http' ).createServer( app );
// const io = require( 'socket.io' ).listen( server );

app.listen( port, () => { console.log( `Listening on ${ port }` ) } );

app.use( json() );
app.use( express.static( `${ __dirname }` ) );

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
          });
      });

      stream2
        .pipe( new lame.Encoder( {
            channels: 1
            , bitDepth: 16
            , float: false

            , bitRate: 192
            , outSampleRate: 44100
            , mode: lame.STEREO
          } ) )
        .pipe( fs.createWriteStream( path.resolve( __dirname, 'demo.mp3' ) ) )
        .on( 'close', () => { console.log( 'Done encoding to mp3' ); } );
        // upload mp3 to Amazon S3
        // call mongoDB method to POST obj with S3 URL and transcription
            // then front end could make get request for the data posted to mongoDB
        // delete wav from server
      // });
    }
});
});
