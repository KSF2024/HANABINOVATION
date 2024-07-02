import { createContext, ReactNode, useState, useEffect, useRef, useContext } from "react";
import { ImageInfo, RisingAfterImage, RisingStars, Size, Spark, Star } from "../utils/types";
import { generateStars, generateSparks, drawStar, drawSpark } from "../utils/hanabi";
import { DataContext } from "./DataProvider";
import { calculateDistance, findIntersection, getImageData, hexToRgba, sleep, getBoothColor, getImageSrc } from "../utils/modules";

/* 型定義 */
// contextに渡すデータの型
type FireworksContent = {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    initializeImageSrc(): void;
    toggleFireworksPosition(): void;
    fireworkPhase: number;
    setFireworkPhase: React.Dispatch<React.SetStateAction<number>>;
    fireworkAnimationFrameId: number | null;
    sparksAnimationFrameId: number | null;
};

/* Provider */
const initialData: FireworksContent = {
    canvasRef: {} as React.RefObject<HTMLCanvasElement>,
    initializeImageSrc: () => {},
    toggleFireworksPosition: () => {},
    fireworkPhase: 0,
    setFireworkPhase: {} as any,
    fireworkAnimationFrameId: null,
    sparksAnimationFrameId: null
};

export const FireworksContext = createContext<FireworksContent>(initialData);

// 花火やユーザーの設定データを管理するProvider
export function FireworksProvider({children}: {children: ReactNode}){
    /* state等 */
    // 画像とcanvasの設定情報
    const [imageSrc, setImageSrc]= useState<string | null>(null);
    const [imageData, setImageData] = useState<ImageData | null>(null); // 読み込む画像データ
    const canvasRef = useRef<HTMLCanvasElement>(null); // アニメーション用Canvas要素の参照

    // 花火データ
    const starsRef = useRef<Star[]>([]); // 花火の星(アニメーション完了後の位置)
    const [stars, setStars] = useState<Star[]>([]); // 花火の星(アニメーション用)
    const [sparks, setSparks] = useState<Spark[]>([]); // 花火の火花(アニメーション用)
    const [risingStars, setRisingStars] = useState<RisingStars>({
        capitalStar: {} as Star,
        afterImageStars: [],
        goalPositions: { x: 0, y: 0 }
    }); // 打ちあがる際の花火の星(アニメーション用)

    // 花火の設定情報
    const [fireworkPhase, setFireworkPhase] = useState<number>(0); // 花火アニメーションの段階(0: 半透明, 1: 打ち上げ, 2: 爆発, 3: 撮影待機)
    const [fireworkSize, setFireworkSize] = useState<Size>({width: 0, height: 0}); // 花火の幅
    const [launchAngle, setLaunchAngle] = useState<number>(0); // 花火の打ち上げ角度 (デフォルト0度)
    const [fireworkPosition, setFireworkPosition] = useState<{gapX: number, gapY: number}>({gapX: 0, gapY: 0}); // 花火が打ち上がる位置
    const [positionToggle, setPositionToggle] = useState<boolean>(false); // 花火が打ちあがる位置をトグルで切り替えるためのstate

    // アニメーションの設定情報
    const [fireworkAnimationFrameId, setFireworkAnimationFrameId] = useState<number | null>(null); // 花火アニメーション用ID
    const isFinishedFireworkAnimation = useRef<boolean>(true); // 花火アニメーションが終了したかどうか
    const [sparksAnimationFrameId, setSparksAnimationFrameId] = useState<number | null>(null); // 火花アニメーション用ID
    const isFinishedSparksAnimation = useRef<boolean>(true); // 火花アニメーションが終了したかどうか

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

        if(!newImageSrc) return;
        setImageSrc(newImageSrc);
    }


    /* 花火(Star)用関数定義 */
    // 花火を爆発させるアニメーション
    function burstFireworks(initialX: number, initialY: number){
        const renderingStars: Star[] = starsRef.current; // 花火の完成予想図
        const speed: number = 10;

        setStars(prevStars => {
            // 新しいスターの位置を計算して更新
            const updatedStars = prevStars.map((star, index) => {
                const renderingStar: Star = renderingStars[index];
                const renderingX: number = renderingStar.x - fireworkSize.width / 2 + initialX;
                const renderingY: number = renderingStar.y - fireworkSize.height / 2 + initialY;

                /* ここを改変することで、花火のモーションを変更できる */
                const dx: number = (renderingX - star.x) / speed;
                const dy: number = (renderingY - star.y) / speed;
                const newX: number = star.x + dx;
                const newY: number = star.y + dy;

                return {...star, x: newX, y: newY};
            });

            // 加速度が0に近づいたら、アニメーションを停止する
            isFinishedFireworkAnimation.current = prevStars.every((star, index) => {
                const renderingStar: Star = renderingStars[index];
                const renderingX: number = renderingStar.x - fireworkSize.width / 2 + initialX;
                const renderingY: number = renderingStar.y - fireworkSize.height / 2 + initialY;
                const dx: number = (renderingX - star.x) / speed;
                const dy: number = (renderingY - star.y) / speed;
                return (Math.abs(dx) < 1 && Math.abs(dy) < 1);
            })

            if(isFinishedFireworkAnimation.current) setFireworkPhase(3); // アニメーションが停止した場合、撮影待機状態に移る

            const result = updatedStars;
            return result;
        });

        if(isFinishedFireworkAnimation.current){
            // アニメーションが停止したら、スターの位置を最終位置に修正する
            setStars(prevStars => {
                // スターの最終位置を計算して更新
                const updatedStars = prevStars.map((star, index) => {
                    const renderingStar: Star = renderingStars[index];
                    const renderingX: number = renderingStar.x - fireworkSize.width / 2 + initialX;
                    const renderingY: number = renderingStar.y - fireworkSize.height / 2 + initialY;
                    return {...star, x: renderingX, y: renderingY};
                });
                return updatedStars;
            });
            // 花火のアニメーションが終了したら、アニメーションを停止する
            setFireworkAnimationFrameId(null);
            return;
        }else{
            // 次のフレームを要求
            const newAnimationFrameId = requestAnimationFrame(() => burstFireworks(initialX, initialY));
            setFireworkAnimationFrameId(newAnimationFrameId);
        }
    }

    // 花火の星データ(花火が爆発した後)から、アニメーション開始時の花火の星(中央に集合した状態)のデータを取得する関数
    function initializeStars(stars: Star[], initialX: number, initialY: number): Star[]{
        return stars.map((star) => {
            return {...star, x: initialX, y: initialY}
        });
    }


    /* 花火(Spark)用関数定義 */
    // 火花を爆発させるアニメーション
    function burstSparks(initialX: number, initialY: number){
        const speed: number = 10;
        const outerDifference: number = 0.75; // 外火花と内火花の距離の差の倍率

        setSparks(prevSparks => {
            const afterImageSparks: Spark[] = []; // 火花の残像
            const newSparks: Spark[] = prevSparks.map(spark => {
                // 火花の最終位置を計算する
                const maxDistance: number = (Math.max(fireworkSize.width, fireworkSize.height) / 2) * 1.1;
                const goalDistance: number = maxDistance * ((spark.movementType - 1) ? 1 : outerDifference); // 火花の最終位置から中心点の距離

                // 火花の動きを停止させるかどうかを計算する
                const prevDistanceX: number = Math.abs(initialX - spark.x); // 中心点からの横距離
                const prevDistanceY: number = Math.abs(initialY - spark.y); // 中心点からの縦距離
                const prevDistance: number = Math.sqrt(Math.pow(prevDistanceX, 2) + Math.pow(prevDistanceY, 2)); // 中心点からの距離
                if((spark.movementType === 0) || (prevDistance >= goalDistance)){
                    if(spark.movementType === 2){
                        // 外側の火花が目標位置に達した場合、アニメーションを終了させる
                        isFinishedSparksAnimation.current = true;
                    }

                    // 火花が残像扱い(0: 停止)の場合、あるいは火花が目標位置に達した場合、火花を停止させる
                    return {...spark};
                }

                // 新しい火花の位置を計算する
                const dx: number = Math.cos(spark.direction + launchAngle) * speed;
                const dy: number = Math.sin(spark.direction + launchAngle) * speed;
                let newX: number = spark.x + dx;
                let newY: number = spark.y + dy;

                // 新しい火花の位置が最終位置を超えているなら、最終位置にグリッドする
                // const newDistance: number = Math.sqrt(Math.pow(initialX - newX, 2) + Math.pow((initialY - newY), 2)); // 中心点からの距離
                // if(newDistance >= goalDistance){
                //     const goalX: number = initialX + Math.cos(spark.direction) * goalDistance;
                //     const goalY: number = initialY + Math.sin(spark.direction) * goalDistance;
                //     newX = goalX;
                //     newY = goalY;
                // }

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
                            const newDx: number = Math.cos(spark.direction + launchAngle) * afterImageLength;
                            const newDy: number = Math.sin(spark.direction + launchAngle) * afterImageLength;
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
                            const newDx: number = Math.cos(spark.direction + launchAngle) * afterImageLength;
                            const newDy: number = Math.sin(spark.direction + launchAngle) * afterImageLength;
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
            return [...newSparks, ...afterImageSparks];
        });

        if(isFinishedSparksAnimation.current){
            // 花火のアニメーションが終了したら、アニメーションを停止する
            setSparksAnimationFrameId(null);
            return;
        }else{
            // 次のフレームを要求
            const newAnimationFrameId: number = requestAnimationFrame(() => burstSparks(initialX, initialY));
            setSparksAnimationFrameId(newAnimationFrameId);
        }
    }


    /* 花火の軌道用関数定義 */
    // 花火を打ち上げるアニメーション
    function raiseFireworks(initialX: number, initialY: number, radian: number){
        const defaultSpeed: number = 10; // 花火の基本速度
        const minSpeed: number = 1; // 花火の最低速度
        const fadeSpeed: number = 3; // 花火が消える速度
        const afterImageMaxAngle: number = 10; // 残像の最大角度

        setRisingStars(prevStars => {
            const capitalStar = {...prevStars}.capitalStar;
            const afterImageStars: RisingAfterImage[] = [];

            // 花火の目標位置への達成率を求める
            const goalX: number = prevStars.goalPositions.x;
            const goalY: number = prevStars.goalPositions.y;
            const distanceAchievement: number = getDistanceAchievement(capitalStar.x, capitalStar.y, goalX, goalY);

            // 花火の速度を求める
            const speed: number = Math.max(defaultSpeed * distanceAchievement, minSpeed);

            if(distanceAchievement <= 0.01){
                // 花火が停止し、打ち上げが完了したら、透明度を下げていく
                capitalStar.color.alpha -= fadeSpeed;

                // 打ち上げ用花火本体の透明度が0になったら、アニメーションを終了する
                if(capitalStar.color.alpha <= 0){
                    isFinishedFireworkAnimation.current = true;
                    
                    sleep(10).then(() => setFireworkPhase(2)); // 少し待機し、花火の爆発処理に移る
                    return {...prevStars, afterImageStars: []};
                }
            }else{
                // 花火が頂点に達していない場合、花火の打ち上げ処理を行う
                // 花火の移動距離を求める
                const dx: number = speed * Math.cos(radian);
                const dy: number = speed * Math.sin(radian);

                // 花火を移動させる
                capitalStar.x += dx;
                capitalStar.y += dy;

                // 花火が目標位置を超えたなら、目標位置にグリッドさせる
                capitalStar.x = initialX < goalX ? Math.min(capitalStar.x, goalX) : Math.max(capitalStar.x, goalX);
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

            return {...prevStars, capitalStar, afterImageStars};
        })

        if(isFinishedFireworkAnimation.current){
            // 花火のアニメーションが終了したら、アニメーションを停止する
            setFireworkAnimationFrameId(null);
            return;
        }else{
            // 次のフレームを要求
            const newAnimationFrameId = requestAnimationFrame(() => raiseFireworks(initialX, initialY, radian));
            setFireworkAnimationFrameId(newAnimationFrameId);
        }

        // 初期位置から目標位置までにおける、現在位置の達成率を求める関数
        function getDistanceAchievement(x: number, y: number, goalX: number, goalY: number): number{
            // 始点から目標点への距離を求める
            const maxDistance: number = calculateDistance(initialX, initialY, goalX, goalY);

            // 現在位置から目標点への距離を求める
            const distance: number = calculateDistance(x, y, goalX, goalY);

            //  現在位置から目標位置への達成率を求める
            const distanceAchievement: number =  distance / maxDistance;
            return distanceAchievement;
        }
    }

    /* 花火&火花初期表示用関数定義 */
    // 花火を初期表示する
    function previewFireworks(ctx: CanvasRenderingContext2D, imageData: ImageData){
        const alpha: number = 150; // 初期表示花火の透明度

        // imageDataから花火の星を作成する
        const newStars: Star[] = generateStars(imageData, launchAngle);

        // 花火を打ち上げる中心点を求める
        const { initialX, initialY } = getInitialPosition();

        newStars.forEach((star) => {
            star.x += -fireworkSize.width / 2 + initialX;
            star.y += -fireworkSize.height / 2 + initialY;
            drawStar(ctx, star, alpha);
        })
    }

    // 火花を初期表示する
    function previewSparks(ctx: CanvasRenderingContext2D){
        if(!boothId) return;
        const sparksColor: string | null = getBoothColor(boothId);
        if(!sparksColor) return;

        const alpha: number = 50; // 初期表示火花の透明度

        // 火花を打ち上げる中心点を求める
        const { initialX, initialY } = getInitialPosition();

        // 火花データを生成する
        const generatedSparks: Spark[] = generateSparks(sparksType, sparksColor, initialX, initialY);
        const finalSparks: Spark[] = getFinalSparks();

        finalSparks.forEach(spark => {
            drawSpark(ctx, spark, alpha);
        })

        // 火花の最終位置を取得する関数
        function getFinalSparks(): Spark[]{
            const speed: number = 10;
            const outerDifference: number = 0.75; // 外火花と内火花の距離の差の倍率
            let result: Spark[] = [...generatedSparks];
            let isNotFinished: boolean = true; // 火花の最終位置の取得が済んでいないか
            while(isNotFinished){
                const afterImageSparks: Spark[] = []; // 火花の残像
                const newSparks = result.map(spark => {
                    // 火花の最終位置を計算する
                    const maxDistance: number = (Math.max(fireworkSize.width, fireworkSize.height) / 2) * 1.1;
                    const goalDistance: number = maxDistance * ((spark.movementType - 1) ? 1 : outerDifference); // 火花の最終位置から中心点の距離

                    // 火花の動きを停止させるかどうかを計算する
                    const prevDistanceX: number = Math.abs(initialX - spark.x); // 中心点からの横距離
                    const prevDistanceY: number = Math.abs(initialY - spark.y); // 中心点からの縦距離
                    const prevDistance: number = Math.sqrt(Math.pow(prevDistanceX, 2) + Math.pow(prevDistanceY, 2)); // 中心点からの距離
                    if((spark.movementType === 0) || (prevDistance >= goalDistance)){
                        if(spark.movementType === 2){
                            // 外側の火花が目標位置に達した場合、最終位置の取得を終了させる
                            isNotFinished = false;
                        }

                        // 火花が残像扱い(0: 停止)の場合、あるいは火花が目標位置に達した場合、火花を停止させる
                        return {...spark};
                    }

                    // 新しい火花の位置を計算する
                    const dx: number = Math.cos(spark.direction + launchAngle) * speed;
                    const dy: number = Math.sin(spark.direction + launchAngle) * speed;
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
                                const newDx: number = Math.cos(spark.direction + launchAngle) * afterImageLength;
                                const newDy: number = Math.sin(spark.direction + launchAngle) * afterImageLength;
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
                                const newDx: number = Math.cos(spark.direction + launchAngle) * afterImageLength;
                                const newDy: number = Math.sin(spark.direction + launchAngle) * afterImageLength;
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
                result = [...newSparks, ...afterImageSparks];
            }
            return result;
        }
    }

    /* 花火&火花用共通関数定義 */
    // 花火を打ち上げる中心点を求める関数
    function getInitialPosition(): {
        initialX: number;
        initialY: number;
    }{
        let initialX: number =  0;
        let initialY: number =  0;
        if(canvasRef.current){
            initialX = canvasRef.current.clientWidth / 2 + (fireworkPosition.gapX || 0);
            initialY = canvasRef.current.clientHeight / 3 + (fireworkPosition.gapY || 0);
        }
        return { initialX, initialY };
    }


    /* useEffect用関数定義 */
    // 花火が打ち上がるアニメーションを開始する
    function startRiseAnimation(){
        // 前回の花火打ち上げアニメーションを消去し、初期化する
        if(fireworkAnimationFrameId){
            cancelAnimationFrame(fireworkAnimationFrameId);
            isFinishedFireworkAnimation.current = true;
        }

        // 打ち上げ用の花火の色を取得する
        if(!boothId) return;
        const colorCode: string | null = getBoothColor(boothId);
        if(!colorCode) return;
        const color = hexToRgba(colorCode, 255);

        // 花火を打ち上げる目標点を求める
        const { initialX, initialY } = getInitialPosition();
        const goalPositions = { x: initialX, y: initialY };

        // 花火を打ち上げる始点を求める
        const angleDegrees: number = (270 + launchAngle) % 360; // 花火を打ち上げる角度
        const canvasHeight: number = canvasRef.current?.height || 0;
        const { x, y } = findIntersection(goalPositions, angleDegrees, canvasHeight);

        // 花火を打ち上げる角度(ラジアン)を求める
        const radian: number = (270 + launchAngle) % 360 / 180 * Math.PI;

        // 打ち上げ用の花火の星を作成する
        const capitalStar: Star = { color, x, y, radius: 5 };

        // stateに打ち上げ用花火を保存する
        setRisingStars({capitalStar, afterImageStars: [], goalPositions});

        // 花火アニメーションを開始
        const newRaiseAnimationFrameId: number = requestAnimationFrame(() => raiseFireworks(x, y, radian));
        setFireworkAnimationFrameId(newRaiseAnimationFrameId);
        isFinishedFireworkAnimation.current = false;
    }

    // 画像データを読み込み、花火を爆発させるアニメーションを開始する
    function startBurstAnimation(imageData: ImageData){
        // 前回の花火打ち上げアニメーションを消去し、初期化する
        if(fireworkAnimationFrameId){
            cancelAnimationFrame(fireworkAnimationFrameId);
            isFinishedFireworkAnimation.current = true;
        }
        if(sparksAnimationFrameId){
            cancelAnimationFrame(sparksAnimationFrameId);
            isFinishedSparksAnimation.current = true;
        }

        // imageDataから花火の星を作成する
        const newStars: Star[] = generateStars(imageData, launchAngle);
        starsRef.current = newStars;

        // 花火を打ち上げる中心点を求める
        let initialX: number =  0;
        let initialY: number =  0;
        if(canvasRef.current){
            initialX = canvasRef.current.width / 2 + (fireworkPosition.gapX || 0);
            initialY = canvasRef.current.height / 3 + (fireworkPosition.gapY || 0);
        }

        // 花火データを初期化(中心点に集める)し、stateに保存する
        const initializedStars: Star[] = initializeStars(newStars, initialX, initialY);
        setStars(initializedStars);

        // 火花データを作成し、stateに保存する
        if(!boothId) return;
        const sparksColor: string | null = getBoothColor(boothId);
        if(!sparksColor) return;
        const newSparks: Spark[] = generateSparks(sparksType, sparksColor, initialX, initialY);
        setSparks(newSparks);

        // 花火アニメーションを開始
        const newFireworksAnimationFrameId: number = requestAnimationFrame(() => burstFireworks(initialX, initialY));
        setFireworkAnimationFrameId(newFireworksAnimationFrameId);
        isFinishedFireworkAnimation.current = false;

        // 火花アニメーションを開始
        const newSparksAnimationFrameId: number = requestAnimationFrame(() => burstSparks(initialX, initialY));
        setSparksAnimationFrameId(newSparksAnimationFrameId);
        isFinishedSparksAnimation.current = false;
    }

    /* 花火撮影機能用の処理 */
    // 花火の位置と角度をランダムに変更する関数
    function randomizeFireworksPosition(){
        // 花火の位置をランダムに変更する
        const windowSize: number = Math.min(window.innerWidth, window.innerHeight);
        const maxFluctuation: number = windowSize * 0.1;
        const maxGapX: number = maxFluctuation;
        const maxGapY: number = window.innerHeight * (1/3 * 0.3);
        const newGapX: number = getRandomRange(maxGapX);
        const newGapY: number = getRandomRange(maxGapY);
        setFireworkPosition({gapX: newGapX, gapY: newGapY});

        // 花火の角度をランダムに変更する
        const newAngle: number = Math.random() * 20 * getSign(newGapX);
        setLaunchAngle(newAngle);

        // -n～nの範囲からランダムな値を取得する関数
        function getRandomRange(value: number){
            return Math.random() * (value * 2 + 1) - value;
        }

        // 与えられた数が正なら1、負なら-1、ゼロなら1を返す関数
        function getSign(value: number) {
            return Math.sign(value) || 1;
        }
    }

    // 花火の位置と角度を初期化する関数
    function initializeFireworksPosition(){
        setFireworkPosition({gapX: 0, gapY: 0});
        setLaunchAngle(0);
    }

    // 花火の位置を正位置とランダムでトグルする関数
    function toggleFireworksPosition(){
        if(fireworkPhase !== 0) return; // アニメーション中は位置を変更しない

        if(positionToggle){
            initializeFireworksPosition();
        }else{
            randomizeFireworksPosition();
        }
        setPositionToggle(prev => !prev);
    }


    /* useEffect */
    // fireworksIdをそれぞれ生成し、画像データからimageDataを取得する
    useEffect(() => {
        (async () => {
            if(!imageSrc) return;
            // 画像データを取得する
            const importedImageData: ImageInfo = await getImageData(imageSrc);
            const newImageData: ImageData = importedImageData.imageData;
            // 画像の大きさを取得する
            const { width, height } = importedImageData;
            setImageData(newImageData);
            setFireworkSize({ width, height });
        })();
        return () => {
            setImageData(null);
        }
    }, [imageSrc]);

    // 花火IDの用意とimageDataの取得が出来たら、花火の星を作成して、花火アニメーションを開始する
    useEffect(() => {
        if(!imageData) return;
        switch(fireworkPhase){
            case 3:
                // 撮影待機処理は別の箇所で行う
                break;
            case 2:
                // 花火を爆発させる
                startBurstAnimation(imageData);
                break;
            case 1:
                // 花火を打ち上げる
                startRiseAnimation();
                break;
            case 0:
            default:
                // 半透明の花火の初期表示処理は別の箇所で行う
                break;
        }

        // アンマウント時にアニメーションを停止
        return () => {
            if(fireworkAnimationFrameId) cancelAnimationFrame(fireworkAnimationFrameId);
            isFinishedFireworkAnimation.current = true;
            if(sparksAnimationFrameId) cancelAnimationFrame(sparksAnimationFrameId);
            isFinishedSparksAnimation.current = true;
        };
    }, [imageData, fireworkPhase]);

    // starsやsparksが変更される度、再度キャンバスに描画する
    useEffect(() => {
        // Canvasコンテキストを取得
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Canvasをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(!imageData) return;

        // 打ち上げ用花火を描画する
        if(fireworkPhase === 1){
            drawStar(ctx, risingStars.capitalStar);
            risingStars.afterImageStars.forEach(afterImage => {
                drawStar(ctx, afterImage.star);
            });
        }else{
            // 爆発用火花を描画する
            for(const spark of sparks){
                drawSpark(ctx, spark);
            }

            // 爆発用花火を描画する
            for(const star of stars){
                drawStar(ctx, star);
            }
        }
    }, [stars, sparks, risingStars]);

    // 花火の初期表示を行う
    useEffect(() => {
        if(fireworkPhase === 0){
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(!imageData) return;
            previewSparks(ctx);
            previewFireworks(ctx, imageData);
        }
    }, [imageData, fireworkPhase, launchAngle]);

    return (
        <FireworksContext.Provider
            value={{
                canvasRef,
                initializeImageSrc,
                toggleFireworksPosition,
                fireworkPhase,
                setFireworkPhase,
                fireworkAnimationFrameId,
                sparksAnimationFrameId
            }}
        >
            {children}
        </FireworksContext.Provider>
    )
}
