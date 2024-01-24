/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShowDocument from "../components/ShowDocument";

const MyDocs = () => {
    const {token, user} = useSelector(store => store);
    const [myDocs, setMyDocs] = useState(null);
    const [collabDocs, setCollabDocs] = useState(null);

    const getDocs = async() => {
        const response = await fetch(`http://localhost:3001/doc/list-documents/${user._id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
        });
        const data = await response.json();
        setMyDocs(data.data.myDocs);
        setCollabDocs(data.data.collabDocs);
    }
    useEffect(() => {
        getDocs();
    }, []);

    return myDocs !== null && collabDocs !== null ? (
        <div className="p-10">
            <h1 className="text-2xl font-bold underline">List of Docs created by you</h1>
            <div className="px-2 py-5 block md:flex">
                {myDocs.map((doc) => <ShowDocument key={doc._id} doc={doc} />)}
            </div>
            <h1 className="text-2xl font-bold underline">List of Docs created by you in Collaboration</h1>
            <div className="px-2 py-5">
                {collabDocs.map((doc) => <ShowDocument key={doc._id} doc={doc} />)}
            </div>
        </div>
    ) : (
        <>
            <h1>Loading Your Docs...</h1>
        </>
    )
}

export default MyDocs