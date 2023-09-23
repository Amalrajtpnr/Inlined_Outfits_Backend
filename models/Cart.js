const { Schema, model } = require('mongoose')
const Product = require('./Product')

const cartSchema = new Schema({
    cartId:{ type:String},
    userId:{ type:String},
    email:{ type: String, required:true, unique:true },
    products:{ type: [{
        productId:String,
        cartItemId:{ type: String },
        product:{
            type:Object,
            ref:Product
        },
        quantity:Number,
        color:Object,
        size:String
    }] }
})

module.exports = model("Cart",cartSchema)