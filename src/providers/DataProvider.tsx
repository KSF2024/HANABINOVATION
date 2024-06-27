import { createContext, ReactNode, useState, useEffect } from "react";
import { ulid } from "ulidx";
import { FireworksData } from "../utils/types";
import { getFireworksByUserId } from "../utils/apiClient";

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
    fireworkDesign: Blob | null;
    setFireworkDesign: React.Dispatch<React.SetStateAction<Blob | null>>;
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
    fireworkDesign: null,
    setFireworkDesign: () => null
};

export const DataContext = createContext<DataContent>(initialData);

// 花火やユーザーの設定データを管理するProvider
export function DataProvider({children}: {children: ReactNode}){
    const [userId, setUserId] = useState<string | null>(null); // ユーザーID
    const [boothId, setBoothId] = useState<string | null>(null); // 各ブースのID
    const [fireworkType, setFireworkType] = useState<0 | 1 | 2 | 3>(1);// 花火のセットアップの種類
    const [sparksType, setSparksType] = useState<0 | 1 | 2>(0); // 火花のセットアップの種類
    const [fireworkDesign, setFireworkDesign] = useState<Blob | null>(null); // ユーザーが作成した花火のオリジナルデザイン

    // データベースのデータを管理する
    const [ postedFireworksData, setPostedFireworksData ] = useState<FireworksData>({});
    const [ isPostedFirework, setIsPostedFirework ] = useState<boolean>(false);
    const [ isApplied, setIsApplied ] = useState<boolean>(false);
    const [ canApply, setCanApply ] = useState<boolean>(false);

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
        console.log("userId: ", userId)
        // getFireworksByUserId(userId).then(data => {
        //     console.log(data);
        // });
    }, [userId]);

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
                setFireworkDesign
            }}
        >
            {children}
        </DataContext.Provider>
    )
}
