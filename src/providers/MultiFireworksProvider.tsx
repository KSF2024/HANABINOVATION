import { createContext, ReactNode } from "react";
import { SCHOOL_DATA } from "src/utils/config";

/* 型定義 */
// contextに渡すデータの型
type MultiFireworksContent = {

};

/* Provider */
const initialData: MultiFireworksContent = {

};

export const MultiFireworksContext = createContext<MultiFireworksContent>(initialData);

// 花火やユーザーの設定データを管理するProvider
export function MultiFireworksProvider({children}: {children: ReactNode}){


    // 花火打ち上げ用関数
    async function burstFireworkSet(boothId: string, fireworkType: number, fireworkDesign: Blob | null, sparksType: number){
        if(!SCHOOL_DATA[boothId]) return;
        const sparksColor: string = SCHOOL_DATA[boothId].color;
        const fireworkImg: string = SCHOOL_DATA[boothId].fireworksImages[fireworkType - 1 as 0 | 1 | 2];
    }

    return (
        <MultiFireworksContext.Provider
            value={{

            }}
        >
            {children}
        </MultiFireworksContext.Provider>
    )
}
