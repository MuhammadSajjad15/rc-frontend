import React, { useState } from "react";
import printJS from 'print-js';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState();
  const [check, setCheck] =useState([]);

  const handleChange = (e)=>{
    console.log(e.target.value, e.target.checked);
    
    if(e.target.checked){
    setCheck([...check, e.target.value])
    }else{
      setCheck([...check.filter((item)=> item !== check
      )])
    }
    
  }

  const onFileChange = (e) => {
    
    const fileImage = e.target.files[0];
    console.log(fileImage.type);
    console.log("File Size:" ,fileImage.size);
    
    const allowedType = ['image/svg+xml'];
    if(!allowedType.includes(fileImage.type)){
      alert("only SVG is allowed")
      setFile(null);
    }else{
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(fileImage));
      
    }
    
    

  };

  const onFileUpload = async () => {
    if (!file || !name) {
      setMessage("Please enter your name and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);  // Field name must match backend
    formData.append("name", name);  // This is your extra input field

    try {
      setIsLoading(true);

      const response = await fetch("https://rc-backend-3u18-pi4bpiprc-muhammadsajjad15s-projects.vercel.app/upload", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);
      } else {
        const errorText = await response.text();
        setMessage("Error uploading file: " + errorText);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error uploading file: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    printJS({ printable: '/paper.pdf', type: 'pdf', showModal: true , copies: 20});
  };


  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Upload a File live</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        disabled={isLoading}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />

      <input
        type="file"
        onChange={onFileChange}
        disabled={isLoading}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <input 
        type="checkbox" id="svg"
        onChange={handleChange}
        value='svg'
        
      /> <label htmlFor="svg">svg file</label>
      <br></br>

      <input 
        type="checkbox" id="jpeg"
        onChange={handleChange}
        value='jpeg'
        
      /> <label htmlFor="jpeg">jpeg file</label>
      <br></br>

      <input 
        type="checkbox" id="png"
        onChange={handleChange}
        value='png'
        
      /> <label htmlFor="png">png file</label>
      <br></br>

      <button onClick={onFileUpload} disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload"}
      </button>

      <p>{message}</p>
       {preview && <img src={preview} alt="Preview" width={200} />}
       <h1>{check.toString()}</h1>
       <button onClick={handlePrint}>Print PDF</button> <br></br>
       <button onClick={handlePrint}>Coordination PDF</button><br></br>
       <button onClick={handlePrint}>Syllabus PDF</button>

    </div>
  );
};

export default FileUpload;
