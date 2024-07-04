import { createContext, ReactNode } from "react";
import { Spark, Star } from "../utils/types";
import { generateFirework, generateSparks, generateStars } from "../utils/hanabi";
import { getImageData, getBoothColor, getImageSrc } from "../utils/modules";

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

// 花火を打ち上げ->爆発->消滅させるアニメーションを実行する関数
async function animateFirework(boothId: string, fireworkType: number, fireworkDesign: Blob | null, sparksType: number){
    const firework = await generateFirework(boothId, fireworkType, fireworkDesign, sparksType);
    if(!firework) return;
    const { stars, sparks } = firework;

    // 花火を打ち上げる
    await raiseSparks(sparks);

    // 花火を爆発させる
    await burstFirework(stars, sparks);

    // 花火を消滅させる
    await fadeFirework(stars, sparks);

    return;
}

// 火花を打ち上げる関数
async function raiseSparks(sparks: Spark[]){
    return;
}

// 花火+火花を爆発させる関数
async function burstFirework(stars: Star[], sparks: Spark[]){
    await Promise.all([
        burstStars(stars),
        burstSparks(sparks)
    ]);
    return;
}

// 花火を爆発させる関数
async function burstStars(stars: Star[]){
    return;
}

// 火花を爆発させる関数
async function burstSparks(sparks: Spark[]){
    return;
}

// 花火+火花を消滅させる関数
async function fadeFirework(stars: Star[], sparks: Spark[]){
    await Promise.all([
        fadeStars(stars),
        fadeSparks(sparks)
    ]);
    return;
}

// 花火を消滅させる関数
async function fadeStars(stars: Star[]){
    return;
}

// 火花を消滅させる関数
async function fadeSparks(sparks: Spark[]){
    return;
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
