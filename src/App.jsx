import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import NewPost from "./components/NewPost";

function App() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    const getImage = () => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 500, 500);
        setImage({
          url: canvas.toDataURL(),
          width: 500,
          height: 500,
        });
      };
    };

    file && getImage();
  }, [file]);

  const handleUploadNew = () => {
    // Reset the uploaded file and image state
    setFile(null);
    setImage(null);
  };

  return (
    <div>
      <Navbar />
      {image ? (
        <NewPost image={image} onUploadNew={handleUploadNew} />
      ) : (
        <div className="newPostCard">
          <div className="addPost">
            <img
              src="https://images.pexels.com/photos/9371782/pexels-photo-9371782.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
              className="avatar"
            />
            <div className="postForm">
              <input
                type="text"
                placeholder="Upload an Image !!"
                className="postInput"
              />
              <label htmlFor="file" className=" uploadButton " >Upload 
                
                
              </label>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                id="file"
                style={{ height: 0, width: 0, opacity: 0, position: 'absolute' }}
                type="file"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
