import { Box, Typography } from "@mui/material"
import FooterPage from "../components/FooterPage"
import LotteryGuide from "../components/LotteryGuide"

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
                    <Typography>
                        抽選会に応募するには、<br/>
                        すべてのスタンプを<br/>
                        集める必要があります。
                    </Typography>

                    <Typography sx={{paddingTop: "1rem"}}>
                        すべてのブースの花火を作成したのち、<br/>
                        またお越しください。
                    </Typography>

                    <Typography sx={{paddingTop: "1rem"}}>
                        花火が未作成のブースは、マップ機能から確認できます。<br/>
                        花火の登録状況に不具合が生じた場合、画面の更新をお試しください。
                    </Typography>
                </Box>
                <LotteryGuide/>
            </Box>
        </FooterPage>
    )
}
