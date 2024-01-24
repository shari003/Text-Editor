/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const ShowDocument = ({doc}) => {

    return (
        <div className="p-2 min-h-24 w-full md:w-1/3 border border-black m-4 rounded-md">
            <p><span className="font-bold">Document Title:</span> Random Title</p>
            <p><span className="font-bold">Document ID:</span> {doc?._id}</p>
            <p><span className="font-bold">Author(s):</span> {doc?.authors.length === 1 ? doc?.authors[0] : doc?.authors.join(", ")}</p>
            <p>Click here to <Link to={`/editor/${doc?._id}`} className="font-bold text-blue-700 underline cursor-pointer">See</Link></p>
        </div>
    )
}

export default ShowDocument