/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useState } from "react";
import "../index.css";
import { io } from "socket.io-client";
import {useDispatch, useSelector} from "react-redux";
import { Link, useParams } from "react-router-dom";
import {v4 as uuidV4} from "uuid";
import { setCollaboratorMode } from "../state";

const TextEditor = () => {

    const {id: documentId} = useParams();
    const {user, token} = useSelector((store) => store);
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const [success, setSuccess] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const dispatch = useDispatch();

    const accessDoc = async() => {
        const response = await fetch(
            "http://localhost:3001/doc/access-document",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", },
              body: JSON.stringify({
                userId: user._id,
                docId: documentId
              }),
            }
        );
        const data = await response.json();
        setSuccess(data.success);
        setSuccessMessage(data.message);
        dispatch(setCollaboratorMode({collaboratorMode: data.collaborator}))
    }

    useEffect(() => {

        accessDoc();
        if(!success){
            setSocket(null);
            setQuill(null);
        }

        
    }, [documentId, success, successMessage]);

    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);

        return () => {
            s.disconnect();
        }
    }, []);

    useEffect(() => {
        if(socket == null || quill == null) return;
        const handler = (delta) => {
            quill.updateContents(delta)
        }
        socket.on('recieve-changes', handler)
        return () => {
            socket.off('recieve-changes', handler)
        }
    }, [socket, quill]);

    useEffect(() => {
        if(socket == null || quill == null) return;
        const handler = (delta, oldDelta, source) => {
            if(source !== 'user') return;
            socket.emit("send-changes", delta)
        }
        quill.on('text-change', handler)
        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill]);

    useEffect(() => {
        if(socket == null || quill == null) return;

        socket.once('load-document', document => {
            quill.setContents(document);
            quill.enable();
        })

        socket.emit('get-document', {documentId: documentId, userId: user._id});
    
    }, [socket, quill, documentId]);

    useEffect(() => {
        if(socket == null || quill == null) return;

        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents());
        }, 5000);

        return () => {
            clearInterval(interval);
        }

    }, [socket, quill ])

    const TOOLBAR_OPTS = [
        [{header: [1,2,3,4,5,6,false]}],
        [{font: []}],
        [{list: "ordered"}, {list: "bullet"}],
        ["bold", "italic", "underline"],
        [{color: []}, {background: []}],
        [{script: "sub"}, {script: "super"}],
        [{align: []}],
        ["image", "blockquot", "code-block"],
        ["clean"]
    ];

    const wrapperRef = useCallback((wrapper) => {
        if(wrapper === null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {theme: 'snow', modules: {toolbar: TOOLBAR_OPTS}});
        q.disable();
        q.setText("Loading...")
        setQuill(q);
    }, []);

    return success === false ? (
        <>
            <div className="min-h-full flex justify-center items-center">
                <h1 className="block text-2xl">
                    Cannot Load the Requested Document 
                    <br />
                    <span className="text-red-600">{successMessage}</span>
                    <br />
                    Try Creating a new one. <Link className="text-blue-600 underline" to={`/`}>Here</Link>
                </h1>
            </div>
        </>
    ) : (
        <div className="container" ref={wrapperRef}>
            Text Editor
        </div>
    )
}

export default TextEditor