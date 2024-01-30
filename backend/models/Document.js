const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    _id: String,
    data: Object,
    title: {
        type: String,
        default: ""
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User' 
    },
    collaborators: {
        type: [mongoose.Types.ObjectId],
        ref: 'User'
    }
});

const Document = mongoose.model("Document", documentSchema);
module.exports = Document;