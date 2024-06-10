<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MapIcon from '@mui/icons-material/Map';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import { styled } from '@mui/system'
import HanabiIcon from '../images/hanabi.png'

const CustomBottomNavigation = styled(BottomNavigation)({
    backgroundColor: '#098FF0', // フッターの背景色
    color: 'white', // フッターの文字色
    borderRadius: '0',
    weight: 393,
    height: 63
  });
=======
import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MapIcon from "@mui/icons-material/Map";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import { styled } from "@mui/system"
import HanabiIcon from "../images/hanabi.png"
>>>>>>> 2c5f83f (merge footer)

const CustomBottomNavigationAction = styled(BottomNavigationAction)({
    color: "white" // アイコンとラベルの色
});

export default function Footer(){
    const navigate = useNavigate();

<<<<<<< HEAD
  return (
    <CustomBottomNavigation onChange={handleNavigation} showLabels  >
      <CustomBottomNavigationAction label="再撮影" value="/photo" icon={<CameraAltIcon />} />
      <CustomBottomNavigationAction label="花火大会" value="/hanabi"  icon={<img src={HanabiIcon} alt="Hanabi" style={{ width: 24, height: 24 }} />} /> 
      <CustomBottomNavigationAction label="マップ" value="/map" icon={<MapIcon />} />
      <CustomBottomNavigationAction label="QR読取" value="/qr" icon={<QrCode2Icon />} />
      <CustomBottomNavigationAction label="抽選応募" value="/lottery" icon={<AdsClickIcon />} />
    </CustomBottomNavigation>
  );
};
=======
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
>>>>>>> 2c5f83f (merge footer)
