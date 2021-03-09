const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');

app.use(cors({origin: true, credentials: true}));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
if(mongoose.connect('mongodb+srv://Rizwan:Karachi123@pms.h1aco.mongodb.net/asaan-dukaan?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false})){
    console.log("Database connected successfully");
}
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Working!!!')
})

// app.get('/error', (req, res) => {
//     throw new Error('BROKEN')
// })

app.use(function (err, req, res, next) {
    console.error(err.stack)
    console.log(err.message)
    console.log(err)
    // res.status(500).send('Something broke!')
})

app.listen(port, () => console.log(`Example app listening at ${port}`))