import axios, { AxiosResponse } from "axios";
import { FireworkData, FireworksData, Profile, Registration } from "./types";

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
            console.log("404 Error: fireworks");
            result = null;
        }else{
            throw new Error(JSON.stringify(response) || "Unexpected error");
        }
    }catch(error){
        console.error("Error fetching fireworks data");
        // throw error;
        result = null;
    }

    return result;
}

// 花火データを登録する関数
export async function postFirework(userId: string, boothId: string, fireworkData: FireworkData): Promise<AxiosResponse | null>{
    const message = {
        userId,
        boothId,
        fireworksData: fireworkData
    };

    const url: string = `${API_ENDPOINT}/fireworks`;

    try{
        const response = await axios.post(url, message);
        return response;
    }catch(error){
        return null;
    }
}

// 応募データを登録する関数
export async function postProfile(profile: Profile): Promise<AxiosResponse | null>{
    const url: string = `${API_ENDPOINT}/profiles`;

    try{
        const response = await axios.post(url, profile);
        return response;
    }catch(error){
        return null;
    }
}

// 応募登録情報を取得する関数
export async function getRegistration(userId: string): Promise<Registration | null>{
    let result: Registration | null = null;
    const url: string = `${API_ENDPOINT}/profiles/${userId}`;

    try {
        const response = await axios.get<Registration>(url);

        if (response.status === 200) {
            result = response.data;
        }else if(response.status === 404) {
            console.log("404 Error: profiles");
            result = null;
        }else{
            throw new Error(JSON.stringify(response) || "Unexpected error");
        }
    }catch(error){
        console.error("Error fetching registration data");
        // throw error;
        result = null;
    }

    return result;
}
