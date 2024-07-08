import { Box, Typography } from "@mui/material";

export default function LotteryGuide(){
    return (
        <Box
            sx={{ 
                maxWidth:"100%",
                color: "#FFFFFF",
                background: "linear-gradient(to bottom, #18BAFF, #00CC99)",
                textAlign: "center",
                padding: "1rem",
                overflow: "auto"
            }}
        >

            <Typography sx={{fontSize: "1.5rem", fontWeight: "bold"}}>
                抽選で豪華景品が当たる！
            </Typography>
            <Typography sx={{ fontSize: "1rem", fontWeight: "bold", overflow: "hidden", whiteSpace: "nowrap" }}>
                「AirPods 1名、KINUJOヘアドライヤー 1名」
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>
                ※景品について、当選者には後日メールで郵送のためのご連絡をさせていただきます。
            </Typography>


            <Typography sx={{fontSize: "1.5rem", fontWeight: "bold"}}>
                プロジェクター投影会
            </Typography>

            <Typography sx={{fontSize: "1rem", fontWeight: "bold"}}>
                河原電子ビジネス専門学校
                ITイノベーション科のブースに行ってみましょう！
                あなたが作った花火をプロジェクターで投影できます！
            </Typography>
            <Typography sx={{fontSize: "1rem", fontWeight: "bold"}}>
                さらに！&emsp;応募者の中から先着60名の方にお菓子を配布中！
            </Typography>
        </Box>
    );
}
