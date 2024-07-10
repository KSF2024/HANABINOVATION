import { Typography, Button, Box, Grid } from "@mui/material";
import FooterPage from "../components/FooterPage";
import { useContext } from "react";
import { DataContext } from "../providers/DataProvider";
import LotteryGuide from "../components/LotteryGuide";

export default function LotteryConfirmationPage({setIsRevising}: {
    setIsRevising: React.Dispatch<React.SetStateAction<boolean>>;
}){
    const { registration } = useContext(DataContext);

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
                            <div>氏名</div>
                            <div>{registration?.userName || ""}</div>
                        </Grid>

                        <Grid item xs={12}>
                            <div>受付番号</div>
                            <div>{registration?.receipt || ""}</div>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                sx={{width: "fit-content"}}
                                onClick={() => setIsRevising(true)}
                            >
                                応募修正
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <LotteryGuide/>
            </Box>
        </FooterPage>
    )
}
