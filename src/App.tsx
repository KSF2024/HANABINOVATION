import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import PhotoPage from "./pages/PhotoPage";
import HanabiPage from "./pages/HanabiPage";
import MapPage from "./pages/MapPage";
import QRPage from "./pages/QRPage";
import LotteryPage from "./pages/LotteryPage";

export default function App(){
    return (
        <Router>
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div style={{
                    flexGrow: 1
                }}>
                    <Routes>
                        <Route path="/"/>
                        <Route path="/:boothId/create-firework"/>
                        <Route path="/:boothId/capture-firework" element={<PhotoPage/>}/>
                        <Route path="/firework-show" element={<HanabiPage/>}/>
                        <Route path="/map" element={<MapPage/>} />
                        <Route path="/scan-qr" element={<QRPage/>}/>
                        <Route path="/enter-lottery" element={<LotteryPage/>}/>
                    </Routes>
                </div>
                <Footer/>
            </div>
        </Router>
    )
}
