"use client";
import { useState } from "react";
import axios from "axios";

export default function UploadPhoto() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [uploadedUrl, setUploadedUrl] = useState("");
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axios.post(
                "http://localhost:3000/api/file-upload/upload-image",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(res)
            setUploadedUrl(res.data.url);
            setMessage("Upload successful!");
        } catch (err) {
            console.error(err);
            setMessage("Upload failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Upload Image</h1>

            <form onSubmit={handleUpload}>
                <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
                {preview && <img src={preview} alt="preview" className="w-48 mb-4" />}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Upload
                </button>
            </form>

            {message && <p className="mt-4 text-blue-600">{message}</p>}
            {uploadedUrl && (
                <div className="mt-4">
                    <p>Uploaded Image:</p>
                    <img src={uploadedUrl} alt="uploaded" className="w-48 mt-2" />
                </div>
            )}
        </div>
    );
}
