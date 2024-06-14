import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataContext } from "../providers/DataProvider";
import PickUpSetUp from "../components/PickUpSetUp";
import { useNavigate } from "react-router-dom";
import DrawFirework from "../components/DrawFirework";
import { BOOTH_ID_LIST } from "../utils/config";
import ErrorPage from "./ErrorPage";
import { toast } from "react-toastify";

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

    // 初回案内を行う
    useEffect(() => {
        const isSubmitted: boolean = false; // TODO 既に撮影を終えたブースかどうかを取得する処理
        if(isSubmitted) return;

        // 初回アクセスの場合、案内メッセージを表示する
        const toastTexts: string[] = ["HANABINOVATIONへようこそ！", "あなただけの花火をデザインして、学園祭の思い出を彩りましょう！", "スタンプラリーを制覇して、抽選会に参加しましょう！"];
        toast.info(
            <div>
                {toastTexts.map((text, index) => (
                    <div key={index}>{text}</div>
                ))}
            </div>
        );
    }, []);

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
