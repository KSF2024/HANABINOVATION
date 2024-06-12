import { Button, Paper, Typography } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import { CaptureContext } from "../providers/CaptureProvider";
import { FireworksContext } from "../providers/FireworkProvider";
import { CameraContext } from "../providers/CameraProvider";
import { ModalContext } from "../providers/ModalProvider";

export default function ConfirmCapture(){
    // 撮影処理用のcontext
    const {
        mergedCanvas,
        isTakingPhoto,
        mergeCanvas,
        convertCanvasToBase64,
        saveImage
    } = useContext(CaptureContext);
    const { setFireworkPhase } = useContext(FireworksContext); // 花火操作用のcontext
    const { videoRef } = useContext(CameraContext); // カメラ操作用のcontext
    const { closeModal } = useContext(ModalContext); // モーダルメニュー用のcontext

    const canvasContainerRef = useRef<HTMLDivElement>(null);

    // 撮影写真を保存し、撮影処理を行う関数
    function takePhoto(){
        saveCapturedImage(); // 撮影写真を保存する
        console.log("花火データ送信"); // TODO 花火データの送信処理
        // TODO toastifyの表示処理
        finishConfirmTakePhoto(); // 撮影写真の確認処理を終了する
    }

    // 撮影写真を保存する関数
    function saveCapturedImage(){
        const mergedCanvas = mergeCanvas();
        if(mergedCanvas){
            const capturedImage = convertCanvasToBase64(mergedCanvas);
            if(capturedImage) saveImage(capturedImage);
        }
    }

    // 撮影写真の確認処理を終了させる関数
    function finishConfirmTakePhoto(){
        videoRef.current?.play(); // カメラの停止を終了する
        isTakingPhoto.current = false; // 撮影ボタンの処理が終わったことを記録する
        setFireworkPhase(0); // 花火を半透明の初期表示状態に戻す
        closeModal(); // モーダルメニューを閉じる
    }

    useEffect(() => {
        if(canvasContainerRef.current && mergedCanvas){
            mergedCanvas.style.height = "100%";
            canvasContainerRef.current.appendChild(mergedCanvas);
        }
        return () => {
            if (canvasContainerRef.current && mergedCanvas){
                canvasContainerRef.current.removeChild(mergedCanvas);
            }
        };
    }, [mergedCanvas]);

    return (
        <Paper
            sx={{
                p: 2
            }}
            style={{
                width: "80vw",
                height: "80dvh"
            }}
        >
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Typography
                    variant="h6"
                    style={{ textAlign: "center" }}
                >
                    撮影写真はこちらでよろしいですか？
                </Typography>
                <div
                    ref={canvasContainerRef}
                    style={{
                        flexGrow: 1, // 余白に合わせて伸張する
                        display: "flex",
                        justifyContent: "center",
                        margin: "1rem",
                        overflow: "hidden"
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{ mr: 5 }}
                        onClick={takePhoto}
                    >
                        はい
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={finishConfirmTakePhoto}
                    >
                        いいえ
                    </Button>
                </div>
            </div>
        </Paper>
    )
}
