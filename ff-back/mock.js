const fs = require('fs');

const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,X-Api-Key,Authorization,X-CM-App,path-dest');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/all', (req, res) => {
    const months = [];
    let month;

    month = fs.readFileSync('./bucket/2022-06.json').toString();
    months.push(JSON.parse(month));

    res.send(months);
});

app.get('/:month', (req, res) => {
    const file = `./bucket/${req.params.month}.json`;
    let month = null;

    if (fs.existsSync(file)) {
        month = fs.readFileSync(file).toString();
        month = JSON.parse(month);
    }

    res.send(month);
});

app.post('/:month', (req, res) => {
    const file = `./bucket/${req.params.month}.json`;

    fs.writeFileSync(file, JSON.stringify(req.body));

    res.send(req.body);
});

app.listen(3000, () => console.log('Listening...'));