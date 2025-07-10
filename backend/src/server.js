require('dotenv').config();
// require('./db/config');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({
        msg: "hi"
    })
})

app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/device-profile', require('./routes/profileRoutes'));
app.use('/api/address-maps', require('./routes/addressMapRoutes'));




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${port}`)
})