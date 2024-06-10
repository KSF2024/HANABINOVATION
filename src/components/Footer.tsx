import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MapIcon from "@mui/icons-material/Map";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import { styled } from "@mui/system"
import HanabiIcon from "../images/hanabi.png"

const CustomBottomNavigationAction = styled(BottomNavigationAction)({
    color: "white" // アイコンとラベルの色
});

export default function Footer(){
    const navigate = useNavigate();

    return (
        <BottomNavigation
            showLabels
            onChange={(_event: React.SyntheticEvent<Element, Event>, value: string) => {
                // 指定パスにURL遷移を行う
                navigate(value);
            }}
            sx={{
                backgroundColor: "#098FF0" // フッターの背景色
            }}
            style={{
                height: "4rem"
            }}
        >
            <CustomBottomNavigationAction
                value="/001/capture-firework" // TODO ブースIDの指定
                label="再撮影"
                icon={<CameraAltIcon/>}
            />
            <CustomBottomNavigationAction
                value="/firework-show"
                label="花火大会"
                icon={<img src={HanabiIcon} alt="Hanabi" style={{ width: 24, height: 24 }}/>}
            /> 
            <CustomBottomNavigationAction
                value="/map?booth=001" // TODO ブースIDの指定
                label="マップ"
                icon={<MapIcon/>}
            />
            <CustomBottomNavigationAction
                value="/scan-qr"
                label="QR読取"
                icon={<QrCode2Icon/>}
            />
            {false && (
                <CustomBottomNavigationAction
                    value="/enter-lottery"
                    label="抽選応募"
                    icon={<AdsClickIcon/>}
                />
            )}
        </BottomNavigation>
    )
}
