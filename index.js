const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
const ErrlogModel = require('./models/errorLog');

app.use(cors({origin: true, credentials: true}));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
if(mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false})){
    console.log("Database connected successfully");
}
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Working!!!')
})

// app.get('/error', (req, res) => {
//     throw new Error('BROKEN')
// })

app.use(async function (err, req, res, next) {
    const date = new Date(Date.now());
                             // in activity model on job creation // 
    let newErr = new ErrlogModel({
        message: err.message,
        timeStamp: date.toUTCString(),
        apiPath: req.path,
        apiMethod: req.method,
        apiHost: req.hostname
    })
    let savedErr = await newErr.save();
    if (savedErr) {
        console.error("75", err.stack)
        console.log("76", err.message)
        console.log("77", err)
        res.status(200).send('Something broke!')
    }
    // res.status(500).send('Something broke!')
})

app.listen(port, () => console.log(`Example app listening at ${port}`))