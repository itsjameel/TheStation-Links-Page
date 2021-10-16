require('dotenv').config()
const express = require('express')
const https = require('https')
const fs = require('fs')
const {google} = require('googleapis');


const app = express()
const port = process.env.PORT

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
})


const googleSheets = google.sheets({version: 'v4', auth});
const client = auth.getClient();

const getLinksFromSheets = async (branch) => {
    const rows = await googleSheets.spreadsheets.values.get({
        auth, spreadsheetId: process.env.SPREADSHEET_ID,
        range: branch.capitalize()
    });
    return rows.data.values;
}


app.get('/', async (req, res) => {
    const rows = await getLinksFromSheets(req.query.branch)
    res.send(rows);
})


// serve the API with signed certificate on 443 (SSL/HTTPS) port
const httpsServer = https.createServer({
    key: fs.readFileSync(process.env.KEY_LOCATION),
    cert: fs.readFileSync(process.env.CERT_LOCATION),
  }, app);
  
httpsServer.listen(port, () => {
    console.log('HTTPS Server running on port ' + port.toString());
});