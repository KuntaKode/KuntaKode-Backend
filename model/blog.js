const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    content: {
        type: String,
        required: true,
        minLength: 100  
    },
    imageUri: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ["AI", "UI/UX", "Software Development", "Education", "Business"],
        required: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    },
    tags: [{
        type: String,
        trim: true
    }],
}, {
    timestamps: true 
});

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;