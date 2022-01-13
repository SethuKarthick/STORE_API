const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: [true, 'Please provide product name']
    },
    price:{
        type: Number,
        required: [true, 'Please provide product price']
    }, 
    featured:{
        type:Boolean,
        default: false
    },
    rating:{
        type: Number,
        default: 4.5
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }, 
    company: {
        type: String,
        enum : {
            values : ['ikea', 'liddy', 'caressa', 'marcos'],
            message : 'Company {VALUE} is not supported'
        }
    }
})

module.exports = mongoose.model('Product', productSchema)