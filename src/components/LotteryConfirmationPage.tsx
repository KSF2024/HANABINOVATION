import { Typography, Button, Box } from "@mui/material";
import FooterPage from "./FooterPage";
import { LOTTERY_EVENTS } from "../utils/config";

export default function LotteryConfirmationPage(){
    return (
            <Box
                sx={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Typography variant="h4">
                    抽選応募確認
                </Typography>

                <Typography sx={{padding: "2rem"}}>
                    ユーザー名
                </Typography>

                <Typography sx={{padding: "2rem"}}>
                    受付番号
                </Typography>

                <Box sx={{padding: "1.25rem"}}>
                    <Button
                        type="button"
                        color="primary"
                        variant="contained"
                    >
                        応募修正
                    </Button>
                </Box>
                <Box
                    sx={{ 
                        width:"100%",
                        height: "26.25rem" ,
                        color: "#FFFFFF",
                        background: "linear-gradient(to bottom, #18BAFF, #00CC99)",
                        textAlign: "center",
                    }}
                >
                    <FooterPage>
                        <Typography 
                            sx={{
                                fontSize: "2rem", 
                                padding: "0.75rem",
                                fontWeight: "bold"
                            }}
                        >
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
                    </FooterPage>
                </Box>
            </Box>
    )
}