import { createContext, ReactNode, useState, useEffect, useRef, useContext } from 'react';
import { Spark, Star } from '../utils/hanabi';
import { DataContext } from './DataProvider';
import { getImageSrc, schoolData, validateBoothId } from '../utils/config';

/* 型定義 */
// contextに渡すデータの型
type FireworksContent = {

};

/* Provider */
const initialData: FireworksContent = {

};

export const FireworksContext = createContext<FireworksContent>(initialData);

// 花火やユーザーの設定データを管理するProvider
export function FireworksProvider({children}: {children: ReactNode}){
    /* state等 */
    // 画像とcanvasの設定情報
    const [imageSrc, setImageSrc]= useState<string[]>([]);
    const [imageDataObj, setImageDataObj] = useState<{[id: string]: ImageData}>({}); // 読み込む画像データ
    const canvasRef = useRef<HTMLCanvasElement>(null); // アニメーション用Canvas要素の参照

    // 花火の設定情報
    const starsRef = useRef<{[id: string]: Star[]}>({}); // 花火の星(アニメーション完了後の位置)
    const [starsObj, setStarsObj] = useState<{[id: string]: Star[]}>({}); // 花火の星(アニメーション用)
    const [sparksObj, setSparksObj] = useState<{[id: string]: Spark[]}>({}); // 花火の火花(アニメーション用)
    const [fireworksSizeObj, setFireworksSizeObj] = useState<{[id: string]: {width: number, height: number}}>({}); // 花火の幅
    const [launchAngle, setLaunchAngle] = useState<number>(0); // 花火の打ち上げ角度 (デフォルト0度)
    const [fireworksPositionObj, setFireworksPositionObj] = useState<{[id: string]: {goalX: number, goalY: number}}>({}); // 花火が打ち上がる位置
    const [sparksColorObj, setSparksColorObj] = useState<{[id: string]: string}>({}); // 火花の色

    // アニメーションの設定情報
    const [fireworksAnimationFrameIdObj, setFireworksAnimationFrameIdObj] = useState<{[id: string]: number}>({}); // 花火アニメーション用ID
    const isFinishedFireworksAnimationObj = useRef<{[id: string]: boolean}>({}); // 花火アニメーションが終了したかどうか
    const [sparksAnimationFrameIdObj, setSparksAnimationFrameIdObj] = useState<{[id: string]: number}>({}); // 火花アニメーション用ID
    const isFinishedSparksAnimationObj = useRef<{[id: string]: boolean}>({}); // 火花アニメーションが終了したかどうか

    const {
        boothId,
        fireworkType,
        sparksType,
        fireworkDesign
    } = useContext(DataContext);

    /* 関数定義 */
    // 花火撮影画面用に、画像データを初期化する関数
    function initializeImageSrc(): void{
        if(!boothId) return;
        const newImageSrc: string | null = getImageSrc(boothId, fireworkType, fireworkDesign);
        console.log(newImageSrc);

        if(!newImageSrc) return;
        setImageSrc([newImageSrc]);
    }

    useEffect(() => {
        initializeImageSrc()
    }, [boothId])

    return (
        <FireworksContext.Provider
            value={{

            }}
        >
            {children}
        </FireworksContext.Provider>
    )
}
