import { useContext, useEffect, useRef, useState } from "react";
import { getPrimaryCanvasSize } from "./PickUpSetUp";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Slider } from "@mui/material";
import ClearIcon from "./../images/eraser.png"
import { ICON_SIZE } from "../pages/PhotoPage";
import { DataContext } from "../providers/DataProvider";
import { blobToBase64, getBoothColor } from "../utils/modules";

export default function DrawFirework(){
    const [ paintTool, setPaintTool ] = useState<number>(0); // どのペイントツールを使っているか(0: ペン, 1: 消しゴム)
    const [ thickness, setThickness ] = useState<number>(3); // ペン/消しゴムの太さ
    const [ color, setColor ] = useState<string>("#888888"); // ペンの色

    const {
        boothId,
        fireworkDesign,
        fireworkType,
        setFireworkType
    } = useContext(DataContext);

    const isDrawing = useRef<boolean>(false);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null); // ペイント用canvas要素のref
    const canvasContext = useRef<CanvasRenderingContext2D | null>(null);

    // ブースIDからペンの色を取得する
    useEffect(() => {
        if(!boothId) return;
        const newColor = getBoothColor(boothId);
        if(newColor) setColor(newColor);
    }, [boothId]);

    useEffect(() => {
        if(fireworkType !== 0) setFireworkType(0);
    }, []);

    function getBlobByCanvas(){ // canvasRefからBlobデータを取得する関数
        const canvasElement: HTMLCanvasElement | null = previewCanvasRef.current;
        if(!canvasElement) return;
        canvasElement.toBlob((blob) => {
            if(!blob) return;
            blobToBase64(blob).then(base64 => {
                fireworkDesign.current = base64;
            });
        });
    }

    function startDrawing(e: React.MouseEvent){
        if (!canvasContext.current) return;
        isDrawing.current = true;
        canvasContext.current.lineWidth = thickness ** 2;
        canvasContext.current.lineCap = "round";
        if (paintTool === 0) {
            canvasContext.current.globalCompositeOperation = "source-over";
            canvasContext.current.strokeStyle = color;
        } else {
            canvasContext.current.globalCompositeOperation = "destination-out";
            canvasContext.current.strokeStyle = "rgba(0,0,0,1)";
        }
        canvasContext.current.beginPath();
        canvasContext.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

        draw(e);
    };

    function draw(e: React.MouseEvent){
        if (!isDrawing.current || !canvasContext.current) return;
        canvasContext.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        canvasContext.current.stroke();
    };

    function stopDrawing(){
        if (!canvasContext.current) return;
        isDrawing.current = false;
        canvasContext.current.closePath();
        getBlobByCanvas();
    };

    return (
        <div
            style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                userSelect: "none"
            }}
        >
            <canvas
                ref={(prev) => {
                    if(prev) canvasContext.current = prev.getContext("2d");
                    previewCanvasRef.current = prev;
                }}
                className="bg-img-transparent"
                width={getPrimaryCanvasSize()}
                height={getPrimaryCanvasSize()}
                style={{
                    margin: "0.5rem",
                    border: "1px black solid"
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
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
                    value={thickness}
                    onChange={(_event, value) => {
                        if(typeof value === "number") setThickness(value);
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
