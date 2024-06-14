import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataContext } from "../providers/DataProvider";
import PickUpSetUp from "../components/PickUpSetUp";
import { useNavigate } from "react-router-dom";
import DrawFirework from "../components/DrawFirework";
import { BOOTH_ID_LIST } from "../utils/config";
import ErrorPage from "./ErrorPage";

export default function DesignPage(){
    const navigate = useNavigate();
    const [ isDrawing, setIsDrawing ] = useState<boolean>(false); // 「自分で描く」中かどうか
    const { boothId } = useParams(); // URLからブースIDを取得する

    // データを管理するためのcontext
    const {
        setBoothId
    } = useContext(DataContext);

    // 取得したブースIDを保存する
    useEffect(() => {
        if(boothId) setBoothId(boothId);
    }, [boothId]);

    return (
        (BOOTH_ID_LIST.includes(boothId || "")) ? (
            <Box
                style={{
                    padding: "2rem",
                    height: "calc(100dvh - 2rem * 2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Typography
                    variant="h6"
                    style={{ textAlign: "center" }}
                >
                    {isDrawing ? "あなただけのオリジナル花火を描きましょう！" : "好きな形の花火と火花を選んで、オリジナルの花火を作ろう！"}
                </Typography>
                {(isDrawing) ? (
                    <DrawFirework/>
                ) : (
                    <PickUpSetUp/>
                )}
                <div
                    style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        maxWidth: "300px"
                    }}
                >
                    <Button
                        variant="contained"
                        style={{display: "block"}}
                        onClick={() => setIsDrawing(prev => !prev)}
                    >
                        {isDrawing ? "戻る" : "自分で描く"}
                    </Button>
                    <Button
                        variant="contained"
                        style={{display: "block"}}
                        onClick={() => navigate(`/${boothId}/capture-firework`)}
                    >
                        完成
                    </Button>
                </div>
            </Box>
        ) : (
            <ErrorPage/>
        )
    )
}
