require("dotenv").config();

const express = require('express');
const hbs = require('hbs');
const upload = require("express-fileupload");
const util = require('util')
const fs = require('fs');
const convertapi = require('convertapi')('LXzkig38Uuyykstp');

const app = express();
app.use(upload());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    res.render("index.hbs");
})

app.get('/word', (req, res) => {
    res.render("word.hbs");
})

app.get('/spreadsheet', (req, res) => {
    res.render("spreadsheet.hbs");
})

app.get('/jpg', (req, res) => {
    res.render("jpg.hbs");
})

app.get('/png', (req, res) => {
    res.render("png.hbs");
})

app.post('/upload', function(req, res, next) {

    if (req.files.wordFile) {

        const file = req.files.wordFile;
        const name = file.name;
        const type = file.mimetype;
        const uploadpath = __dirname + '/uploads/' + name;

        if (type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            //validation on backend side (there is also front-end validation for doc type)
            //OVDJE RADI
            file.mv(uploadpath, function(err) {
                if (err) {
                    console.log(err);
                    res.send({file_uploaded:"false"});
                } else {
                    convertapi.convert('pdf', { File: `uploads/${name}` }, 'docx')
                        .then(result => {
                           
                            result.saveFiles(`storage/`)
                            let fileName = result.response.Files[0].FileName;
                            let url = result.response.Files[0].Url;
                            deleteFile(name); //delete docx file from server storage
                            res.send({ fileName, url}); //frontu saljemo ime fajla, download link i br konvertovanja
                        })
                        .catch(error => {
                            console.log(error);
                            res.send({ success: "false" })
                        })
                }
            });
        } else {
            res.send("Bad extension!");
        }
    } else {
        res.send("No File selected !");
        res.end();
    };
})

app.post('/uploadSpreadsheet', function(req, res, next) {

    if (req.files.spreadsheetFile) {

        const file = req.files.spreadsheetFile;
        const name = file.name;
        const type = file.mimetype;
        const uploadpath = __dirname + '/uploads/' + name;

        if (type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            //validation on backend side (there is also front-end validation for doc type)
            //OVDJE RADI
            file.mv(uploadpath, function(err) {
                if (err) {
                    console.log(err);
                    res.send({file_uploaded:"false"});
                } else {
                    convertapi.convert('pdf', { File: `uploads/${name}` }, 'xlsx')
                        .then(result => {
                           
                            result.saveFiles(`storage/`)
                            let fileName = result.response.Files[0].FileName;
                            let url = result.response.Files[0].Url;
                            deleteFile(name); //delete docx file from server storage
                            res.send({ fileName, url }); //frontu saljemo ime fajla, download link i br konvertovanja
                        })
                        .catch(error => {
                            console.log(error);
                            res.send({ success: "false" })
                        })
                }
            });
        } else {
            res.send("Bad extension!");
        }
    } else {
        res.send("No File selected !");
        res.end();
    };
})

app.post('/uploadpng', function(req, res, next) {

    if (req.files.pngFile) {

        const file = req.files.pngFile;
        const name = file.name;
        const type = file.mimetype;
        const uploadpath = __dirname + '/uploads/' + name;

        if (type == "image/png") {
            //validation on backend side (there is also front-end validation for doc type)
            //OVDJE RADI
            file.mv(uploadpath, function(err) {
                if (err) {
                    console.log(err);
                    res.send({file_uploaded:"false"});
                } else {
                    convertapi.convert('pdf', { File: `uploads/${name}` }, 'png')
                        .then(result => {
                           
                            result.saveFiles(`storage/`)
                            let fileName = result.response.Files[0].FileName;
                            let url = result.response.Files[0].Url;
                            deleteFile(name); //delete docx file from server storage
                            res.send({ fileName, url }); //frontu saljemo ime fajla, download link i br konvertovanja
                        })
                        .catch(error => {
                            console.log(error);
                            res.send({ success: "false" })
                        })
                }
            });
        } else {
            res.send("Bad extension!");
        }
    } else {
        res.send("No File selected !");
        res.end();
    };
})

app.post('/uploadjpg', function(req, res, next) {

    if (req.files.jpgFile) {

        const file = req.files.jpgFile;
        const name = file.name;
        const type = file.mimetype;
        const uploadpath = __dirname + '/uploads/' + name;

        if (type == "image/jpeg") {
            //validation on backend side (there is also front-end validation for doc type)
            //OVDJE RADI
            file.mv(uploadpath, function(err) {
                if (err) {
                    console.log(err);
                    res.send({file_uploaded:"false"});
                } else {
                    convertapi.convert('pdf', { File: `uploads/${name}` }, 'xlsx')
                        .then(result => {
                           
                            result.saveFiles(`storage/`)
                            let fileName = result.response.Files[0].FileName;
                            let url = result.response.Files[0].Url;
                            deleteFile(name); //delete docx file from server storage
                            res.send({ fileName, url }); //frontu saljemo ime fajla, download link i br konvertovanja
                        })
                        .catch(error => {
                            console.log(error);
                            res.send({ success: "false" })
                        })
                }
            });
        } else {
            res.send("Bad extension!");
        }
    } else {
        res.send("No File selected !");
        res.end();
    };
})


function deleteFile(fileName) {
    try {
        fs.unlinkSync(`uploads/${fileName}`);
    } catch (err) {

    }
}

app.listen(3000, (err) => {
    if(err){
        console.log(err)
    } else {
        console.log(`Server listening at port 3000 ...\n`);    
    }
});