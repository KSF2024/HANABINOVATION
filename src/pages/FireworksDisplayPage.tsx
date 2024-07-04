import FooterPage from "../components/FooterPage";
import NightSky from "../images/night_sky.png";

export default function FireworksDisplayPage(){
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
                style={{
                    zIndex: 10,
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    maxHeight: "calc(100dvh - 4rem)"
                }}
            />
        </FooterPage>
    )
}
