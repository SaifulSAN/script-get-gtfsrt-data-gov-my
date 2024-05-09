const axios = require('axios');
const Schema = require('./gtfs-realtime_pb'); // generated with protoc-gen-js

/* 
To generate gtfs-realtime_pb.js I just dug around in node_modules for the protoc-gen-js package,
Looked for the protoc-gen-js.exe binary in there, moved my gtfs-realtime.proto file into the same directory as the binary
Then assuming you already have the protoc compiler (not the protoc-gen-js binary!!) ready in your PATH or whatever, run:

protoc --js_out=import_style=commonjs,binary:. gtfs-realtime.proto

This will spit out the gtfs-realtime_pb.js file.

Running the above command in any directory without protoc-gen-js.exe present will just throw an error as such:
>> protoc --js_out=import_style=commonjs,binary:. gtfs-realtime.proto
>> --js_out: protoc-gen-js: Plugin failed with status code 3221225785.
*/

async function main() {
    try {
        const response = await axios.get('https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl', { responseType: 'stream' });
    
        const stream = response.data;
    
        const bytes = await (async () => {
            const chunks = [];
    
            for await (const chunk of stream) {
                chunks.push(Buffer.from(chunk));
            }
    
            return Buffer.concat(chunks);
        })();
    
        const deserialized = Schema.FeedMessage.deserializeBinary(bytes).toObject();
        console.dir(deserialized, { depth: null, maxArrayLength: null });
    } catch (error) {
        console.log(error);
    }
}

main();