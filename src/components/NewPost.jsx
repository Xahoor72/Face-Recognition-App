import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const NewPost = ({ image, onUploadNew }) => {
  const { url, width, height } = image;
  const [faces, setFaces] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(
      imgRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );
    setFaces(detections.map((d) => Object.values(d.box)));
    if (detections.length === 0) {
      setShowModal(true); // Show modal if no faces detected
    }
  };

  const enter = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 4;
    ctx.strokeStyle = "yellow";
    faces.map((face) => {
      const [x, y, w, h] = face;
      const scaleX = width / imgRef.current.naturalWidth;
      const scaleY = height / imgRef.current.naturalHeight;
      ctx.strokeRect(x * scaleX, y * scaleY, w * scaleX, h * scaleY);
    });
  };

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      handleImage();
    };

    imgRef.current && loadModels();
  }, []);

  const addFriend = (e) => {
    setFriends((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      <div className="left" style={{ width: 500, height: 500, border: "2px solid #ccc", boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)", borderRadius: "5px" }}>
        <img
          ref={imgRef}
          crossOrigin="anonymous"
          src={url}
          alt=""
          style={{ width: "100%", height: "100%", borderRadius: "5px" }}
        />
        <canvas
          onMouseEnter={enter}
          ref={canvasRef}
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        
        {faces.map((face, i) => (
          <input
            name={`input${i}`}
            style={{
              position: "absolute",
              left: face[0],
              top: face[1] + face[3] + 5,
              backgroundColor: "transparent",
              color: "transparent",
              border: "none",
              outline: "none",
              padding: "5px 5px",
              borderRadius: "5px",
              transition: "background-color 0.3s ease, color 0.3s ease",
              width: "100px",
            }}
            placeholder="Tag a friend"
            key={i}
            className="friendInput"
            onChange={addFriend}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f0f0f0";
              e.target.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "transparent";
            }}
          />
        ))}
      </div>
      <div className="right">
        <h1>Share your post</h1>
        <input
          type="text"
          placeholder="What's on your mind?"
          className="rightInput"
        />
        {friends && (
          <span className="friends">
            with <span className="name">{Object.values(friends) + " "}</span>
          </span>
        )}
        <button className="rightButton" onClick={onUploadNew}>Upload New</button>
      </div>
      
      {showModal && (
        <div className="modal">
          <div className="dialogue">
            No faces detected. <button className="closeButton" onClick={handleCloseModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPost;
