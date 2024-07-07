import FooterPage from "../components/FooterPage";
import mapbooth from "../images/mapbooth.png"

export default function MapPage(){
    return (
        <FooterPage>
            <div 
                style={{
                    maxHeight: "100%",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center"
                }}
            >
                <img 
                    src={mapbooth}
                    style={{maxWidth: "100%", maxHeight: "100%"}}
                >
                </img>
            </div>
        </FooterPage>
    )
}
