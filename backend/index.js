require('dotenv').config();
const express = require('express');
const app = express();
const authRouter = require('./routes/authRouter');
const cors = require('cors');


require('./models/dbConnection');
const PORT = process.env.PORT || 8080;


app.get('/', (req, res)=>{
    res.send('Hello World');
})

app.use(cors());
app.use('/auth', authRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
