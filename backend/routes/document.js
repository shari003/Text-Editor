const express = require('express');
const { accessDocument, addCollaborator, listOfDocs } = require('../controllers/document.js');
const verifyToken = require('../middleware/auth.js');

const router = express.Router();

router.get("/list-documents/:id", verifyToken, listOfDocs);

router.post("/access-document", verifyToken, accessDocument);
router.post("/add-collaborator", verifyToken, addCollaborator);

module.exports = router;