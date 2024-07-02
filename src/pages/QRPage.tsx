import { Box, Button } from "@mui/material";
import QRCodeReader from "../images/QRCodeReader.png"
import QRScanner from "react-qr-scanner";
import { useState, useEffect } from "react";
import FooterPage from "../components/FooterPage";
import { BOOTH_ID_LIST, SCHOOL_DATA } from "../utils/config";
import { useNavigate } from 'react-router-dom';

type QrData = { boothId: string, schoolName: string } | null;

function handleError(err: any) {
    console.error(err);
};

export default function QRPage(){
    const [qrText, setQrText] = useState<string>("");
    const [qrData, setQrData] = useState<QrData>(null);
    const navigate = useNavigate();

    const handleScan = (data: any) => {
        if (data) {
            setQrText(data.text);
        }
    };

    const goToBoothDesignPage = ( boothId: string ) => {
        navigate("/" + boothId + "/create-firework");
    };

    function getQrData(qrText: string): QrData {
        const checkPattern: RegExp = /^https:\/\/hanabinovation\.org\/[^\/]+\/create-firework\/$/;
        const checkUrl: boolean = checkPattern.test(qrText);

        if(checkUrl) {
            const checkPatternBooth: RegExp = /^https:\/\/hanabinovation\.org\/([^\/]+)\/create-firework\/$/;
            const match = qrText.match(checkPatternBooth);

            if(match && match[1]) {
                const checkBoothId = match[1];

                if(BOOTH_ID_LIST.includes(checkBoothId)) {
                    return { boothId: checkBoothId, schoolName: SCHOOL_DATA[checkBoothId].schoolName };
                }
            }
        }
        return null
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

    useEffect(() => {
        const gottenQrData: QrData = getQrData(qrText);
        if(gottenQrData) {
            setQrData(gottenQrData);
        }
        
    }, [qrText]);

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
                        style={{width: "100%", height: "100vh",}}
                    />
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
                {qrData && (
                    <div
                        style={{
                            width: "100%",
                            height: "100vh",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: "3",
                            position: "absolute"
                        }}
                    >
                        <div
                            style={{
                                width: "18.0625rem",
                                height: "9.375rem",
                                backgroundColor: "#FFFFFF",
                                color: "black"
                            }}
                        >
                            <div style={{textAlign: "center", paddingTop: "2rem"}}>
                                <div>
                                    {qrData.schoolName + "の"}
                                </div>
                                <div>
                                    花火を作成しますか？
                                </div>
                            </div>
                            <div
                                style={{
                                    paddingTop: "1rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "1.5rem",
                                }}
                            >
                                <Button 
                                    onClick={() => goToBoothDesignPage(qrData.boothId)}
                                    sx={{
                                        border: "0.1rem solid white",
                                        backgroundColor: "#098FF0",
                                        color: "#FFFFFF"
                                    }}
                                >
                                    はい
                                </Button>
                                <Button
                                    onClick={() =>{
                                        
                                    }}
                                    sx={{
                                        border: "0.1rem solid white",
                                        backgroundColor: "#098FF0",
                                        color: "#FFFFFF"
                                    }}
                                >
                                    いいえ
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Box>
        </FooterPage>
    )
};