import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MapIcon from "@mui/icons-material/Map";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import { styled } from "@mui/system"
import HanabiIcon from "../images/hanabi.png"
import { useContext } from "react";
import { DataContext } from "../providers/DataProvider";

const CustomBottomNavigationAction = styled(BottomNavigationAction)({
    color: "white" // アイコンとラベルの色
});

export default function Footer(){
    const navigate = useNavigate();
    const { boothId } = useContext(DataContext);

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
                value={`/${boothId}/capture-firework`}
                label="再撮影"
                icon={<CameraAltIcon/>}
            />
            <CustomBottomNavigationAction
                value={`/${boothId}/show-fireworks`}
                label="花火大会"
                icon={<img src={HanabiIcon} alt="Hanabi" style={{ width: 24, height: 24 }}/>}
            /> 
            <CustomBottomNavigationAction
                value={`/${boothId}/map`}
                label="マップ"
                icon={<MapIcon/>}
            />
            <CustomBottomNavigationAction
                value={`/${boothId}/scan-qr`}
                label="QR読取"
                icon={<QrCode2Icon/>}
            />
            <CustomBottomNavigationAction
                value={`/${boothId}/enter-lottery`}
                label="抽選応募"
                icon={<AdsClickIcon/>}
            />
        </BottomNavigation>
    )
}
