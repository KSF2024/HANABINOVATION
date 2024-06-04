import { useContext } from 'react';
import { CameraContext } from '../providers/CameraProvider';

// カメラの映像を表示するコンポーネント
export default function Camera(){
    const {
        videoRef
    } = useContext(CameraContext);

    return (
        <div
            style={{
                margin: 0,
                padding: 0,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                overflow: "hidden",
                userSelect: "none"
            }}
        >
            <video
                autoPlay
                playsInline
                ref={videoRef}
                style={{
                    minWidth: "100%",
                    minHeight: "100%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}
            />
        </div>
    );
};