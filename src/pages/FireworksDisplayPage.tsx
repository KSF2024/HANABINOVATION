import { useContext, useEffect } from "react";
import FooterPage from "../components/FooterPage";
import NightSky from "../images/night_sky.png";
import { MultiFireworksContext } from "../providers/MultiFireworksProvider";

const footerHeight: number = 64;

export default function FireworksDisplayPage(){
    const {
        canvasRef,
        setPageMode
    } = useContext(MultiFireworksContext);

    useEffect(() => {
        setPageMode("show-fireworks");
    }, []);

    return (
        <FooterPage>
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
                height={window.innerHeight - footerHeight}
                style={{
                    zIndex: 1000,
                    position: "absolute",
                    top: "0",
                    left: "0"
                }}
            />
        </FooterPage>
    )
}
