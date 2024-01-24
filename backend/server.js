require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { findOrCreateDocument } = require('./controllers/document.js');
const Document = require("./models/Document.js");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:5173',
        method: ['GET', 'POST']
    }
});

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Routes here
app.use("/auth", require('./routes/auth.js'));
app.use("/doc", require('./routes/document.js'));

// IO here
io.on('connection', (socket) => {

  socket.on('get-document', async(req) => {
    const {documentId, userId} = req;
    const document = await findOrCreateDocument(documentId, userId);

    socket.join(documentId);
    socket.emit('load-document', document.data);

    socket.on('send-changes', delta => {
      socket.broadcast.to(documentId).emit("recieve-changes", delta);
    });

    // manual call
    socket.on('save-document', async(data) => {
      await Document.findByIdAndUpdate(documentId, {data});
    });

  })

  
})

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server started @ Port: ${PORT}`);
      console.log('Mongoose connection successful');
    });
  })
  .catch((error) => console.log(`${error} did not connect`));