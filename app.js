require('dotenv').config();
require('express-async-errors');

const express = require('express');

const app = express();
const notFound = require('./middleware/not-Found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');  

app.use(express.json());

app.use('/api/v1/products', productsRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`listening on the port: ${port}....`));
    } catch (error) {
        console.log(error);
    }
}

start()

