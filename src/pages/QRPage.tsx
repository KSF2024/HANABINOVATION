import { Box, Button } from "@mui/material";
import QRCodeReader from "../images/QRCodeReader.png"
import QRScanner from "react-qr-scanner";
import { useState, useEffect } from "react";
import FooterPage from "../components/FooterPage";
import { BOOTH_ID_LIST, SCHOOL_DATA } from "../utils/config";

export default function QRPage(){

    type QrData = { boothId:string, schoolName: string } | null;
    const [qrText, setQrText] = useState<string>('');
    const [checkSchoolName, setCheckSchoolName] = useState<string>('');
    const [qrData, setQrData] = useState<QrData>(null);

    const handleScan = (data: any) => {
        if (data) {
            setQrText(data.text);
        }
    };

    function handleError(err: any) {
        console.error(err);
    };

    function getQrData(qrText:string): QrData {

        const checkPattern: RegExp = /^https:\/\/hanabinovation\.org\/[^\/]+\/create-firework\/$/;
        const checkUrl: boolean = checkPattern.test(qrText);

        if(checkUrl) {
            const checkPatternBooth: RegExp = /^https:\/\/hanabinovation\.org\/([^\/]+)\/create-firework\/$/;
            const match = qrText.match(checkPatternBooth);

            if(match && match[1]) {
                const checkBoothId = match[1];

                if(BOOTH_ID_LIST.includes(checkBoothId)) {
                    setCheckSchoolName(SCHOOL_DATA[checkBoothId]?.schoolName);
                    return { boothId: checkBoothId, schoolName: checkSchoolName };
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
        if(getQrData(qrText)) {
            setQrData(getQrData(qrText))
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
                            top: "40%",
                            left: "3rem",
                            width: "18.0625rem",
                            height: "9.375rem",
                            position: "absolute",
                            backgroundColor: "#FFFFFF",
                            color: "black",
                            zIndex: "3",
                            textAlign: "center"
                        }}
                    >
                        <div style={{textAlign: "center", }}>
                            {checkSchoolName + "の花火を作成しますか？"}
                        </div>
                        <div>
                            <Button sx={{}}>はい</Button>
                            <Button sx={{}}>いいえ</Button>
                        </div>
                    </div>
                )}
            </Box>
        </FooterPage>
    )
};