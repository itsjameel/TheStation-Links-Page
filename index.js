require('dotenv').config()
const {google} = require('googleapis');
const express = require('express')
const app = express()
const port = 3000

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const auth = new google.auth.GoogleAuth({
    keyFile: "./credentials.json",
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
})


const googleSheets = google.sheets({version: 'v4', auth});
const client = auth.getClient();

const getLinksFromSheets = async (branch) => {
    const rows = await googleSheets.spreadsheets.values.get({auth, spreadsheetId: process.env.SPREADSHEET_ID, range: branch.capitalize()});
    return rows.data.values;
}


app.get('/', async (req, res) => {
    const rows = await getLinksFromSheets(req.query.branch)
    res.send(rows);
})



app.listen(port, () => {
    console.log(`Link Page Forwarder is listening at http://localhost:${port}`)
  })
