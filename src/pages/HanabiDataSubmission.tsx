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
                fontSize: "1.25rem",
                fontWeight: "bold",
                padding: "1rem"
            }}
        >
            <div>花火データの送信、</div>
            <div>ありがとうございました！</div>
        </Typography>

        <Typography
            sx={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                paddingTop: "1rem"
            }}
        >
            OPENCAMPUS
        </Typography>

        <Typography
            sx={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                paddingTop: "1rem"
            }}
        >
            オープンキャンパスに参加しよう！
        </Typography>

        <Box sx={{paddingLeft: "1.56rem", paddingRight: "1.875rem"}}>
            <Typography
                sx={{
                    fontSize: "1rem",
                    fontWeight: "medium",
                    paddingTop: "1.5rem"
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
                padding: "1.5rem",
                display: "flex",
            }}
        >
            {OPENCAMPUS_DATE.map((campusDate) =>(
                <Card 
                    sx={{
                        width: "9.37rem",
                        height: "7.93rem",
                        marginRight: "0.68rem",
                        padding: "0.3rem",
                    }}
                >
                    <CardMedia
                        component="img"
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
                    width: "22rem",
                    height: "2.9rem",
                    backgroundColor: "#FFFFFF",
                    color: "#000000",
                    borderStyle: "solid",
                    borderWidth: "0.0625rem"
                }}
            >
                オープンキャンパスTOPへ
            </Button>
        </a>
    </Box>
}