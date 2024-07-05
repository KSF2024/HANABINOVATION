import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { RisingAfterImage, RisingStars, Spark, Star } from "../utils/types";
import { drawSpark, drawStar, generateFirework, generateRisingStars, initializeStars } from "../utils/hanabi";
import { ulid } from "ulidx";
import { getRandomPositionInBox, sleep } from "../utils/modules";

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
    const [starsObj, setStarsObj] = useState<{[id: string]: Star[]}>({}); // 花火の星(アニメーション用)
    const [sparksObj, setSparksObj] = useState<{[id: string]: Spark[]}>({}); // 花火の火花(アニメーション用)
    const [risingStarsObj, setRisingStarsObj] = useState<{[id: string]: RisingStars}>({}); // 打ちあがる際の花火の星(アニメーション用)

    /* その他関数定義 */
    // 花火の打ち上げ初期位置・爆発中心位置を求める関数
    function getInitialPositions(): {
        initialRiseX: number;
        initialRiseY: number;
        initialBurstX: number;
        initialBurstY: number;
    }{
        // 花火の大きさを求める
        // const starsSize: number = 300; // 花火単体の大きさ
        // const minSize: number = (canvasRef.current?.clientWidth || starsSize) * 0.4; // 花火の大きさの最大値
        // const fireworkSize: number =  Math.min(starsSize, minSize);
        const fireworkSize: number = getFireworkSize();

        // 爆発中心位置のx座標を求める
        const canvasWidth: number = canvasRef.current?.clientWidth || 0
        const randomX: number = getRandomPositionInBox(fireworkSize, canvasWidth - 100) + 50;

        // 爆発中心位置のy座標を求める
        const canvasHeight: number = canvasRef.current?.clientHeight || 0;
        const randomY: number = getRandomPositionInBox(fireworkSize, canvasHeight * 0.7) + 50;

        console.log({
            initialRiseX: randomX,
            initialRiseY: canvasHeight,
            initialBurstX: randomX,
            initialBurstY: randomY
        })

        return {
            initialRiseX: randomX,
            initialRiseY: canvasHeight,
            initialBurstX: randomX,
            initialBurstY: randomY
        }
    }

    // 花火の大きさを求める関数
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
        const fireworkSize: number = getFireworkSize();
        return fireworkSize / starsSize;
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

        const fireworkId: string = ulid();

        // 花火+火花データを初期化する
        const firework = await generateFirework(boothId, fireworkType, fireworkDesign, sparksType, initialBurstX, initialBurstY);
        if(!firework) return;
        const { stars, sparks } = firework;

        // 打ち上げ用の花火の星データを初期化する
        const risingStars: RisingStars = generateRisingStars(boothId, initialRiseX, initialRiseY, initialBurstX, initialBurstY);

        // 花火を打ち上げる
        await raiseSparks(fireworkId, risingStars, initialRiseY);

        // 花火を爆発させる
        await burstFirework(fireworkId, stars, sparks, initialBurstX, initialBurstY);

        // 花火を消滅させる
        // await fadeFirework(fireworkId);

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
    async function burstFirework(fireworkId: string, goalStars: Star[], initialSparks: Spark[], initialX: number, initialY: number){
        await Promise.all([
            burstStars(fireworkId, goalStars, initialX, initialY),
            burstSparks(fireworkId, initialSparks, initialX, initialY)
        ]);
        return;
    }

    // 花火を爆発させる関数
    async function burstStars(fireworkId: string, goalStars: Star[], initialX: number, initialY: number){
        // 花火データを初期化(中心点に集める)し、stateに保存する
        const initializedStars: Star[] = initializeStars(goalStars, initialX, initialY);
        setStarsObj(prev => {
            return {...prev, [fireworkId]: initializedStars};
        });

        // 花火爆発アニメーションを開始する
        return new Promise<void>((resolve) => {
            let frameId: number | null = null;
            let isFinishedAnimation: boolean = false;

            function burstAnimation(){
                const speed: number = 10;

                setStarsObj(prevStarsObj => {
                    const prevStars: Star[] = prevStarsObj[fireworkId];

                    // 新しいスターの位置を計算して更新
                    const updatedStars = prevStars.map((star, index) => {
                        const renderingStar: Star = goalStars[index];
                        const fireworkSize: number = getFireworkSize();
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
                        const fireworkSize: number = getFireworkSize();
                        const renderingX: number = renderingStar.x - fireworkSize / 2 + initialX;
                        const renderingY: number = renderingStar.y - fireworkSize / 2 + initialY;
                        const dx: number = (renderingX - star.x) / speed;
                        const dy: number = (renderingY - star.y) / speed;
                        return (Math.abs(dx) < 1 && Math.abs(dy) < 1);
                    })

                    return {...prevStarsObj, [fireworkId]: updatedStars};
                });

                if(isFinishedAnimation){
                    // アニメーションが停止したら、スターの位置を最終位置に修正する
                    setStarsObj(prevStarsObj => {
                        const prevStars: Star[] = prevStarsObj[fireworkId];

                        // スターの最終位置を計算して更新
                        const updatedStars = prevStars.map((star, index) => {
                            const renderingStar: Star = goalStars[index];
                            const fireworkSize: number = getFireworkSize();
                            const renderingX: number = renderingStar.x - fireworkSize / 2 + initialX;
                            const renderingY: number = renderingStar.y - fireworkSize / 2 + initialY;
                            return {...star, x: renderingX, y: renderingY};
                        });
                        return {...prevStarsObj, [fireworkId]: updatedStars};
                    });

                    // 花火のアニメーションが終了したら、アニメーションを停止する
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
        // setSparksObj(prev => {
        //     return {...prev, [fireworkId]: initialSparks};
        // });
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

    /* useEffect等 */
    useEffect(() => {
        animateFirework("HF5W2T", 1, null, 2);
    }, []);

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
                drawStar(ctx, afterImage.star, 255);
            });
        });

        // 火花を描画する
        Object.keys(sparksObj).forEach(id => {
            for(const spark of sparksObj[id] || {}){
                drawSpark(ctx, spark);
            }
        });

        // 花火の星を描画する
        Object.keys(starsObj).forEach(id => {
            for(const star of starsObj[id]  || {}){
                const scale: number = getFireworkSizeRate();
                drawStar(ctx, star, undefined, scale);
            }
        });
    }, [starsObj, sparksObj, risingStarsObj]);

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
