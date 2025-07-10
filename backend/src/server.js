require('dotenv').config();
// require('./db/config');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/devices', require('./routes/device.routes'));
app.use('/api/device-profile', require('./routes/profile.routes'));
app.use('/api/address-maps', require('./routes/addressmap.routes'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${port}`)
})