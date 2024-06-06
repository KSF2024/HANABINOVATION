import { ThemeProvider, createTheme } from "@mui/material";
import Camera from "../components/Camera";
import ButtonArea from "../components/ButtonArea";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../providers/DataProvider";
import { useParams } from "react-router-dom";
import CaptureFireworkCanvas from "../components/CaptureFireworkCanvas";

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
    const { boothId } = useParams();

    const {
        setBoothId
    } = useContext(DataContext);

    useEffect(() => {
        if(boothId) setBoothId(boothId);
    }, [boothId]);

    return (
        <>
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
        </>
    )
}
