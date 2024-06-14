import { ThemeProvider, createTheme } from "@mui/material";
import Camera from "../components/Camera";
import ButtonArea from "../components/ButtonArea";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../providers/DataProvider";
import { useParams } from "react-router-dom";
import CaptureFireworkCanvas from "../components/CaptureFireworkCanvas";
import { ModalContext } from "../providers/ModalProvider";
import ConfirmCapture from "../components/ConfirmCapture";
import { BOOTH_ID_LIST } from "../utils/config";
import ErrorPage from "./ErrorPage";
import { toast } from "react-toastify";

/* 定数定義 */
export const ICON_SIZE: string = "5rem"; // ボタンの大きさ
export const ICON_COLOR: string = "#FFFFFF"; // ボタンの色
export const DISABLED_COLOR: string = "rgba(0, 0, 0, 0.24)"; // 無効なボタンの色
export const BUTTON_MARGIN: string = "5rem"; // md以上におけるボタン間のmargin

const theme = createTheme({
    palette: {
        primary: {
            main: ICON_COLOR // プライマリーカラー(ボタンの色)を設定
        }
    },
    components: {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    "&:disabled": {
                        color: DISABLED_COLOR
                    }
                }
            }
        }
    }
});

export default function PhotoPage(){
    // モーダルメニュー用のコンテキスト
    const { Modal } = useContext(ModalContext);

    const { boothId } = useParams();

    const {
        setBoothId
    } = useContext(DataContext);

    useEffect(() => {
        if(boothId) setBoothId(boothId);
    }, [boothId]);

    // 初回案内を行う
    useEffect(() => {
        const isSubmitted: boolean = false; // TODO 既に撮影を終えたブースかどうかを取得する処理
        if(isSubmitted) return;

        // 初回アクセスの場合、案内メッセージを表示する
        const toastTexts: string[] = ["撮影ボタンを押して、デザインした花火を打ち上げましょう！"];
        toast.info(
            (<div>
                {toastTexts.map((text, index) => (
                    <div key={index}>{text}</div>
                ))}
            </div>)
        );
    }, []);

    return (
        (BOOTH_ID_LIST.includes(boothId || "")) ? (
            <>
                <div
                    style={{
                        backgroundColor: "black",
                        width: "100vw",
                        height: "100dvh"
                    }}
                >
                    <div
                        style={{
                            overflow: "hidden",
                            zIndex: "0"
                        }}
                    >
                        <Camera/>
                        <CaptureFireworkCanvas/>
                    </div>
                    <ThemeProvider theme={theme}>
                        <ButtonArea theme={theme}/>
                    </ThemeProvider>
                </div>
                <Modal>
                    <ConfirmCapture/>
                </Modal>
            </>
        ) : (
            <ErrorPage/>
        )
    )
}
