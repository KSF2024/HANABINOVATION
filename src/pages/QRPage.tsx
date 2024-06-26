import { Box } from "@mui/material";
import QRCodeReader from "../images/QRCodeReader.png"
import QRScanner from "react-qr-scanner";
import { useState, useEffect } from "react";
import FooterPage from "../components/FooterPage";

export default function QRPage(){

    const [result, setResult] = useState<string>('');

    const handleScan = (data: any) => {
      if (data) {
        setResult(data.text);
      }
    };
  
    const handleError = (err: any) => {
      console.error(err);
    };

    // react-qr-scannerがobject-fit: "container"なので"cover"に変更する。
    useEffect(() => {
        const video = document.querySelector(".qr-video video") as HTMLVideoElement;
        if (video) {
            video.style.objectFit = "cover";
            video.style.width = "100%";
            video.style.height = "100%";
        }
    }, []);

    return(
        <FooterPage>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                <div 
                    className="qr-video"
                    style={{
                        width: "100%",
                        height: "100vh",
                        zIndex: "1",
                        position: "absolute"
                    }}
                >
                    <QRScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{width: "100%", height: "100vh"}}
                    />
                    {result && (
                        <Box sx={{ marginTop: 2 }}>
                            <p>スキャン結果: {result}</p>
                        </Box>
                    )}
                </div>
                <div 
                    style={{
                        width: "100%",
                        height: "20rem",
                        zIndex: "2",
                        position: "relative"
                    }}
                >
                    <img 
                        src={QRCodeReader}
                        alt="qrcode_reader"
                    >
                    </img>
                </div>
            </Box>
        </FooterPage>
    )
}
