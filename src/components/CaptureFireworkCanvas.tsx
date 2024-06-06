import { useContext } from 'react';
import { FireworksContext } from '../providers/FireworksProvider';

export default function CaptureFireworkCanvas(){
    const { canvasRef } = useContext(FireworksContext);
    return (
        <canvas
            ref={canvasRef}
            width={500}
            height={500}
            style={{
                position: "absolute",
                zIndex: "9"
            }}
        />
    );
}
