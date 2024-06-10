import { Typography, Button, Box } from "@mui/material";
import FooterPage from "./FooterPage";

export default function LotteryConfirmationPage(){
    return (
        <FooterPage>
            <Box
                sx={{
                    textAlign: "center",
                }}
            >
                <Typography variant="h4">
                    抽選応募確認
                </Typography>

                <Typography sx={{padding: "40px"}}>
                    ユーザー名
                </Typography>

                <Typography sx={{padding: "45px"}}>
                    受付番号
                </Typography>

                <Box sx={{padding: "20px"}}>
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
                        height: "420px" ,
                        color: "#FFFFFF",
                        backgroundColor: "#18BAFF",
                        textAlign: "center",
                    }}
                >

                    <Typography sx={{fontSize: "35px", padding: "12px", fontWeight: "bold"}}>
                        HANABINOVATION
                    </Typography>
                
                    <Typography sx={{fontSize: "30px", fontWeight: "bold"}}>
                        抽選会
                    </Typography>

                    <Typography sx={{fontSize: "26px", fontWeight: "bold"}}>
                        7/13(土) 14:00～
                    </Typography>

                    <Typography sx={{fontSize: "26px", fontWeight: "bold", padding: "9px"}}>
                        7/14(日) 14:00～
                    </Typography>

                    <Typography sx={{fontSize: "30px", fontWeight: "bold"}}>
                        プロジェクター投影会
                    </Typography>

                    <Typography sx={{fontSize: "20px", fontWeight: "bold"}}>
                        河原電子ビジネス専門学校
                        ITイノベーション科のブースに行ってみましょう！
                        あなたが作った花火をプロジェクターで投影できます！
                    </Typography>
                </Box>
            </Box>
        </FooterPage>
    )
}