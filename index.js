const express = require('express');
const ipfsClient = require('ipfs-http-client');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');

const ipfs = ipfsClient('http://localhost:5001');
const app = express();

app.use(fileUpload({createParentPath: true}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    return res.json({'msg': 'asshole'})
})

const addFile = async(req) => {
    const file = {
        content: Buffer.from(req.data)
    };
    const fileAdded = await ipfs.add(file)
    return fileAdded[0].hash;
}

app.post('/upload', async(req, res) => {
    try {
        if (!req.files) {
            res.send({status: false, message: 'No file uploaded'});
        } else {
            let avatar = req.files.image;
            const fileHash = await addFile(avatar);
            return res.json({
                'data': {
                    'link': `http://127.0.0.1:8080/ipfs/${fileHash}`
                }
            })
        }
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});



app.post('/uploadapk', async(req, res) => {
    console.log(req.files)
    try {
        if (!req.files) {
            res.send({status: false, message: 'No file uploaded'});
        } else {
            let avatar = req.files.apk;
            const fileHash = await addFile(avatar);
            return res.json({
                'data': {
                    'link': `http://127.0.0.1:8080/ipfs/${fileHash}`
                }
            })
        }
    } catch (err) {
        console.log(err)
        res
            .status(500)
            .send(err);
    }
});

app.listen(5005, () => {
    console.log('server started')
})
