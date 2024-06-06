import { useContext } from 'react';
import { FireworksContext } from '../providers/FireworksProvider';

export default function CaptureFireworkCanvas(){
    const { canvasRef } = useContext(FireworksContext);
    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            style={{
                position: "absolute",
                zIndex: "9"
            }}
        />
    );
}
