import { BrowserRouter, Route, Routes } from "react-router-dom";
import PhotoPage from "./pages/PhotoPage";
import HanabiPage from "./pages/HanabiPage";
import MapPage from "./pages/MapPage";
import QRPage from "./pages/QRPage";
import LotteryPage from "./pages/LotteryPage";
import HanabiDataSubmission from "./pages/HanabiDataSubmission";

export default function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"/>
                <Route path="/:boothId/create-firework"/>
                <Route path="/:boothId/capture-firework" element={<PhotoPage/>}/>
                <Route path="/firework-show" element={<HanabiPage/>}/>
                <Route path="/map" element={<MapPage/>} />
                <Route path="/scan-qr" element={<QRPage/>}/>
                <Route path="/enter-lottery" element={<LotteryPage/>}/>
                <Route path="/submit-firework" element={<HanabiDataSubmission/>}/>
                <Route path="/*" element={<div>パスエラー</div>}/>
            </Routes>
        </BrowserRouter>
    )
}
