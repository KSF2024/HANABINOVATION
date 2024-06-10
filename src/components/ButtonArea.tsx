import { useContext, useEffect, useRef } from "react";
import { CameraContext } from "./../providers/CameraProvider";
import DoubleCircleIcon from "./DoubleCircleIcon";
import { Theme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import CameraRear from '@mui/icons-material/CameraRear';
import CameraFront from '@mui/icons-material/CameraFront';
import Cameraswitch from '@mui/icons-material/Cameraswitch';
import { ICON_SIZE, ICON_COLOR, BUTTON_MARGIN } from "./../pages/PhotoPage";
import { FireworksContext } from "../providers/FireworkProvider";
import { DataContext } from "../providers/DataProvider";

// ボタン類のコンポーネント
export default function ButtonArea({theme}: {theme: Theme}){
    /* useState等 */
    // アウトカメラ/インカメラを切り替えるためのcontext
    const {
        videoRef,
        switchCameraFacing,
        cameraFacing,
        enableBothCamera
    } = useContext(CameraContext);

    const isTakingPhoto = useRef<boolean>(false);

    // 画面幅がmd以上かどうか
    const isMdScreen = useMediaQuery(() => theme.breakpoints.up("md")); // md以上

    const {
        initializeImageSrc,
        toggleFireworksPosition,
        setFireworkPhase
    } = useContext(FireworksContext);

    const {
        boothId
    } = useContext(DataContext);

    /* 関数定義 */
    // 撮影ボタンを押したときの処理
    async function handleTakePhotoButton(): Promise<void>{
        // 既に撮影ボタンの処理が走っているなら、処理を中止する
        if(isTakingPhoto.current){
            console.error("既に撮影ボタンが押されています");
            return;
        };

        isTakingPhoto.current = true; // 撮影ボタンの処理中であることを記録する
        videoRef.current?.pause(); // カメラを一時停止する

        // 撮影した写真に確認を取る
        // 「撮影画像はこちらでよいですか」というメッセージボックスを表示する
        const isPhotoOk: boolean = confirm("撮影画像はこちらでよいですか");

        // 撮影した写真に承諾が取れたら、サーバーにリングを送信する
        if(isPhotoOk){
            sendFireworksData();
        }else{
            // 再撮影を望む場合、処理を止める
            console.log("撮影やり直しのために処理を中断しました");
        }

        videoRef.current?.play(); // カメラを再生する
        isTakingPhoto.current = false; // 撮影ボタンの処理が終わったことを記録する
    }

    // 花火データを送信する関数
    function sendFireworksData(): void{
        console.log("花火データ送信");
    }

    // boothIdが読み込めたら、画像データを読み込む
    useEffect(() => {
        if(boothId) initializeImageSrc();
    }, [boothId]);


    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: isMdScreen ? "center" : "space-evenly",
                position: "absolute",
                bottom: "1rem",
                zIndex: "10"
            }}
        >
            <IconButton
                style={{
                    margin: isMdScreen ?`0 ${BUTTON_MARGIN}` : "0"
                }}
                aria-label="reset-view"
                color="primary"
                onClick={() =>{
                    if(isTakingPhoto.current) return; // 撮影ボタンの処理中なら、処理をやめる
                    toggleFireworksPosition();
                }}
            >
                <CachedIcon
                    style={{
                        width: ICON_SIZE,
                        height: ICON_SIZE
                    }}
                />
            </IconButton>
            <IconButton
                style={{
                    margin: isMdScreen ?`0 ${BUTTON_MARGIN}` : "0"
                }}
                aria-label="capture-display"
                color="primary"
                onClick={() => {
                    // TODO 撮影処理の実装
                    setFireworkPhase(prev => (prev + 1) % 3)
                    // handleTakePhotoButton();
                }}
            >
                <DoubleCircleIcon
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    color={ICON_COLOR}
                />
            </IconButton>
            <IconButton
                style={{
                    margin: isMdScreen ?`0 ${BUTTON_MARGIN}` : "0"
                }}
                aria-label="switch-camera"
                color="primary"
                disabled={!enableBothCamera}
                onClick={() => {
                    switchCameraFacing(!isTakingPhoto.current);
                }}
            >
                {(cameraFacing === "out") ? (
                    <CameraFront
                        style={{
                            width: ICON_SIZE,
                            height: ICON_SIZE
                        }}
                    />
                ): ((cameraFacing === "in") ? (
                    <CameraRear
                        style={{
                            width: ICON_SIZE,
                            height: ICON_SIZE
                        }}
                    />
                ): (
                    <Cameraswitch
                        style={{
                            width: ICON_SIZE,
                            height: ICON_SIZE
                        }}
                    />
                ))}
            </IconButton>
        </div>
    );
};
