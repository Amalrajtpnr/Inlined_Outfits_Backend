const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    productId: { type: String, unique: true },
    name: String,
    description: String,
    price: {
        type: {
            original: String,
            offer: String
        }
    },
    colors: [Object],
    sizes: { type: [String] },
    images: { type: [String] },
    details: { type: Object },
    designs: {
        type: {
            Patterns: [String],
            Stickers: [String],
            Text: String,
            TextStyle: {
                font: String,
                color: String,
            }
        }
    }
})

module.exports = model("Product", productSchema)
