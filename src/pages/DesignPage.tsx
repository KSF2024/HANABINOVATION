import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../providers/DataProvider";
import PickUpSetUp from "../components/PickUpSetUp";
import { useNavigate, useParams } from "react-router-dom";
import DrawFirework from "../components/DrawFirework";
import { BOOTH_ID_LIST } from "../utils/config";
import ErrorPage from "./ErrorPage";
import { toast } from "react-toastify";

export default function DesignPage(){
    const navigate = useNavigate();
    const [ isDrawing, setIsDrawing ] = useState<boolean>(false); // 「自分で描く」中かどうか

    // データを管理するためのcontext
    const {
        isPostedFirework
    } = useContext(DataContext);

    // ブースIDを管理する
    const { boothId } = useParams();
    const { setBoothId } = useContext(DataContext);
    useEffect(() => {
        if(boothId) setBoothId(boothId);
    }, [boothId]);

    // 初回案内を行う
    useEffect(() => {
        // 既に撮影を終えたブースなら、初回案内メッセージは表示しない
        if(isPostedFirework === null || isPostedFirework) return;

        // 初回アクセスの場合、案内メッセージを表示する
        const toastTexts: string[] = ["HANABINOVATIONへようこそ！", "あなただけの花火をデザインして、学園祭の思い出を彩りましょう！", "スタンプラリーを制覇して、抽選会に参加しましょう！"];
        toast.info(
            <div>
                {toastTexts.map((text, index) => (
                    <div key={index}>{text}</div>
                ))}
            </div>
        );
    }, [isPostedFirework]);

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
                        onClick={() => {
                            navigate(`/${boothId}/capture-firework`);
                        }}
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
