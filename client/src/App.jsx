import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

function Protected({ children }) { return localStorage.getItem('token') ? children : <Navigate to="/login" />; }
function Nav(){ const nav=useNavigate(); const logout=()=>{localStorage.removeItem('token'); nav('/login')}; return <div className="nav"><Link to="/dashboard" className="brand">3D Model Studio</Link><button onClick={logout}>Logout</button></div> }
export default function App(){return <BrowserRouter><Routes><Route path="/" element={<Navigate to="/dashboard"/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/dashboard" element={<Protected><Nav/><Dashboard/></Protected>}/></Routes></BrowserRouter>}
