import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";
import Vehicles from "./Vehicles";
import People from "./People";
import Saidas from "./Saidas";
import Agendamentos from "./Agendamentos";
import Documentos from "./Documentos";
import Relatorios from "./Relatorios";
import Settings from "./Settings";
import FirebaseTest from "@/components/FirebaseTest";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Dashboard: Dashboard,
    Vehicles: Vehicles,
    People: People,
    Saidas: Saidas,
    Agendamentos: Agendamentos,
    Documentos: Documentos,
    Relatorios: Relatorios,
    Settings: Settings,
    FirebaseTest: FirebaseTest,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={<Dashboard />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Vehicles" element={<Vehicles />} />
                <Route path="/People" element={<People />} />
                <Route path="/Saidas" element={<Saidas />} />
                <Route path="/Agendamentos" element={<Agendamentos />} />
                <Route path="/Documentos" element={<Documentos />} />
                <Route path="/Relatorios" element={<Relatorios />} />
                <Route path="/Settings" element={<Settings />} />
                <Route path="/FirebaseTest" element={<FirebaseTest />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}