import { Typography, Button, Box, Grid } from "@mui/material";
import FooterPage from "./FooterPage";
import { LOTTERY_EVENTS } from "../utils/config";

const userName: string = "user";
const lotteryNumber: string = "0123";

export default function LotteryConfirmationPage(){
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
                    抽選応募確認
                </Typography>

                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center"
                    }}
                >
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <div>ユーザー名</div>
                            <div>{userName}</div>
                        </Grid>

                        <Grid item xs={12}>
                            <div>受付番号</div>
                            <div>{lotteryNumber}</div>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                sx={{width: "fit-content"}}
                            >
                                応募修正
                            </Button>
                        </Grid>
                    </Grid>
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