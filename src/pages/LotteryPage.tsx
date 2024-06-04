import { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Box, Button, Container, Icon, Stack, TextField, Typography } from "@mui/material";

export default function LotteryPage(){
    const [userName, setUserName] = useState("");
    const [mailAddress, setMailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [old, setOld] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [grade, setGrade] = useState("");

    // フォームの入力情報をサーバーに送信する関数
    function postFormData(){
        // TODO フォーム送信処理の実装
        alert("フォームを送信しました");
    }

    return (
        <Container
            maxWidth="sm"
            sx={{ pt: 5 }}
            style={{ height: "100%" }}
        >
            <Typography variant="h4">抽選応募</Typography>
            <Box
                component="form"
                onSubmit={postFormData}
                sx={{mt: 1}}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "50%"
                }}
            >
                <Stack
                    spacing={3}
                    style={{
                        // maxHeight: "100%",
                        maxHeight: "30%",
                        overflowY: "auto"
                    }}
                >
                    <TextField
                        required
                        variant="standard"
                        label="ユーザー名"
                        value={userName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setUserName(event.target.value);
                        }}
                    />
                    <TextField
                        required
                        variant="standard"
                        label="メールアドレス"
                        value={mailAddress}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setMailAddress(event.target.value);
                        }}
                    />
                    <TextField
                        variant="standard"
                        label="電話番号"
                        value={phoneNumber}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPhoneNumber(event.target.value);
                        }}
                    />
                    <TextField
                        variant="standard"
                        label="年齢"
                        value={old}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setOld(event.target.value);
                        }}
                    />
                    <TextField
                        variant="standard"
                        label="学校名"
                        value={schoolName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSchoolName(event.target.value);
                        }}
                    />
                    <TextField
                        variant="standard"
                        label="学年"
                        value={grade}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setGrade(event.target.value);
                        }}
                    />
                </Stack>
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{mt: 3}}
                >
                    応募
                </Button>
            </Box>
        </Container>
    )
}
