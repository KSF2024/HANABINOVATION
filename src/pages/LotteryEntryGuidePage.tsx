import { Box, Typography } from "@mui/material"
import { LOTTERY_EVENTS } from "../utils/config"
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
                    <Typography>抽選会に応募するには、</Typography>
                    <Typography>すべてのスタンプを</Typography>
                    <Typography>集める必要があります。</Typography>

                    <Typography sx={{paddingTop: "1rem"}}>
                        すべてのブースの花火を作成したのち、
                    </Typography>
                    <Typography>またお越しください。</Typography>

                    <Typography sx={{paddingTop: "1rem"}}>
                        花火が未作成のブースは、マップ機能から確認できます。
                    </Typography>
                </Box>
                <LotteryGuide/>
            </Box>
        </FooterPage>
    )
}
