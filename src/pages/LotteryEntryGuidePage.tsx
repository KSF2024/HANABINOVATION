import { Box, Typography } from "@mui/material"
import { LOTTERY_EVENTS } from "../utils/config"
import FooterPage from "../components/FooterPage"

export default function LotteryEntryGuidePage(){
    return (
    <FooterPage>
        <Box
            sx={{
                height: "100%",
                textAlign: "center",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Typography variant="h4" sx={{padding: "2rem"}}>
                抽選応募
            </Typography>
            <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
            >
                <Typography>抽選応募するには、</Typography>
                <Typography>すべてのスタンプを</Typography>
                <Typography>集める必要があります。</Typography>
                <Typography sx={{paddingTop: "1rem"}}>
                    すべてのブースの花火を作成したのち、
                </Typography>
                <Typography>またお越しください。</Typography>
            </Box>
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

                {LOTTERY_EVENTS.map(eventDate => (
                    <Typography 
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
        </Box>
    </FooterPage>
    )
}