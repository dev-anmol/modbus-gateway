require('dotenv').config();
require('./db/config');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());


app.use('/api/device', require('./routes/device.routes'));
app.use('/api/device-profile', require('./routes/profile.routes'));
app.use('/api/address-maps', require('./routes/addressmap.routes'));
app.use('/api/mserver', require('./routes/mserver.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})