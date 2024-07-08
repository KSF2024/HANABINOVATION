import { Box, Typography, Card, Button, CardContent, CardMedia } from "@mui/material"
import { OPEN_CAMPUS_DATE } from "../utils/config"
import { useContext, useEffect } from "react"
import { sendFireworks } from "../utils/apiClient";
import { DataContext } from "../providers/DataProvider";

export default function SubmitFireworkPage(){
    const { userId } = useContext(DataContext);

    // ユーザーIDが取得できたら、花火受信画面に花火データを送信する
    useEffect(() => {
        if(!userId) return;
        sendFireworks(userId);
    }, [userId]);

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
            花火データの送信、<br/>
            ありがとうございました！
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
            {OPEN_CAMPUS_DATE.map((campusDate, index) =>(
                <a key={index} href={campusDate.url}>
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
                            image={campusDate.imageSrc}>
                        </CardMedia>
                        <CardContent sx={{p: 0, textAlign: "center"}}>
                            {campusDate.title}
                        </CardContent>
                        
                    </Card>
                </a>
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
