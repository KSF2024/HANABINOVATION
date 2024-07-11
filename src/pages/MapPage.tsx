import { CSSProperties, useContext, useEffect, useState } from "react";
import FooterPage from "../components/FooterPage";
import mapbooth from "../images/map_booth.png";
import { SCHOOL_DATA } from "../utils/config";
import { DataContext } from "../providers/DataProvider";
import createdHanabiPin from "../images/マップピン/花火作成済みマップピン.png";

export default function MapPage(){

    const { postedFireworksData } = useContext(DataContext);

    const [ postedBoothIdList, setPostedBoothIdList ] = useState<string[]>([]);

    const getPinStyle = ( positionPinX:number, positionPinY:number ): CSSProperties => ({
        position: "absolute" as "absolute",
        top: `${positionPinY}vh`,
        left: `${positionPinX}vw`,
        transform: "translate(-50%, -50%)",
        width: "15vw",
        filter: "drop-shadow(5px 5px 0px rgba(0, 0, 0, 0.5))",
        animation: postedBoothIdList? "none" :"floatUpDown 2s ease-in-out infinite",
    })

    const getAnimationStyle = () => { //ピンの上下移動を高さを指定する関数
        return `
        @keyframes floatUpDown {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
        }`;
    };

    useEffect(() => {
        if(!postedFireworksData) return;
        const newPostedBoothIdList: string[] = Object.keys(postedFireworksData);
        setPostedBoothIdList(newPostedBoothIdList);
    }, [postedFireworksData]);

    return (
        <FooterPage>
        <style>{getAnimationStyle()}</style>
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
                        style={{width: "100%", height: "90vh"}}
                    >
                    </img>
                </div>
                <div>
                    {Object.entries(SCHOOL_DATA).map(([boothId, schoolInfo], index) => (
                        <div>
                            <img
                                key={index} 
                                src={
                                        postedBoothIdList.includes(boothId) ? (
                                            createdHanabiPin
                                        ) : (
                                            `${schoolInfo.mapPin}`
                                        )
                                    }
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
