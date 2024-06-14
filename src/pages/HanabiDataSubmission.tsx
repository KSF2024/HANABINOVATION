import { Box, Typography, Card, Button, CardContent, CardMedia } from "@mui/material"
import { OPENCAMPUS_DATE } from "../utils/config"
import OPENCAMPUSIMAGE from "./../images/opencampus_06_15.png"

export default function HanabiDataSubmission(){
    return <Box 
        sx={{
            width: "100%",
            height: "100vh",
            color: "#FFFFFF",
            background: "linear-gradient(to bottom, #18BAFF, #00CC99)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowX: "scroll"
        }}
    >
        <Typography
            sx={{
                fontSize: "20px",
                fontWeight: "bold",
                padding: "58px"
            }}
        >
            花火データの送信、
            <div/>
            ありがとうございました！
        </Typography>

        <Typography
            sx={{
                fontSize: "36px",
                fontWeight: "bold",
                paddingTop: "80px"
            }}
        >
            OPENCAMPUS
        </Typography>

        <Typography
            sx={{
                fontSize: "20px",
                fontWeight: "bold",
                paddingTop: "18px"
            }}
        >
            オープンキャンパスに参加しよう！
        </Typography>

        <Box sx={{paddingLeft: "25px", paddingRight: "30px"}}>
            <Typography
                sx={{
                    fontSize: "16px",
                    fontWeight: "medium",
                    paddingTop: "18px"
                }}
            >
                実際に校舎の実習室･教室など、設備･施設を見学して、学校のイメージをふくらませよう！
                在校生スタッフもいるので、キャンパスライフや授業の雰囲気など、
                皆の気になることを何でも聞けます！
                お忙しい方は平日夜・休日の個別相談をご利用ください。
            </Typography>
        </Box>

        <Box 
            sx={{
                padding: "25px",
                display: "flex",
            }}
        >
            {OPENCAMPUS_DATE.map((campusDate) =>(
                <Card 
                    sx={{
                        width: "150px",
                        height: "127px",
                        marginRight: "11px",
                        padding: "5px",
                    }}
                >
                    <CardMedia
                        component="img"
                        height="60"
                        image={OPENCAMPUSIMAGE}>
                    </CardMedia>
                    <a href={campusDate[0].url}>
                        <CardContent>
                            {campusDate[0].date}（土）オープンキャンパス
                        </CardContent>
                    </a>
                </Card>
            ))}
        </Box>
        <a href="https://kbc.kawahara.ac.jp/academics/it_cyber/">
            <Button 
                sx={{
                    width: "367px",
                    height: "45px",
                    backgroundColor: "#FFFFFF",
                    color: "#000000",
                    borderStyle: "solid",
                    borderWidth: "1px"
                }}
            >
                オープンキャンパスTOPへ
            </Button>
        </a>
    </Box>
}