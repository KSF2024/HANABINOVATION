import { Button, Grid, Paper, Typography } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import { CaptureContext } from "../providers/CaptureProvider";
import { FireworksContext } from "../providers/FireworkProvider";
import { CameraContext } from "../providers/CameraProvider";
import { ModalContext } from "../providers/ModalProvider";
import { toast } from "react-toastify";
import { DataContext } from "../providers/DataProvider";
import { postFirework } from "../utils/apiClient";
import { FireworkData } from "../utils/types";
import { createDivElements } from "../utils/elementGenerator";

export default function ConfirmCapture(){
    const {
        userId,
        boothId,
        fireworkType,
        sparksType,
        fireworkDesign,
        setIsPostedFirework,
        setPostedFireworksData
    } = useContext(DataContext);

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
        submitFireworkData().then(res => { // 花火データの登録を行う
            if(!res){
                // エラーハンドリングを行う
                finishConfirmTakePhoto();
                return;
            }
            setIsPostedFirework(true); // 花火データを登録済みとして管理する
            saveCapturedImage(); // 撮影写真を保存する
            showCongratulations(); // 花火大会への案内メッセージを送信する
            finishConfirmTakePhoto(); // 撮影写真の確認処理を終了する
        })
    }

    // 花火データの登録を行う関数
    async function submitFireworkData(): Promise<boolean>{
        // 例外処理を行う
        if(!userId) return false;
        if(!boothId) return false;

        // 花火データの作成を行う
        const data: FireworkData = {
            fireworkType,
            sparksType,
            ...(fireworkDesign.current && { fireworkDesign: fireworkDesign.current })
        }

        // 花火データの送信を行う
        const response = await postFirework(userId, boothId, data);

        // 花火データ送信のエラーハンドリングを行う
        if(response){
            setPostedFireworksData((prev) => {
                if(!prev) return null;
                const newData = {...prev};
                newData[boothId] = data;
                return newData;
            });
            return true;
        }else{
            const errorTexts: string[] = [
                "申し訳ございません。花火データの登録に失敗しました。",
                "回線状況を見直しの上、再度お試しください。"
            ]
            toast.error(
                createDivElements(errorTexts),
                {autoClose: false}
            );
            return false;
        }
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

    // 花火の撮影が終わったユーザーにメッセージを表示する関数
    function showCongratulations(){
        const toastTexts: string[] = ["花火の撮影ありがとうございます！", "このメッセージをクリックすると「花火大会」に参加することができます。", "他の人の作った花火も見てみましょう！"];
        toast.info(
            createDivElements(toastTexts, () => {
                isTakingPhoto.current = false; // 撮影ボタンの処理が終わったことを記録する
                setFireworkPhase(0); // 花火を半透明の初期表示状態に戻す
                location.href = `/${boothId}/show-fireworks/`;
            }),
            {autoClose: false}
        );
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
                <Grid
                    container
                    spacing={8}
                    sx={{
                        justifyContent: "center"
                    }}
                >
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={takePhoto}
                        >
                            はい
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            onClick={finishConfirmTakePhoto}
                        >
                            いいえ
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Paper>
    )
}
