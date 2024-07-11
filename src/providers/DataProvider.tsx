import { createContext, ReactNode, useState, useEffect, useRef } from "react";
import { ulid } from "ulidx";
import { FireworksData, Registration } from "../utils/types";
import { getFireworksByUserId, getRegistration } from "../utils/apiClient";
import { BOOTH_ID_LIST } from "../utils/config";

/* 型定義 */
// contextに渡すデータの型
type DataContent = {
    userId: string | null;
    boothId: string | null;
    setBoothId: React.Dispatch<React.SetStateAction<string | null>>;
    fireworkType: 0 | 1 | 2 | 3;
    setFireworkType: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3>>;
    sparksType: 0 | 1 | 2;
    setSparksType: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
    fireworkDesign: React.MutableRefObject<string | null>;
    isPostedFirework: boolean | null;
    setIsPostedFirework: React.Dispatch<React.SetStateAction<boolean | null>>;
    isApplied: boolean;
    setIsApplied: React.Dispatch<React.SetStateAction<boolean>>;
    canApply: boolean;
    registration: Registration | null;
    postedFireworksData: FireworksData | null;
    setPostedFireworksData: React.Dispatch<React.SetStateAction<FireworksData | null>>;
};

/* Provider */
const initialData: DataContent = {
    userId: null,
    boothId: null,
    setBoothId: () => null,
    fireworkType: 1,
    setFireworkType: () => 0,
    sparksType: 0,
    setSparksType: () => 0,
    fireworkDesign: {} as any,
    isPostedFirework: null,
    setIsPostedFirework: () => {},
    isApplied: false,
    setIsApplied: () => {},
    canApply: false,
    registration: null,
    postedFireworksData: null,
    setPostedFireworksData: () => {}
};

export const DataContext = createContext<DataContent>(initialData);

// 花火やユーザーの設定データを管理するProvider
export function DataProvider({children}: {children: ReactNode}){
    const [userId, setUserId] = useState<string | null>(null); // ユーザーID
    const [boothId, setBoothId] = useState<string | null>(null); // 各ブースのID
    const [fireworkType, setFireworkType] = useState<0 | 1 | 2 | 3>(1);// 花火のセットアップの種類
    const [sparksType, setSparksType] = useState<0 | 1 | 2>(0); // 火花のセットアップの種類
    const fireworkDesign = useRef<string | null>(null); // ユーザーが作成した花火のオリジナルデザイン

    // データベースのデータを管理する
    const [ postedFireworksData, setPostedFireworksData ] = useState<FireworksData | null>(null);
    const [ isPostedFirework, setIsPostedFirework ] = useState<boolean | null>(null);
    const [ isApplied, setIsApplied ] = useState<boolean>(false);
    const [ canApply, setCanApply ] = useState<boolean>(false);
    const [ registration, setRegistration ] = useState<Registration | null>(null);

    // userIdを初期化する
    useEffect(() => {
        let result: string = "";
        const prevUserId: string | null = localStorage.getItem("userId");
        if(prevUserId){
            // localStorageにユーザーIDが保存されているならそれを使用する
            result = prevUserId;
        }else{
            // localStorageにユーザーIDが保存されていないなら新たにユーザーIDを生成する
            const newUserId: string = ulid();
            result = newUserId;
            localStorage.setItem("userId", newUserId);
        }
        setUserId(result);
    }, []);

    // userIdが初期化できたら、現在登録済みの花火データを取得する
    useEffect(() => {
        if(!userId) return;
        console.log("userId: ", userId);

        (async () => {
            const fireworksData = await getFireworksByUserId(userId);
            if(fireworksData){
                // 現在登録済みの花火データを保存する
                setPostedFireworksData(fireworksData);
            }

            // 応募済みかどうかを取得する
            const registrationData = await getRegistration(userId);
            if(registrationData){
                setIsApplied(true); // 応募データが存在するなら、応募済みとして状態を管理する
                setRegistration(registrationData);
            }
        })();
    }, [userId]);

    // postedFireworksData(現在登録済みの花火のデータ)が取得出来たら、応募可能かどうか、応募済みかどうかを取得する
    useEffect(() => {
        if(!postedFireworksData) return;
        // 全てのブースを回ったかどうかを取得する
        const boothIdList: string[] = Object.keys(postedFireworksData); // 回ったことのあるブース一覧
        const newCanApply: boolean = BOOTH_ID_LIST.every((value) => { // 全てのブースを回ったかどうか
            return boothIdList.includes(value);
        });
        setCanApply(newCanApply);
    }, [postedFireworksData]);

    // userIdとboothIdと送信済み花火データが初期化出来たら、現在訪れているブースで花火を作成済みかどうかを取得する
    useEffect(() => {
        if(!userId) return;
        if(!boothId) return;
        if(!postedFireworksData) return;
        const newIsPostedFirework: boolean = Boolean(postedFireworksData[boothId]);
        setIsPostedFirework(newIsPostedFirework);
    }, [userId, boothId, postedFireworksData]);

    return (
        <DataContext.Provider
            value={{
                userId,
                boothId,
                setBoothId,
                fireworkType,
                setFireworkType,
                sparksType,
                setSparksType,
                fireworkDesign,
                isPostedFirework,
                setIsPostedFirework,
                isApplied,
                setIsApplied,
                canApply,
                registration,
                postedFireworksData,
                setPostedFireworksData
            }}
        >
            {children}
        </DataContext.Provider>
    )
}
