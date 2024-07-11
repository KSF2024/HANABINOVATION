import { useContext, useState } from "react";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import FooterPage from "../components/FooterPage";
import { DataContext } from "../providers/DataProvider";
import { Profile } from "../utils/types";
import { postProfile } from "../utils/apiClient";
import { toast } from "react-toastify";
import { createDivElements } from "../utils/elementGenerator";

export default function LotteryPage({isRevising, setIsRevising}: {
    isRevising: boolean;
    setIsRevising: React.Dispatch<React.SetStateAction<boolean>>;
}){
    const {
        userId,
        setIsApplied,
        setRegistration
    } = useContext(DataContext);

    const [userName, setUserName] = useState("");
    const [mailAddress, setMailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [old, setOld] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [grade, setGrade] = useState("");

    // フォームの入力情報をサーバーに送信する関数
    function postFormData(){
        if(!userId) return;
        const data: Profile = {
            userId,
            userName,
            email: mailAddress,
            ...(phoneNumber && { telephone: phoneNumber }),
            ...(old && { age: Number(old) || 0 }),
            ...(schoolName && { schoolName: schoolName }),
            ...(grade && { schoolGrade: Number(grade) || 0 })
        };

        // 応募データの送信を行う
        postProfile(data).then(res => {
            if(res){
                // 応募データの送信が完了したら、案内を出して応募確認ページに遷移する
                toast.info("抽選会への応募が完了しました！　抽選会の開催までお待ちください。");
                setIsApplied(true);
                setRegistration({
                    userName,
                    receipt: res.data.receipt || ""
                });
                setIsRevising(false);
            }else{
                // 応募データの送信が失敗した際のエラーハンドリング
                const errorTexts: string[] = [
                    "申し訳ございません。抽選会の応募に失敗しました。",
                    "回線状況を見直しの上、再度お試しください。"
                ]
                toast.error(createDivElements(errorTexts), {autoClose: false})
            }
        })
    }

    return (
        <FooterPage>
            <Container
                maxWidth="sm"
                sx={{p: "2rem"}}
                style={{ height: "100%" }}
            >
                <Typography
                    variant="h4"
                    style={{ textAlign: "center" }}
                >
                    抽選応募
                </Typography>
                <Box
                    component="form"
                    onSubmit={(event) => {
                        event.preventDefault(); // onSubmitのデフォルト動作をキャンセル
                        postFormData(); // 応募データの送信を行う
                    }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100%"
                    }}
                >
                    <Stack
                        spacing={3}
                        style={{
                            // maxHeight: "100%",
                            flexGrow: 1,
                            maxHeight: "70%",
                            overflowY: "auto"
                        }}
                    >
                        <TextField
                            required
                            variant="standard"
                            label="氏名"
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
                            label="電話番号(任意)"
                            type="tel"
                            value={phoneNumber}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPhoneNumber(event.target.value);
                            }}
                        />
                        <TextField
                            variant="standard"
                            label="年齢(任意)"
                            type="number"
                            value={old}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setOld(event.target.value);
                            }}
                        />
                        <TextField
                            variant="standard"
                            label="学校名(任意)"
                            value={schoolName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSchoolName(event.target.value);
                            }}
                        />
                        <TextField
                            variant="standard"
                            label="学年(任意)"
                            type="number"
                            value={grade}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setGrade(event.target.value);
                            }}
                        />
                    </Stack>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: isRevising ? "space-between" : "center"
                        }}
                    >
                        {isRevising && (
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{ mt: 3, mb: 3, mr: 7, ml: 7 }}
                                onClick={() => {
                                    setIsRevising(false);
                                }}
                            >
                                戻る
                            </Button>
                        )}
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            sx={{ mt: 3, mb: 3, mr: 7, ml: 7 }}
                        >
                            応募
                        </Button>
                    </div>
                </Box>
            </Container>
        </FooterPage>
    )
}
