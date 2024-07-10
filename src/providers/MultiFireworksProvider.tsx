import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { FireworkTypeInfo, Point, RisingAfterImage, RisingStars, Spark, Star } from "../utils/types";
import { drawSpark, drawStar, generateFirework, generateRisingStars, initializeStars } from "../utils/hanabi";
import { ulid } from "ulidx";
import { getRandomPositionInBox, playSound, sleep } from "../utils/modules";
import { getFireworks } from "../utils/apiClient";
import raiseSE from "./../audio/打ち上げ花火1.mp3";
import burstSE from "./../audio/打ち上げ花火2.mp3";

/* 型定義 */
// contextに渡すデータの型
type MultiFireworksContent = {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    animateFirework(boothId: string | null, fireworkType: number, fireworkDesign: string | null, sparksType: number): Promise<void>;
    pageMode: string | null;
    setPageMode: React.Dispatch<React.SetStateAction<string | null>>;
    pushFireworksData(data: FireworkTypeInfo): void;
    interruptFireworks(array: FireworkTypeInfo[]): Promise<void>;
};

/* Provider */
const initialData: MultiFireworksContent = {
    canvasRef: {} as React.RefObject<HTMLCanvasElement>,
    animateFirework: () => Promise.resolve(),
    pageMode: null,
    setPageMode: () => {},
    pushFireworksData: () => {},
    interruptFireworks: () => Promise.resolve()
};

export const MultiFireworksContext = createContext<MultiFireworksContent>(initialData);

// 花火大会で、花火を打ち上げるランダムな間隔を取得する関数
function getRandomInterval(minMs: number = 500, maxMs: number = 3000): number{
    // ランダムな秒数（0.5秒から3秒）
    return Math.floor(Math.random() * maxMs) + minMs;
}

// 花火やユーザーの設定データを管理するProvider
export function MultiFireworksProvider({children}: {children: ReactNode}){
    /* state類 */
    const canvasRef = useRef<HTMLCanvasElement>(null); // アニメーション用Canvas要素の参照
    const [pageMode, setPageMode] = useState<string | null>(null); // 現在どのページを開いているか

    // 花火データ
    const [starsObj, setStarsObj] = useState<{[id: string]: {stars: Star[], initialPosition: Point}}>({}); // 花火の星(アニメーション用)
    const [sparksObj, setSparksObj] = useState<{[id: string]: Spark[]}>({}); // 花火の火花(アニメーション用)
    const [risingStarsObj, setRisingStarsObj] = useState<{[id: string]: RisingStars}>({}); // 打ちあがる際の花火の星(アニメーション用)

    // 花火大会用花火データ
    const [fireworksData, setFireworksData] = useState<FireworkTypeInfo[] | null>(null);
    const intervalRef = useRef<number | null>(null);

    /* その他関数定義 */
    // 花火の打ち上げ初期位置・爆発中心位置を求める関数
    function getInitialPositions(): {
        initialRiseX: number;
        initialRiseY: number;
        initialBurstX: number;
        initialBurstY: number;
    }{
        // 花火の大きさを求める
        const fireworkSize: number = getFireworkSize();

        // 爆発中心位置のx座標を求める
        const canvasWidth: number = canvasRef.current?.clientWidth || 0
        const randomX: number = getRandomPositionInBox(fireworkSize, canvasWidth - 100) + 50;

        // 爆発中心位置のy座標を求める
        const canvasHeight: number = canvasRef.current?.clientHeight || 0;
        const randomY: number = getRandomPositionInBox(fireworkSize, canvasHeight * 0.7) + 50;

        return {
            initialRiseX: randomX,
            initialRiseY: canvasHeight,
            initialBurstX: randomX,
            initialBurstY: randomY
        }
    }

    // 花火全体の大きさを求める関数
    function getFireworkSize(): number{
        const starsSize: number = 300; // 花火単体の大きさ
        const sparksRate: number = 1.1; // 花火に対する火花の大きさの倍率
        const margin: number = 0; // 花火のマージン
        const holeFireworkSize: number = starsSize * sparksRate + margin; // 花火全体の大きさ
        const minSize: number = (canvasRef.current?.clientWidth || holeFireworkSize) * 0.4; // 花火の大きさの最大値
        return Math.min(holeFireworkSize, minSize);
    }

    // 花火の大きさの倍率を求める関数
    function getFireworkSizeRate(): number{
        const starsSize: number = 300; // 花火単体の大きさ
        const sparksRate: number = 1.1; // 花火に対する火花の大きさの倍率
        const margin: number = 0; // 花火のマージン
        const holeFireworkSize: number = starsSize * sparksRate + margin; // 花火全体の大きさ

        const fireworkSize: number = getFireworkSize();

        return fireworkSize / holeFireworkSize;
    }

    /* 花火アニメーション用関数定義 */
    // 花火を打ち上げ->爆発->消滅させるアニメーションを実行する関数
    async function animateFirework(boothId: string | null, fireworkType: number, fireworkDesign: string | null, sparksType: number, enableSound: number = 0){
        // 位置データを初期化する
        const {
            initialRiseX,
            initialRiseY,
            initialBurstX,
            initialBurstY
        } = getInitialPositions();

        const fireworkId: string = ulid();

        // 花火+火花データを初期化する
        const firework = await generateFirework(boothId, fireworkType, fireworkDesign, sparksType, initialBurstX, initialBurstY);
        if(!firework) return;
        const { stars, sparks } = firework;

        // 打ち上げ用の花火の星データを初期化する
        const risingStars: RisingStars = generateRisingStars(boothId, initialRiseX, initialRiseY, initialBurstX, initialBurstY);

        // 花火を打ち上げる
        if(enableSound === 2) playSound(raiseSE);
        await raiseSparks(fireworkId, risingStars, initialRiseY);

        // 花火を爆発させる
        if(enableSound) playSound(burstSE);
        await burstFirework(fireworkId, fireworkType, stars, sparks, initialBurstX, initialBurstY);

        await sleep(100);

        // 花火を消滅させる
        await fadeFirework(fireworkId, fireworkType);

        // 花火データを消去する
        setStarsObj(prevStarsObj => {
            const {[fireworkId]: _, ...rest} = prevStarsObj;
            return rest;
        });

        // 火花データを消去する
        setSparksObj(prevSparksObj => {
            const {[fireworkId]: _, ...rest} = prevSparksObj;
            return rest;
        });

        return;
    }

    // 花火の星を打ち上げる関数
    async function raiseSparks(fireworkId: string, risingStars: RisingStars, initialY: number){
        // 打ち上げ用花火の星を初期化する
        setRisingStarsObj(prev => {
            return {...prev, [fireworkId]: risingStars};
        });

        // 花火打ち上げアニメーションを開始する
        return new Promise<void>((resolve) => {
            let frameId: number | null = null;
            let isFinishedAnimation: boolean = false;

            function riseAnimation(){
                const defaultSpeed: number = 10; // 花火の基本速度
                const minSpeed: number = 1; // 花火の最低速度
                const fadeSpeed: number = 3; // 花火が消える速度
                const afterImageMaxAngle: number = 10; // 残像の最大角度

                setRisingStarsObj(prevStarsObj => {
                    const prevStars: RisingStars = prevStarsObj[fireworkId];
                    const capitalStar = {...prevStars}.capitalStar;
                    const afterImageStars: RisingAfterImage[] = [];

                    // 花火の目標位置への達成率を求める
                    const goalY: number = prevStars.goalPositions.y;
                    const distanceAchievement: number = getDistanceAchievement(capitalStar.y, goalY);

                    // 花火の速度を求める
                    const speed: number = Math.max(defaultSpeed * distanceAchievement, minSpeed);

                    if(distanceAchievement <= 0.01){
                        // 花火が停止し、打ち上げが完了したら、透明度を下げていく
                        capitalStar.color.alpha -= fadeSpeed;

                        // 打ち上げ用花火本体の透明度が0になったら、アニメーションを終了する
                        if(capitalStar.color.alpha <= 0){
                            // 少し待機し、花火の打ち上げ処理を終了する
                            sleep(10).then(() => {
                                isFinishedAnimation = true;
                                resolve();
                            });
                        }
                    }else{
                        // 花火が頂点に達していない場合、花火の打ち上げ処理を行う
                        // 花火の移動距離を求める
                        const dy: number = speed;

                        // 花火を移動させる
                        capitalStar.y -= dy;

                        // 花火が目標位置を超えたなら、目標位置にグリッドさせる
                        if(capitalStar.y <= goalY) capitalStar.y = goalY;
                    }

                    // 花火の残像の生成処理を行う
                    // 花火の残像の角度を求める
                    const afterImageAngle: number = Math.random() * afterImageMaxAngle * 2 - afterImageMaxAngle;
                    const afterImageRadian: number = (90 + afterImageAngle) % 360 / 180 * Math.PI;

                    // 花火の残像を生成する
                    const newAfterImage: RisingAfterImage = {
                        star: { ...capitalStar, color: {...capitalStar.color} },
                        speed: defaultSpeed / 10,
                        radian: afterImageRadian
                    }

                    // 生成した花火の残像を追加する
                    afterImageStars.push(newAfterImage);

                    // 花火の残像の移動処理を行う
                    prevStars.afterImageStars.forEach(risingAfterImage => {
                        // 花火の残像の透明度を下げる
                        risingAfterImage.star.color.alpha -= fadeSpeed;

                        if(risingAfterImage.star.color.alpha > 0){
                            // 花火の残像の大きさを小さくする
                            risingAfterImage.star.radius *= 0.99;

                            // 花火の残像の移動速度を小さくする
                            risingAfterImage.speed *= 0.99;

                            // 花火の残像の移動距離を求める
                            const dx: number = risingAfterImage.speed * Math.cos(risingAfterImage.radian);
                            const dy: number = risingAfterImage.speed * Math.sin(risingAfterImage.radian);

                            // 花火の残像を移動させる
                            risingAfterImage.star.x += dx;
                            risingAfterImage.star.y += dy;

                            // 透明度が残っている場合、花火の残像データを保持する
                            afterImageStars.push(risingAfterImage);
                        }
                    })
                    return {...prevStarsObj, [fireworkId]: {...prevStars, capitalStar, afterImageStars}};
                })

                if(isFinishedAnimation){
                    // 花火のアニメーションが終了したら、アニメーションを停止する
                    if(frameId !== null) cancelAnimationFrame(frameId);
                    return;
                }else{
                    // 次のフレームを要求
                    frameId = requestAnimationFrame(riseAnimation);
                }

                // 初期位置から目標位置までにおける、現在位置の達成率(0: 達成, 1: 未達成)を求める関数
                function getDistanceAchievement(y: number, goalY: number): number{
                    // 始点から目標点への距離を求める
                    const maxDistance: number = initialY - goalY;

                    // 現在位置から目標点への距離を求める
                    const distance: number = initialY - y;

                    //  現在位置から目標位置への達成率を求める
                    const distanceAchievement: number =  (y <= goalY) ? 0 : 1 - distance / maxDistance;
                    return distanceAchievement;
                }
            }

            // 花火を打ち上げるアニメーションを開始する
            frameId = requestAnimationFrame(riseAnimation);
        });
    }

    // 花火+火花を爆発させる関数
    async function burstFirework(fireworkId: string, fireworkType: number, goalStars: Star[], initialSparks: Spark[], initialX: number, initialY: number){
        const funcs: Promise<void>[] = [burstStars(fireworkId, goalStars, initialX, initialY)];
        if(fireworkType !== 0) funcs.push(burstSparks(fireworkId, initialSparks, initialX, initialY));
        await Promise.all(funcs);
        return;
    }

    // 花火を爆発させる関数
    async function burstStars(fireworkId: string, goalStars: Star[], initialX: number, initialY: number){
        // 花火データを初期化(中心点に集める)し、stateに保存する
        const initializedStars: Star[] = initializeStars(goalStars, initialX, initialY);
        setStarsObj(prev => {
            return {...prev, [fireworkId]: {
                stars: initializedStars,
                initialPosition: {
                    x: initialX,
                    y: initialY
                }
            }};
        });

        // 花火爆発アニメーションを開始する
        return new Promise<void>((resolve) => {
            let frameId: number | null = null;
            let isFinishedAnimation: boolean = false;

            function burstAnimation(){
                const speed: number = 10;

                setStarsObj(prevStarsObj => {
                    const prevStars: Star[] = prevStarsObj[fireworkId].stars;

                    // 新しいスターの位置を計算して更新
                    const updatedStars = prevStars.map((star, index) => {
                        const renderingStar: Star = goalStars[index];
                        const fireworkSize: number = 300;
                        const renderingX: number = renderingStar.x - fireworkSize / 2 + initialX;
                        const renderingY: number = renderingStar.y - fireworkSize / 2 + initialY;

                        /* ここを改変することで、花火のモーションを変更できる */
                        const dx: number = (renderingX - star.x) / speed;
                        const dy: number = (renderingY - star.y) / speed;
                        const newX: number = star.x + dx;
                        const newY: number = star.y + dy;

                        return {...star, x: newX, y: newY};
                    });

                    // 加速度が0に近づいたら、アニメーションを停止する
                    isFinishedAnimation = prevStars.every((star, index) => {
                        const renderingStar: Star = goalStars[index];
                        const fireworkSize: number = 300;
                        const renderingX: number = renderingStar.x - fireworkSize / 2 + initialX;
                        const renderingY: number = renderingStar.y - fireworkSize / 2 + initialY;
                        const dx: number = (renderingX - star.x) / speed;
                        const dy: number = (renderingY - star.y) / speed;
                        return (Math.abs(dx) < 1 && Math.abs(dy) < 1);
                    })

                    return {...prevStarsObj, [fireworkId]: {...prevStarsObj[fireworkId], stars: updatedStars}};
                });

                if(isFinishedAnimation){
                    // 花火のアニメーションが終了したら、アニメーションを停止する
                    if(frameId) cancelAnimationFrame(frameId);
                    frameId = null;
                    resolve();
                }else{
                    // 次のフレームを要求
                    frameId = requestAnimationFrame(burstAnimation);
                }
            };

            frameId = requestAnimationFrame(burstAnimation);
        });
        
    }

    // 火花を爆発させる関数
    async function burstSparks(fireworkId: string, initialSparks: Spark[], initialX: number, initialY: number){
        // 火花データを初期化する
        setSparksObj(prev => {
            return {...prev, [fireworkId]: initialSparks};
        });

        const speed: number = 10;
        const outerDifference: number = 0.75; // 外火花と内火花の距離の差の倍率

        // 火花爆発アニメーションを開始する
        return new Promise<void>((resolve) => {
            let frameId: number | null = null;
            let isFinishedAnimation: boolean = false;

            function burstAnimation(){
                setSparksObj(prevSparksObj => {
                    const prevSparks: Spark[] = prevSparksObj[fireworkId];
                    const afterImageSparks: Spark[] = []; // 火花の残像
                    const newSparks: Spark[] = prevSparks.map(spark => {
                        // 火花の最終位置を計算する
                        const fireworkSize: number = getFireworkSize();
                        const maxDistance: number = fireworkSize / 2 * 1.1;
                        const goalDistance: number = maxDistance * ((spark.movementType - 1) ? 1 : outerDifference); // 火花の最終位置から中心点の距離

                        // 火花の動きを停止させるかどうかを計算する
                        const prevDistanceX: number = Math.abs(initialX - spark.x); // 中心点からの横距離
                        const prevDistanceY: number = Math.abs(initialY - spark.y); // 中心点からの縦距離
                        const prevDistance: number = Math.sqrt(Math.pow(prevDistanceX, 2) + Math.pow(prevDistanceY, 2)); // 中心点からの距離
                        if((spark.movementType === 0) || (prevDistance >= goalDistance)){
                            if(spark.movementType === 2){
                                // 外側の火花が目標位置に達した場合、アニメーションを終了させる
                                isFinishedAnimation = true;
                            }

                            // 火花が残像扱い(0: 停止)の場合、あるいは火花が目標位置に達した場合、火花を停止させる
                            return {...spark};
                        }

                        // 新しい火花の位置を計算する
                        const dx: number = Math.cos(spark.direction) * speed;
                        const dy: number = Math.sin(spark.direction) * speed;
                        let newX: number = spark.x + dx;
                        let newY: number = spark.y + dy;

                        if(spark.sparkType === 1){
                            // 線型火花の残像を追加する
                            const innerDistance: number = goalDistance * outerDifference; // 内側の距離
                            if(prevDistance > goalDistance * outerDifference){
                                // 残像火花の太さを算出する関数
                                function calculateRadius(distance: number): number{
                                    const distanceAchievement: number =  (distance - innerDistance) / (goalDistance - innerDistance); // 火花の目標位置への達成度
                                    const radiusMagnification: number = -4 * distanceAchievement * (distanceAchievement - 1) // 火花の太さの倍率
                                    const newRadius: number = spark.standardRadius * radiusMagnification;
                                    return newRadius;
                                }

                                let afterImageLength: number = 0;
                                while(speed >= afterImageLength){
                                    const newDistance: number = prevDistance + afterImageLength;
                                    const newRadius: number = Math.max(calculateRadius(newDistance), spark.standardRadius * 0.5);
                                    if(newRadius <= 0) break;
                                    const newDx: number = Math.cos(spark.direction) * afterImageLength;
                                    const newDy: number = Math.sin(spark.direction) * afterImageLength;
                                    let newX: number = spark.x + newDx;
                                    let newY: number = spark.y + newDy;
                                    const newAfterImageSpark: Spark = {...spark, movementType: 0, x: newX, y: newY, radius: newRadius};
                                    afterImageSparks.push(newAfterImageSpark);
                                    afterImageLength += newRadius;
                                }
                            }
                        }else if(spark.sparkType === 2){
                            // 雫型火花を残像を追加する
                            const innerDistance: number = goalDistance * outerDifference; // 内側の距離
                            if(prevDistance > goalDistance * outerDifference){
                                // 残像火花の太さを算出する関数
                                function calculateRadius(distance: number): number{
                                    const distanceAchievement: number =  (distance - innerDistance) / (goalDistance - innerDistance); // 火花の目標位置への達成度
                                    const radiusMagnification: number = distanceAchievement // 火花の太さの倍率
                                    const newRadius: number = spark.standardRadius * radiusMagnification;
                                    return newRadius;
                                }

                                let afterImageLength: number = 0;
                                while(speed >= afterImageLength){
                                    const newDistance: number = prevDistance + afterImageLength;
                                    const newRadius: number = Math.max(calculateRadius(newDistance), spark.standardRadius * 0.2);
                                    if(newRadius <= 0) break;
                                    const newDx: number = Math.cos(spark.direction) * afterImageLength;
                                    const newDy: number = Math.sin(spark.direction) * afterImageLength;
                                    let newX: number = spark.x + newDx;
                                    let newY: number = spark.y + newDy;
                                    const newAfterImageSpark: Spark = {...spark, movementType: 0, x: newX, y: newY, radius: newRadius};
                                    afterImageSparks.push(newAfterImageSpark);
                                    afterImageLength += newRadius;
                                }
                            }
                        }

                        const newRadius: number = (spark.sparkType === 0) ? spark.radius : 0;
                        const newSpark: Spark = {...spark, x: newX, y: newY, radius: newRadius};
                        return newSpark;
                    });
                    return {...prevSparksObj, [fireworkId]: [...newSparks, ...afterImageSparks]};
                });

                if(isFinishedAnimation){
                    // 花火のアニメーションが終了したら、アニメーションを停止する
                    if(frameId) cancelAnimationFrame(frameId);
                    frameId = null;
                    resolve();
                }else{
                    // 次のフレームを要求
                    frameId = requestAnimationFrame(burstAnimation);
                }
            };

            frameId = requestAnimationFrame(burstAnimation);
        });
    }

    // 花火+火花を消滅させる関数
    async function fadeFirework(fireworkId: string, fireworkType: number){
        const funcs: Promise<void>[] = [fadeStars(fireworkId)];
        if(fireworkType !== 0) funcs.push(fadeSparks(fireworkId));
        await Promise.all(funcs);
        return;
    }

    // 花火を消滅させる関数
    async function fadeStars(fireworkId: string){
        const speed: number = 10; // 花火が消えていく速度

        // 花火消滅アニメーションを開始する
        return new Promise<void>((resolve) => {
            let frameId: number | null = null;
            let isFinishedAnimation: boolean = false;

            function fadeAnimation(){
                setStarsObj((prevStarsObj) => {
                    const prevStars: Star[] = prevStarsObj[fireworkId].stars;

                    // 新しい花火の星の透明度を計算して更新
                    const updatedStars = prevStars.map((star) => {
                        const newAlpha: number = Math.max(star.color.alpha - speed, 0); // 透明度が負にならないようにする
                        return {...star, color: {...star.color, alpha: newAlpha}};
                    });

                    isFinishedAnimation = updatedStars.every((star) => {
                        // 全ての花火の星の透明度が0以下になったらアニメーションを停止させる
                        return (Number(star.color.alpha) || 0) <= 0;
                    })

                    return {...prevStarsObj, [fireworkId]: {...prevStarsObj[fireworkId], stars: updatedStars}};
                });

                if(isFinishedAnimation){
                    // 花火のアニメーションが終了したら、アニメーションを停止する
                    if(frameId) cancelAnimationFrame(frameId);
                    frameId = null;
                    resolve();
                }else{
                    // 次のフレームを要求
                    frameId = requestAnimationFrame(fadeAnimation);
                }
            };

            frameId = requestAnimationFrame(fadeAnimation);
        });
    }

    // 火花を消滅させる関数
    async function fadeSparks(fireworkId: string){
        const speed: number = 10; // 火花が消えていく速度

        // 火花消滅アニメーションを開始する
        return new Promise<void>((resolve) => {
            let frameId: number | null = null;
            let isFinishedAnimation: boolean = false;

            function fadeAnimation(){
                setSparksObj((prevSparksObj) => {
                    const prevSparks: Spark[] = prevSparksObj[fireworkId];

                    // 新しい火花の透明度を計算して更新
                    const updatedStars = prevSparks.map((spark) => {
                        const newAlpha: number = Math.max(spark.color.alpha - speed, 0); // 透明度が負にならないようにする
                        return {...spark, color: {...spark.color, alpha: newAlpha}};
                    });

                    isFinishedAnimation = prevSparks.every((sparks) => {
                        // 全ての火花の透明度が0以下になったらアニメーションを停止
                        // if(sparks.color.alpha !== 0) console.log(sparks.color)
                        return sparks.color.alpha <= 0;
                    })

                    const result = {...prevSparksObj, [fireworkId]: updatedStars};
                    return result;
                });

                if(isFinishedAnimation){
                    // 火花のアニメーションが終了したら、アニメーションを停止する
                    if(frameId) cancelAnimationFrame(frameId);
                    frameId = null;
                    resolve();
                }else{
                    // 次のフレームを要求
                    frameId = requestAnimationFrame(fadeAnimation);
                }
            };

            frameId = requestAnimationFrame(fadeAnimation);
        });
    }

    /* 花火大会用の関数定義 */
    // データベースから花火データを取得し、打ち上げる関数
    async function initializeFireworksData(){
        const msAgo: number = 60 * 60 * 1000; // 何ミリ秒前までのデータを取得するか(1時間前までのデータを取得する)
        // const msAgo: number | undefined = undefined; // 何ミリ秒前までのデータを取得するか(全データを取得する)
        const response = await getFireworks(msAgo);
        if(!response) return;

        const newFireworksData: FireworkTypeInfo[] = [];
        Object.keys(response).forEach(userId => {
            const userData = response[userId];
            Object.keys(userData).forEach(boothId => {
                const boothData = userData[boothId];
                const newData: FireworkTypeInfo = {
                    boothId,
                    fireworkType: boothData.fireworkType,
                    fireworkDesign: boothData.fireworkDesign || null,
                    sparksType: boothData.sparksType
                };
                newFireworksData.push(newData);
            });
        });

        setFireworksData(newFireworksData);
    }

    // ランダムな間隔で関数を実行する関数
    function startRandomInterval<T>(func: () => T){
        if(intervalRef.current) clearInterval(intervalRef.current); // 既存のタイマーをクリア

        const interval = getRandomInterval();

        intervalRef.current = Number(setTimeout(() => {
            // 指定された関数を実行する
            func();

            // 再度ランダムな間隔でタイマーをセット
            startRandomInterval<T>(func);
        }, interval));
    };

    // 花火大会用データを追加する関数
    function pushFireworksData(data: FireworkTypeInfo){
        setFireworksData(prev => {
            return prev ? [...prev, data] : [data];
        });
    }

    // intervalを一時中断し、別の処理を実行する関数
    async function interruptInterval<T>(func: () => T, interval: number = 3000){
        if(!intervalRef.current) return;
        clearInterval(intervalRef.current); // 既存のタイマーをクリア
        await sleep(1000);
        func(); // 別の処理を実行する
        await sleep(interval);
        // 打ち上げアニメーションのループを再開する
        startRandomInterval<void>(animateRandomFirework);
    }

    // ランダムに花火を選び、打ち上げる関数
    function animateRandomFirework(){
        if(!fireworksData) return;
        if(fireworksData.length > 0){
            // 取得した花火データの中からランダムに1つ選ぶ
            const randomIndex: number = Math.floor(Math.random() * fireworksData.length);
            const {
                boothId,
                fireworkType,
                fireworkDesign,
                sparksType
            } = fireworksData[randomIndex];

            // 花火のアニメーションを実行する
            animateFirework(boothId, fireworkType, fireworkDesign, sparksType);
        }else{
            // ダミーの花火データで、花火のアニメーションを実行する
            const sparksType: number = Math.floor(Math.random() * 3);
            animateFirework(null, 1, null, sparksType);
        }
    }

    // 花火大会モードを一時中断し、受け取った花火データを一斉に打ち上げる関数
    async function interruptFireworks(array: FireworkTypeInfo[]){
        // 受け取った花火データを一斉に打ち上げる関数
        function raiseSimultaneously(){
            array.forEach((data, index) => {
                animateFirework(data.boothId, data.fireworkType, data.fireworkDesign, data.sparksType, (index === 0) ? 2 : 1);
            });
        }

        // 花火大会モードを一時中断し、受け取った花火データを一斉に打ち上げる
        interruptInterval<void>(raiseSimultaneously);
    }

    /* useEffect等 */
    // 花火大会用データを初期化する関数
    useEffect(() => {
        switch(pageMode){
            case "show-fireworks":
            case "simultaneously-raise":
                initializeFireworksData();
                break;
            default:
                setFireworksData(null);
                break;
        }
    }, [pageMode]);

    // 花火大会用処理
    // 花火データを元に、打ち上げアニメーションをループさせる
    useEffect(() => {
        if(fireworksData){
            // 打ち上げアニメーションをループさせる
            startRandomInterval<void>(animateRandomFirework);
        }

        return () => {
            if(intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fireworksData]);

    // starsやsparksが変更される度、再度キャンバスに描画する
    useEffect(() => {
        // Canvasコンテキストを取得
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Canvasをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 打ち上げ中の花火の星を描画する
        Object.keys(risingStarsObj).forEach(id => {
            const risingStars: RisingStars = risingStarsObj[id];
            drawStar(ctx, risingStars.capitalStar);
            risingStars.afterImageStars.forEach(afterImage => {
                drawStar(ctx, afterImage.star);
            });
        });

        // 火花を描画する
        Object.keys(sparksObj).forEach(id => {
            for(const spark of sparksObj[id]){
                drawSpark(ctx, spark);
            }
        });

        // 花火の星を描画する
        Object.keys(starsObj).forEach(id => {
            for(const star of starsObj[id].stars){
                const scale: number = getFireworkSizeRate();
                const initialPosition: Point = starsObj[id].initialPosition;
                const option = {
                    scale,
                    initialPosition
                }
                drawStar(ctx, star, undefined, option);
            }
        });
    }, [starsObj, sparksObj, risingStarsObj]);

    return (
        <MultiFireworksContext.Provider
            value={{
                canvasRef,
                animateFirework,
                pageMode,
                setPageMode,
                pushFireworksData,
                interruptFireworks
            }}
        >
            {children}
        </MultiFireworksContext.Provider>
    )
}
