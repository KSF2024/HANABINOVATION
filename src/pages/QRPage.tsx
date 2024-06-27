import { Box, Button } from "@mui/material";
import QRCodeReader from "../images/QRCodeReader.png"
import QRScanner from "react-qr-scanner";
import { useState, useEffect } from "react";
import FooterPage from "../components/FooterPage";
import { BOOTH_ID_LIST, SCHOOL_DATA } from "../utils/config";

type QrData = { text: string } | null;

export default function QRPage(){
    const [result, setResult] = useState<string>('');

    function handleScan(data: QrData){
        if(data){
            setResult(data.text);
        }
    };

    function handleError(err: any){
        console.error(err);
    };

    function isMatchingUrl(result: string) {

        const checkPattern: RegExp = /^https:\/\/hanabinovation\.org\/[^\/]+\/create-firework\/$/;
        const checkUrl: boolean = checkPattern.test(result);

        if(checkUrl) {
            const checkPatternBooth: RegExp = /^https:\/\/hanabinovation\.org\/([^\/]+)\/create-firework\/$/;
            const match = result.match(checkPatternBooth);

            if(match && match[1]) {
                const checkBoothId = match[1];

                if(BOOTH_ID_LIST.includes(checkBoothId)) {
                    const checkSchoolName = SCHOOL_DATA[checkBoothId]?.schoolName;
                    return (
                        <div 
                            style={{
                                top: "246px",
                                left: "52px",
                                width: "289px",
                                height: "150px",
                                position: "absolute",
                                backgroundColor: "#FFFFFF",
                                color: "black"
                            }}
                        >
                            {checkSchoolName + "の花火を作成しますか？"}
                            <Button>はい</Button>
                            <Button>いいえ</Button>
                        </div>
                    )
                }
            }
        }
    }

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
        if(result) {
            isMatchingUrl(result)
        }
    }, [result]);

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
                        alt="qr_code_reader"
                    >
                    </img>
                </div>
            </Box>
        </FooterPage>
    )
}
