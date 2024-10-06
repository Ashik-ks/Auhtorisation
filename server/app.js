const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const router = require('./router/userRouter')
const authrouter = require('./router/authRouter')

const mongoConnect = require("../server/db/connect");
mongoConnect();

app.use(express.static('../client'))
app.use(express.json())
app.use('/uploads',express.static("./uploads"));
app.use(express.urlencoded({extended: true }));
app.use(express.json({ limit: "7mb" }));
app.use(router)
app.use(authrouter)

app.get('/test',(req,res) =>{
    res.status(200).send('Test successfull')
})

app.listen(process.env.PORT,() =>{
    console.log(`server is running at http://localhost:${process.env.PORT}`)
})