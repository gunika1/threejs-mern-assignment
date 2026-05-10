import { useEffect, useRef, useState } from "react";
import { Upload, Save, Box } from "lucide-react";
import API from "../api";
import Viewer from "../components/Viewer.jsx";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [object, setObject] = useState(null);
  const [objects, setObjects] = useState([]);
  const [message, setMessage] = useState("");

  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  const loadObjects = async () => {
    try {
      const res = await API.get("/objects");
      setObjects(res.data);

      if (res.data[0]) {
        setObject(res.data[0]);
      }
    } catch (e) {
      setMessage("Unable to load objects");
    }
  };

  useEffect(() => {
    loadObjects();
  }, []);

  const upload = async () => {
    if (!file) {
      return setMessage("Please select a .glb file");
    }

    const fd = new FormData();
    fd.append("model", file);

    try {
      const res = await API.post("/objects/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setObject(res.data);
      setObjects([res.data, ...objects]);
      setMessage("Model uploaded successfully");
    } catch (e) {
      setMessage(e.response?.data?.message || "Upload failed");
    }
  };

  const saveState = async () => {
    if (!object || !cameraRef.current || !controlsRef.current) {
      return setMessage("No model state to save");
    }

    const cameraPosition = {
      position: cameraRef.current.position.toArray(),
      target: controlsRef.current.target.toArray(),
      zoom: cameraRef.current.zoom,
    };

    try {
      await API.put(`/objects/${object._id}/state`, {
        cameraPosition,
      });

      setMessage("Camera state saved");
    } catch (e) {
      setMessage("Failed to save state");
    }
  };

  const onReady = (controls, camera) => {
    controlsRef.current = controls;
    cameraRef.current = camera;

    if (object?.cameraPosition?.position) {
      camera.position.fromArray(object.cameraPosition.position);

      if (object.cameraPosition.target) {
        controls.target.fromArray(object.cameraPosition.target);
      }

      camera.zoom = object.cameraPosition.zoom || 1;
      camera.updateProjectionMatrix();
      controls.update();
    }
  };

  return (
    <main className="dashboard">
      <section className="left">
        <span className="tag">
          <Box size={16} /> MERN + Three.js
        </span>

        <h1>3D Object Viewer</h1>

        <p>
          Upload a GLB file, manipulate it with rotate, zoom and pan controls,
          then save the camera state to MongoDB.
        </p>

        <div className="uploadBox">
          <input
            type="file"
            accept=".glb"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={upload}>
            <Upload size={18} /> Upload GLB
          </button>

          <button className="secondary" onClick={saveState}>
            <Save size={18} /> Save Camera State
          </button>
        </div>

        {message && <div className="message">{message}</div>}

        <h3>Saved Objects</h3>

        <div className="list">
          {objects.map((o) => (
            <button
              key={o._id}
              onClick={() => setObject(o)}
              className={object?._id === o._id ? "selected" : ""}
            >
              {o.name || o.originalName || "3D Model"}
            </button>
          ))}
        </div>
      </section>

      <section className="viewer">
        <Viewer modelUrl={object?.fileUrl} onControlsReady={onReady} />
      </section>
    </main>
  );
}