import { useContext, useEffect, useState } from "react";
import { getPrimaryCanvasSize } from "./PickUpSetUp";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Slider } from "@mui/material";
import ClearIcon from "./../images/eraser.png"
import { ICON_SIZE } from "../pages/PhotoPage";
import { DataContext } from "../providers/DataProvider";
import { SCHOOL_DATA } from "../utils/config";

export default function DrawFirework({ previewCanvasRef }: {
    previewCanvasRef: React.RefObject<HTMLCanvasElement>;
}){
    const [ paintTool, setPaintTool ] = useState<number>(0); // どのペイントツールを使っているか(0: ペン, 1: 消しゴム)
    const [ boldness, setBoldness ] = useState<number>(3); // ペン/消しゴムの太さ
    const [ color, setColor ] = useState<string>("#888888"); // ペンの色

    const { boothId } = useContext(DataContext); // ブースID

    // ブースIDからペンの色を取得する
    useEffect(() => {
        if(!boothId) return;
        const newColor: string = SCHOOL_DATA[boothId]?.color || "";
        if(newColor) setColor(newColor);
    }, [boothId]);

    return (
        <div
            style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
            }}
        >
            <canvas
                ref={previewCanvasRef}
                className="bg-img-transparent"
                width={getPrimaryCanvasSize()}
                height={getPrimaryCanvasSize()}
                style={{
                    margin: "0.5rem",
                    border: "1px black solid"
                }}
            />
            <div
                style={{
                    width: "100%"
                }}
            >
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly"
                    }}
                >
                    <IconButton
                        color={(paintTool === 0) ? "primary" : undefined}
                        onClick={() => setPaintTool(0)}
                    >
                        <EditIcon
                            style={{
                                width: `calc(${ICON_SIZE} * 0.8)`,
                                height: `calc(${ICON_SIZE} * 0.8)`,
                            }}
                        />
                    </IconButton>
                    <IconButton
                        color={(paintTool === 1) ? "primary" : undefined}
                        onClick={() => setPaintTool(1)}
                    >
                        <img
                            src={ClearIcon}
                            style={{
                                width: `calc(${ICON_SIZE} * 0.8)`,
                                height: `calc(${ICON_SIZE} * 0.8)`,
                                filter: (paintTool === 1) ? "invert(8%) sepia(99%) saturate(7044%) hue-rotate(209deg) brightness(100%) contrast(78%)" : "invert(45%) sepia(0%) saturate(11%) hue-rotate(143deg) brightness(101%) contrast(93%)"
                            }}
                        />
                    </IconButton>
                </div>
                ペンの太さ
                <Slider
                    aria-label="bold"
                    value={boldness}
                    onChange={(_event, value) => {
                        if(typeof value === "number") setBoldness(value);
                    }}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={5}
                />
            </div>
        </div>
    )
}
