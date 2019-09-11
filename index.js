const express = require('express');
const mongoose = require('mongoose');
const avitoChatRoutes = require('./routes/avitoChat');

const app = express();
// const PORT = process.env.PORT || 80
const PORT = 9000;

// app.use(express.urlencoded({extended: true})); // middleWare for parse req.Body
// or
app.use(express.json());

app.use(avitoChatRoutes);

async function start(){
    try{
        await mongoose.connect('mongodb://localhost:27017/avitoChat110919',{
            useNewUrlParser: true,
            useFindAndModify: false
        });
        app.listen(PORT, () => {
            console.log("Chat has been started on port: " + PORT);
        });
    }catch (e) {
        console.log(e);
    }
}

start();