import { ThemeProvider, createTheme } from "@mui/material";
import Camera from "../components/Camera";
import ButtonArea from "../components/ButtonArea";

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
    return (
        <>
            <div
                style={{
                    overflow: "hidden"
                }}
            >
                <Camera/>
            </div>
            <ThemeProvider theme={theme}>
                <ButtonArea theme={theme}/>
            </ThemeProvider>
        </>
    )
}
