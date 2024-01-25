const Document = require("../models/Document.js");
const User = require("../models/User.js");
const mongoose = require("mongoose");

const defaultValue = "";

const findOrCreateDocument = async(id, userId) => {
    if(id == null) return;
    const document = await Document.findById(id);

    if(document) {
        return document;
    };
    return await Document.create({
        _id: id,
        userId,
        title: "",
        data: defaultValue,
    });
}

const accessDocument = async(req, res) => {
    try {
        const {userId, docId} = req.body;
        const document = await Document.findById(docId);
        
        // user creating new document
        if(!document) {

            await Document.create({
                _id: docId,
                userId,
                title: "",
                data: defaultValue,
            });

            return res.status(201).json({
                success: true,
                collaborator: false,
                docTitle: document.title,
                message: "New Document Created",
            });
            
        }

        // user/collborator accessing for a particular document
        if(document.userId == userId){ // collab conditon
            return res.status(200).json({
                success: true,
                collaborator: false,
                docTitle: document.title,
                message: "Document Found",
            });
        // user trying to access other's document            
        } else if(document.collaborators.includes(userId)){
            return res.status(200).json({
                success: true,
                collaborator: true,
                docTitle: document.title,
                message: "Collaborating Document Found",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Not Accessible",
            });
        }
    }catch(err){
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

const addCollaborator = async(req, res) => {
    try {
        const {userId, collabUserId, docId} = req.body;
        const document = await Document.findById(docId);

        if(document.userId == userId){
            document.collaborators.push(collabUserId);
        }

        await document.save();

        return res.status(200).json({
            success: true,
            message: 'Added a Collaborator'
        });

    }catch(err){
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

const listOfDocs = async(req, res) => {
    try{
        const { id } = req.params;
        const myDocs = await Document.find({userId: id});
        const collabDocs = await Document.find({
            collaborators: {$in: [new mongoose.Types.ObjectId(id)]}
        });

        const myDocsWithAuthors = await Promise.all(
            myDocs.map(async(doc) => {
                const authors = [];
                const { name } = await User.findById(doc.userId);
                authors.push(name);

                const collabAuthors = await Promise.all(
                    doc.collaborators.map(async(id) => {
                        const { name } = await User.findById(id);
                        authors.push(name);
                        return;
                    })
                )

                return {
                    ...doc._doc,
                    authors
                }
            })
        );

        const collabDocsWithAuthors = await Promise.all(
            collabDocs.map(async(doc) => {
                const authors = [];
                const { name } = await User.findById(doc.userId);
                authors.push(name);

                const collabAuthors = await Promise.all(
                    doc.collaborators.map(async(id) => {
                        const { name } = await User.findById(id);
                        authors.push(name);
                        return;
                    })
                )

                return {
                    ...doc._doc,
                    authors
                }
            })
        );
        
        res.status(200).json({
            success: true,
            data: {
                myDocs: myDocsWithAuthors,
                collabDocs: collabDocsWithAuthors
            }
        });

    }catch(err){
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

const setDocTitle = async(req, res) => {
    try{
        const { userId, docTitle, docId } = req.body;
        const document = await Document.findById(docId);

        if(document.userId == userId){
            document.title = docTitle;
        }

        await document.save();

        return res.status(200).json({
            success: true,
            docTitle: document.title,
            message: 'Title has been set now',
        });


    }catch(err){
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    findOrCreateDocument,
    accessDocument,
    addCollaborator,
    listOfDocs,
    setDocTitle
}