import { createContext, ReactNode, useState, useEffect } from 'react';
import { ulid } from "ulidx";

/* 型定義 */
// contextに渡すデータの型
type DataContent = {
    userId: string | null;
    boothId: string | null;
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
    const [sparksType, setSparksType] = useState<0 | 1 | 2>(0); // ユーザーが作成した花火のオリジナルデザイン
    const [fireworkDesign, setFireworkDesign] = useState<Blob | null>(null); // 火花のセットアップの種類

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

    return (
        <DataContext.Provider
            value={{
                userId,
                boothId,
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
