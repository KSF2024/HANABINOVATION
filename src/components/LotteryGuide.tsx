import { Box, Typography } from "@mui/material";
import { LOTTERY_EVENTS } from "../utils/config";

export default function LotteryGuide(){
    return (
        <Box
            sx={{ 
                maxWidth:"100%",
                color: "#FFFFFF",
                background: "linear-gradient(to bottom, #18BAFF, #00CC99)",
                textAlign: "center",
                padding: "1rem"
            }}
        >
            <Typography variant="h4">
                HANABINOVATION
            </Typography>

            <Typography sx={{fontSize: "1.5rem", fontWeight: "bold"}}>
                抽選会
            </Typography>

            {LOTTERY_EVENTS.map((eventDate, index) => (
                <Typography 
                    key={index}
                    sx={{
                        fontSize: "1.45rem",
                        fontWeight: "bold",
                    }}>
                    {eventDate}
                </Typography>
            ))}

            <Typography sx={{fontSize: "1.5rem", fontWeight: "bold"}}>
                プロジェクター投影会
            </Typography>

            <Typography sx={{fontSize: "1.1rem", fontWeight: "bold"}}>
                河原電子ビジネス専門学校
                ITイノベーション科のブースに行ってみましょう！
                あなたが作った花火をプロジェクターで投影できます！
            </Typography>
        </Box>
    );
}
