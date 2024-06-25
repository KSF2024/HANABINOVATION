import Camera from "../components/Camera";
import { Box } from "@mui/material";
import QRCodeReader from "../images/QRCodeReader.png"
import QRScanner from "react-qr-scanner";
import { useState } from "react";
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

    return(
        <>
            <FooterPage>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100vh",
                        textAlign: "center",
                        position: "absolute",
                        zIndex: "1"
                    }}
                >
                    <QRScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%', height: "100vh" }}
                    />
                    {result && (
                        <Box sx={{ marginTop: 2 }}>
                            <p>スキャン結果: {result}</p>
                        </Box>
                    )}
                </Box>
                <Box sx={{
                        width: "100%",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        position: "absolute",
                        zIndex: "2"
                    }}
                >
                    <img 
                        src={QRCodeReader}
                        alt="qrcode_reader"
                        style={{height: "20rem", paddingBottom: "5rem"}}
                    >
                    </img>
                </Box>
            </FooterPage>
        </>
    )
}
