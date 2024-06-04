import { useContext } from 'react';
import { CameraContext } from '../providers/CameraProvider';

// カメラの映像を表示するコンポーネント
export default function Camera(){
    const {
        videoRef
    } = useContext(CameraContext);

    return (
        <video ref={videoRef} autoPlay playsInline/>
    );
};