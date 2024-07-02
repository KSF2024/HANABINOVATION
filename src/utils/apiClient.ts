import axios from "axios";
import { FireworksData } from "./types";

// API呼び出し用のURLを定義する
const API_ENDPOINT: string = "https://vfml5unckb.execute-api.ap-northeast-1.amazonaws.com/dev/api/v1";
const WS_ENDPOINT: string = "wss://pcg2x1k5lj.execute-api.ap-northeast-1.amazonaws.com/dev/";
// const API_ENDPOINT: string = "https://hanabinovation.org/api/v1";
// const WS_ENDPOINT: string = "wss://hanabinovation.org/api/v1/websocket";

// ユーザーIDを元に花火データを取得する関数
export async function getFireworksByUserId(userId: string): Promise<FireworksData | null>{
    let result: FireworksData | null = null;
    const url: string = `${API_ENDPOINT}/fireworks/${userId}`;

    try {
        const response = await axios.get<FireworksData>(url);

        if (response.status === 200) {
            result = response.data;
        }else if(response.status === 404) {
            console.log("404 Error: ", response);
            result = null;
        }else{
            throw new Error(JSON.stringify(response) || "Unexpected error");
        }
    }catch(error){
        console.error("Error fetching fireworks data:", error);
        // throw error;
        result = null;
    }

    return result;
}
