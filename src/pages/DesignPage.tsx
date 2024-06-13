import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataContext } from "../providers/DataProvider";
import PickUpSetUp from "../components/PickUpSetUp";

export default function DesignPage(){
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
        <Box
            style={{
                padding: "1rem",
                height: "calc(100dvh - 2rem)",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Typography
                variant="h6"
                style={{ textAlign: "center" }}
            >
                好きな形の花火と火花を選んで、オリジナルの花火を作ろう！
            </Typography>
            <PickUpSetUp/>
        </Box>
    )
}
