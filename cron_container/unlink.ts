import {connect} from '/usr/src/mongo-dependencies/database'
import Files from '/usr/src/mongo-dependencies/files'
import fs from 'fs'

connect();

async function fetchData() {
    const files = await Files.find({ 
        createdAt : { $lt: new Date(Date.now() - 1000)} 
    })
    if(files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                // await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch(err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
    console.log('Job done!');
    process.exit(1)
}

fetchData()
