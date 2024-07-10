import { useContext, useEffect } from "react";
import NightSky from "../images/night_sky.png";
import { MultiFireworksContext } from "../providers/MultiFireworksProvider";

export default function FireworksReceiver(){
    const {
        canvasRef,
        setPageMode
    } = useContext(MultiFireworksContext);

    useEffect(() => {
        setPageMode("simultaneously-raise");
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100dvh"
            }}
        >
            <img
                src={NightSky}
                style={window.innerWidth > 960 ? {
                    width: "100%",
                    height: "100%"
                } : {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center"
                }}
            />
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{
                    zIndex: 1000,
                    position: "absolute",
                    top: "0",
                    left: "0"
                }}
            />
        </div>
    )
}
