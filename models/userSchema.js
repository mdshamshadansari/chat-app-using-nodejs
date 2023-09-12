const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    content : {
        type : String
    },
    user : {
        type : String
    }
})

module.exports = mongoose.model('Chat',userSchema);