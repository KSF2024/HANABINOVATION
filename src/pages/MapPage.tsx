import { CSSProperties, useContext } from "react";
import FooterPage from "../components/FooterPage";
import mapbooth from "../images/map_booth.png";
import { SCHOOL_DATA } from "../utils/config";
import { DataContext } from "../providers/DataProvider";

export default function MapPage(){

    const schoolEntries = Object.entries(SCHOOL_DATA)

    const { postedFireworksData } = useContext(DataContext);

    const getPinStyle = ( positionPinX:number, positionPinY:number ): CSSProperties =>({
        position: "absolute" as "absolute",
        top: `${positionPinY}vh`,
        left: `${positionPinX}vw`,
        transform: "translate(-50%, -50%)",
        width: "15vw",
        filter: "drop-shadow(5px 5px 0px rgba(0, 0, 0, 0.5))",
        animation: 'floatUpDown 2s ease-in-out infinite',
    })

    useEffect(() => {
        if(!postedFireworksData) return;
        const postedBoothIdList: string[] = Object.keys(postedFireworksData);
    }, [postedFireworksData ]);

    return (
        <FooterPage>
            <div>
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
                        style={{width: "100%", height: "96vh"}}
                    >
                    </img>
                </div>
                <div>
                    {schoolEntries.map(([schoolName,schoolInfo], index) => (
                        <div>
                            <img
                                key={index} 
                                src={`${schoolInfo.mapPin}`}
                                style={
                                    getPinStyle(
                                        schoolInfo.positionPinX,
                                        schoolInfo.positionPinY
                                    )
                                }
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    top: `${schoolInfo.schoolNameY}vh`,
                                    left: `${schoolInfo.schoolNameX}vw`,
                                    width: `${schoolInfo.schoolNameWidth}vw`,
                                    fontSize: "3.5vw",
                                    color: "#FFFFFF"
                                }}
                            >
                                {schoolInfo.schoolName}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FooterPage>
    )
}
