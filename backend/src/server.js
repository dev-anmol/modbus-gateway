require('dotenv').config();
// require('./db/config');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({
        msg: "hi"
    })
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})