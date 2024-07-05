import { createContext, ReactNode, useRef, useState } from "react";
import { RisingStars, Size, Spark, Star } from "../utils/types";
import { generateFirework, generateRisingStars } from "../utils/hanabi";
import { ulid } from "ulidx";

/* 型定義 */
// contextに渡すデータの型
type MultiFireworksContent = {
    canvasRef: React.RefObject<HTMLCanvasElement>;
};

/* Provider */
const initialData: MultiFireworksContent = {
    canvasRef: {} as React.RefObject<HTMLCanvasElement>
};

export const MultiFireworksContext = createContext<MultiFireworksContent>(initialData);

// 花火やユーザーの設定データを管理するProvider
export function MultiFireworksProvider({children}: {children: ReactNode}){
    /* state類 */
    const canvasRef = useRef<HTMLCanvasElement>(null); // アニメーション用Canvas要素の参照

    // 花火データ
    const starsRef = useRef<{[id: string]: Star[]}>({}); // 花火の星(アニメーション完了後の位置)
    const [starsObj, setStarsObj] = useState<{[id: string]: Star[]}>({}); // 花火の星(アニメーション用)
    const [sparksObj, setSparksObj] = useState<{[id: string]: Spark[]}>({}); // 花火の火花(アニメーション用)
    const [risingStarsObj, setRisingStarsObj] = useState<{[id: string]: RisingStars}>({}); // 打ちあがる際の花火の星(アニメーション用)
    const [fireworkSizeObj, setFireworkSizeObj] = useState<{[id: string]: Size}>({}); // 花火の幅

    /* その他関数定義 */
    function getInitialPositions(): {
        initialRiseX: number;
        initialRiseY: number;
        initialBurstX: number;
        initialBurstY: number;
    }{
        const canvasHeight: number = canvasRef.current?.clientHeight || 0;
        const randomX: number = (canvasRef.current?.clientWidth || 0 )  / 2; // TODO 打ち上げ位置の修正
        const randomY: number = (canvasRef.current?.clientHeight || 0) / 2;
        return {
            initialRiseX: randomX,
            initialRiseY: canvasHeight,
            initialBurstX: randomX,
            initialBurstY: randomY
        }
    }

    /* 花火アニメーション用関数定義 */
    // 花火を打ち上げ->爆発->消滅させるアニメーションを実行する関数
    async function animateFirework(boothId: string, fireworkType: number, fireworkDesign: Blob | null, sparksType: number){
        // 位置データを初期化する
        const {
            initialRiseX,
            initialRiseY,
            initialBurstX,
            initialBurstY
        } = getInitialPositions();

        // 花火+火花データを初期化する
        const firework = await generateFirework(boothId, fireworkType, fireworkDesign, sparksType, initialBurstX, initialBurstY);
        if(!firework) return;
        const { stars, sparks } = firework;
        const fireworkId: string = ulid();
        setStarsObj(prev => {
            return {...prev, [fireworkId]: stars};
        });
        setSparksObj(prev => {
            return {...prev, [fireworkId]: sparks};
        });

        // 打ち上げ用の花火の星データを初期化する
        const risingStars: RisingStars = generateRisingStars(boothId, initialRiseX, initialRiseY, initialBurstX, initialBurstY);
        setRisingStarsObj(prev => {
            return {...prev, [fireworkId]: risingStars};
        });

        // 花火を打ち上げる
        await raiseSparks(fireworkId);

        // 花火を爆発させる
        await burstFirework(fireworkId);

        // 花火を消滅させる
        await fadeFirework(fireworkId);

        return;
    }

    // 火花を打ち上げる関数
    async function raiseSparks(fireworkId: string){
        return;
    }

    // 花火+火花を爆発させる関数
    async function burstFirework(fireworkId: string){
        await Promise.all([
            burstStars(fireworkId),
            burstSparks(fireworkId)
        ]);
        return;
    }

    // 花火を爆発させる関数
    async function burstStars(fireworkId: string){
        return;
    }

    // 火花を爆発させる関数
    async function burstSparks(fireworkId: string){
        return;
    }

    // 花火+火花を消滅させる関数
    async function fadeFirework(fireworkId: string){
        await Promise.all([
            fadeStars(fireworkId),
            fadeSparks(fireworkId)
        ]);
        return;
    }

    // 花火を消滅させる関数
    async function fadeStars(fireworkId: string){
        return;
    }

    // 火花を消滅させる関数
    async function fadeSparks(fireworkId: string){
        return;
    }

    return (
        <MultiFireworksContext.Provider
            value={{
                canvasRef
            }}
        >
            {children}
        </MultiFireworksContext.Provider>
    )
}
