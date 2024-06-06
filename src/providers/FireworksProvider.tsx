import { createContext, ReactNode, useState, useEffect, useRef, useContext } from 'react';
import { ImageInfo, Spark, Star, generateStars } from '../utils/hanabi';
import { DataContext } from './DataProvider';
import { getBoothColor, getImageSrc } from '../utils/config';
import { ulid } from "ulidx";

/* 型定義 */
// contextに渡すデータの型
type FireworksContent = {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    initializeImageSrc(): void;
};

/* Provider */
const initialData: FireworksContent = {
    canvasRef: {} as React.RefObject<HTMLCanvasElement>,
    initializeImageSrc: () => {}
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
    const [fireworksPositionObj, setFireworksPositionObj] = useState<{[id: string]: {gapX: number, gapY: number}}>({}); // 花火が打ち上がる位置

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

    
    /* 花火(Star)用関数定義 */
    // 画像からImageDataを作成する関数
    async function getImageData(image: string): Promise<ImageInfo>{
        return new Promise<ImageInfo>((resolve, _rejects) => {
            // canvas要素を作成
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 画像を読み込み、canvasに描画
            const img = new Image();
            const newId: string = ulid();
            img.onload = () => {
                if (!ctx) return;

                // 元の画像の比率を保持したまま横幅を300pxに設定
                const originalWidth = img.width;
                const originalHeight = img.height;
                const newWidth = Math.min(window.innerWidth, window.innerHeight) * 0.7;
                const newHeight = (originalHeight * newWidth) / originalWidth;

                // canvasの大きさを新しい大きさに合わせる
                canvas.width = newWidth;
                canvas.height = newHeight;

                // 画像のリサイズと中心点の調整をして描画
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                // ImageDataオブジェクトを取得
                const newImageData: ImageData = ctx.getImageData(0, 0, newWidth, newHeight);
                
                const result: ImageInfo = {
                    id: newId,
                    imageData: newImageData,
                    width: newWidth,
                    height: newHeight
                };
                console.log(result)
                resolve(result);
            };
            img.src = image;
        });
    }

    // starデータからキャンバスに点を描画する関数
    function drawStar(ctx: CanvasRenderingContext2D, star: Star) {
        const color: string = `rgba(${[star.color.red, star.color.green, star.color.blue, star.color.alpha / 255]})`;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    // 花火を爆発させるアニメーション
    function burstFireworks(id: string, initialX: number, initialY: number){
        // console.log("burstFireworks"+"\n"+id);
        if(!starsRef.current[id]) return;
        const renderingStars: Star[] = starsRef.current[id]; // 花火の完成予想図
        const speed: number = 10;

        setStarsObj(prevStars => {
            // 新しいスターの位置を計算して更新
            const updatedStars = prevStars[id].map((star, index) => {
                const renderingStar: Star = renderingStars[index];
                const renderingX: number = renderingStar.x - fireworksSizeObj[id].width / 2 + initialX;
                const renderingY: number = renderingStar.y - fireworksSizeObj[id].height / 2 + initialY;

                /* ここを改変することで、花火のモーションを変更できる */
                const dx: number = (renderingX - star.x) / speed;
                const dy: number = (renderingY - star.y) / speed;
                const newX: number = star.x + dx;
                const newY: number = star.y + dy;

                return {...star, x: newX, y: newY};
            });

            // 加速度が0に近づいたら、アニメーションを停止する
            isFinishedFireworksAnimationObj.current[id] = prevStars[id].every((star, index) => {
                const renderingStar: Star = renderingStars[index];
                const renderingX: number = renderingStar.x - fireworksSizeObj[id].width / 2 + initialX;
                const renderingY: number = renderingStar.y - fireworksSizeObj[id].height / 2 + initialY;
                const dx: number = (renderingX - star.x) / speed;
                const dy: number = (renderingY - star.y) / speed;
                return (Math.abs(dx) < 1 && Math.abs(dy) < 1);
            })

            const result = {...prevStars, [id]: updatedStars};
            return result;
        });

        if(isFinishedFireworksAnimationObj.current[id]){
            console.log("animation stopped")
            // 花火のアニメーションが終了したら、アニメーションを停止する
            setFireworksAnimationFrameIdObj(prev => {
                const {removedId: id, ...newAnimationFrameId} = prev;
                return newAnimationFrameId;
            });
            return;
        }else{
            // 次のフレームを要求
            const newAnimationFrameId = requestAnimationFrame(() => burstFireworks(id, initialX, initialY));
            setFireworksAnimationFrameIdObj(prev => ({...prev, [id]: newAnimationFrameId}));
        }
    }

    // 花火の星データ(花火が爆発した後)から、アニメーション開始時の花火の星(中央に集合した状態)のデータを取得する関数
    function initializeStars(stars: Star[], initialX: number, initialY: number): Star[]{
        return stars.map((star) => {
            return {...star, x: initialX, y: initialY}
        });
    }


    /* 花火(Spark)用関数定義 */
    // 火花データを生成する関数
    function generateSparks(sparkType: number, color: string, initialX: number, initialY: number): Spark[]{
        const result: Spark[] = [];

        const amount: number = 30; // 火花の数
        const standardRadius: number = 5; // 火花の大きさ

        // 火花データを生成する
        switch(sparkType){
            case 2: // 雫型
                generateDropSparks();
                break;
            case 1: // 線型
                generateLineSparks();
                break;
            case 0: // 丸型
            default:
                generateNormalSparks();
        }

        // 丸型の火花を生成する関数
        function generateNormalSparks(){
            for(let i: number = 0; i < amount; i++){
                const direction: number = ((360 / amount) * i) / Math.PI; // 火花の向き(ラジアン)
                const newOuterSpark: Spark = {
                    color,
                    alpha: 255,
                    x: initialX,
                    y: initialY,
                    standardRadius,
                    radius: standardRadius,
                    direction,
                    movementType: 2,
                    sparkType: 0
                };
                const newInnerSpark: Spark = {
                    color,
                    alpha: 255,
                    x: initialX,
                    y: initialY,
                    standardRadius,
                    radius: standardRadius * 0.9,
                    direction,
                    movementType: 1,
                    sparkType: 0
                };

                result.push(newOuterSpark);
                result.push(newInnerSpark);
            }
        }

        // 線型の火花を生成する関数
        function generateLineSparks(){
            for(let i: number = 0; i < amount; i++){
                const direction: number = ((360 / amount) * i) / Math.PI; // 火花の向き(ラジアン)
                const newSpark: Spark = {
                    color,
                    alpha: 255,
                    x: initialX,
                    y: initialY,
                    standardRadius: standardRadius * 0.5,
                    radius: standardRadius,
                    direction,
                    movementType: 2,
                    sparkType: 1
                };
                result.push(newSpark);
            }

            return result;
        }

        // 雫型の火花を生成する関数
        function generateDropSparks(){
            for(let i: number = 0; i < amount; i++){
                const direction: number = ((360 / amount) * i) / Math.PI; // 火花の向き(ラジアン)
                const newSpark: Spark = {
                    color,
                    alpha: 255,
                    x: initialX,
                    y: initialY,
                    standardRadius,
                    radius: standardRadius,
                    direction,
                    movementType: 2,
                    sparkType: 2
                };
                result.push(newSpark);
            }

            return result;
        }

        return result;
    }

    // sparkデータからキャンバスに点を描画する関数
    function drawSpark(ctx: CanvasRenderingContext2D, spark: Spark) {
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = spark.alpha / 255;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    // 火花を爆発させるアニメーション
    function burstSparks(id: string, initialX: number, initialY: number){
        const speed: number = 10;
        const outerDifference: number = 0.75; // 外火花と内火花の距離の差の倍率

        setSparksObj(prevSparks => {
            const afterImageSparks: Spark[] = []; // 火花の残像
            const newSparks: Spark[] = prevSparks[id].map(spark => {
                // 火花の最終位置を計算する
                const fireworkSize = fireworksSizeObj[id];
                const maxDistance: number = (Math.max(fireworkSize.width, fireworkSize.height) / 2) * 1.1;
                const goalDistance: number = maxDistance * ((spark.movementType - 1) ? 1 : outerDifference); // 火花の最終位置から中心点の距離

                // 火花の動きを停止させるかどうかを計算する
                const prevDistanceX: number = Math.abs(initialX - spark.x); // 中心点からの横距離
                const prevDistanceY: number = Math.abs(initialY - spark.y); // 中心点からの縦距離
                const prevDistance: number = Math.sqrt(Math.pow(prevDistanceX, 2) + Math.pow(prevDistanceY, 2)); // 中心点からの距離
                if((spark.movementType === 0) || (prevDistance >= goalDistance)){
                    if(spark.movementType === 2){
                        // 外側の火花が目標位置に達した場合、アニメーションを終了させる
                        isFinishedSparksAnimationObj.current[id] = true;
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
                const newDistance: number = Math.sqrt(Math.pow(initialX - newX, 2) + Math.pow((initialY - newY), 2)); // 中心点からの距離
                if(newDistance >= goalDistance){
                    const goalX: number = initialX + Math.cos(spark.direction) * goalDistance;
                    const goalY: number = initialY + Math.sin(spark.direction) * goalDistance;
                    newX = goalX;
                    newY = goalY;
                }

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
            return {...prevSparks, [id]: [...newSparks, ...afterImageSparks]};
        });

        if(isFinishedSparksAnimationObj.current[id]){
            console.log("sparks animation stopped")
            // 花火のアニメーションが終了したら、アニメーションを停止する
            setSparksAnimationFrameIdObj(prev => {
                const {removedId: id, ...newAnimationFrameId} = prev;
                return newAnimationFrameId;
            });
            return;
        }else{
            // 次のフレームを要求
            const newAnimationFrameId = requestAnimationFrame(() => burstSparks(id, initialX, initialY));
            setSparksAnimationFrameIdObj(prev => ({...prev, [id]: newAnimationFrameId}));
        }
    }

    /* 花火&火花用共通関数定義 */
    // 花火と火花が消えていくアニメーション
    function fadeFireworksAndSparks(id: string){
        if(!starsRef.current[id]) return;
        const speed: number = 10;

        setStarsObj((prevStars) => {
            // 新しい花火の星の透明度を計算して更新
            const updatedStars = prevStars[id].map((star) => {
                const newAlpha: number = Math.max(Math.round(star.color.alpha - speed), 0); // 透明度が負にならないようにする
                return {...star, color: {...star.color, alpha: newAlpha}};
            });

            isFinishedFireworksAnimationObj.current[id] = prevStars[id].every((star) => {
                // 全ての花火の星の透明度が0以下になったらアニメーションを停止
                return star.color.alpha <= 0;
            })

            const result = {...prevStars, [id]: updatedStars};
            return result;
        });

        setSparksObj((prevSparks) => {
            // 新しい火花の透明度を計算して更新
            const updatedStars = prevSparks[id].map((spark) => {
                const newAlpha: number = Math.max(Math.round(spark.alpha - speed), 0); // 透明度が負にならないようにする
                return {...spark, alpha: newAlpha};
            });

            isFinishedSparksAnimationObj.current[id] = prevSparks[id].every((sparks) => {
                // 全ての火花の透明度が0以下になったらアニメーションを停止
                return sparks.alpha <= 0;
            })

            const result = {...prevSparks, [id]: updatedStars};
            return result;
        });

        if(isFinishedFireworksAnimationObj.current[id]){
            // 花火のアニメーションが終了したら、アニメーションを停止する
            setFireworksAnimationFrameIdObj(prev => {
                const {removedId: id, ...newAnimationFrameId} = prev;
                return newAnimationFrameId;
            });
            return;
        }else{
            // 次のフレームを要求
            const newAnimationFrameId: number = requestAnimationFrame(() => fadeFireworksAndSparks(id));
            setFireworksAnimationFrameIdObj(prev => ({...prev, [id]: newAnimationFrameId}));
        }
    }

    /* useEffect用関数定義 */
    // 画像データを読み込み、花火を爆発させるアニメーションを開始する
    function startBurstAnimation(id: string, imageData: ImageData){
        // 前回の花火打ち上げアニメーションを消去し、初期化する
        if(fireworksAnimationFrameIdObj[id]){
            cancelAnimationFrame(fireworksAnimationFrameIdObj[id]);
            isFinishedFireworksAnimationObj.current[id] = true;
        }
        if(sparksAnimationFrameIdObj[id]){
            cancelAnimationFrame(sparksAnimationFrameIdObj[id]);
            isFinishedSparksAnimationObj.current[id] = true;
        }

        // imageDataから花火の星を作成する
        const newStars: Star[] = generateStars(imageData, launchAngle);
        // console.log({[id]: newStars})
        starsRef.current[id] = newStars;

        // 花火を打ち上げる中心点を求める
        let initialX: number =  0;
        let initialY: number =  0;
        if(canvasRef.current){
            initialY = canvasRef.current.height / 2;
            initialX = canvasRef.current.width / 2;
            if(Object.keys(imageDataObj).length > 1){
                // TODO 花火が複数あるときの位置決め
            }
        }

        // 花火データを初期化(中心点に集める)し、stateに保存する
        const initializedStars: Star[] = initializeStars(newStars, initialX, initialY);
        setStarsObj(prev => ({ ...prev, [id]: initializedStars }));

        // 火花データを作成し、stateに保存する
        if(!boothId) return;
        const sparksColor: string | null = getBoothColor(boothId);
        if(!sparksColor) return;
        const newSparks: Spark[] = generateSparks(sparksType, sparksColor, initialX, initialY);
        setSparksObj(prev => ({...prev, [id]: newSparks}));

        // 花火アニメーションを開始
        const newFireworksAnimationFrameId: number = requestAnimationFrame(() => burstFireworks(id, initialX, initialY));
        setFireworksAnimationFrameIdObj(prev => ({...prev, [id]: newFireworksAnimationFrameId}));
        isFinishedFireworksAnimationObj.current[id] = false;

        // 火花アニメーションを開始
        const newSparksAnimationFrameId: number = requestAnimationFrame(() => burstSparks(id, initialX, initialY));
        setSparksAnimationFrameIdObj(prev => ({...prev, [id]: newSparksAnimationFrameId}));
        isFinishedSparksAnimationObj.current[id] = false;
    }


    /* useEffect */
    // fireworksIdをそれぞれ生成し、画像データからimageDataを取得する
    useEffect(() => {
        (async () => {
            const importedImageData: ImageInfo[] = await Promise.all(imageSrc.map(async (value) => {
                return await getImageData(value);
            }));
            const newImageDataObj: {[id: string]: ImageData} = {};
            const newFireworkSizeObj: {[id: string]: {width: number, height: number}} = {};
            importedImageData.forEach(data => {
                const {id, imageData, width, height} = data;
                newImageDataObj[id] = imageData;
                newFireworkSizeObj[id] = {width, height};
            });
            setImageDataObj(newImageDataObj);
            setFireworksSizeObj(newFireworkSizeObj);
        })();
        // console.log({imageSrc})
        return () => {
            setImageDataObj({});
        }
    }, [imageSrc]);

    // 花火IDの用意とimageDataの取得が出来たら、花火の星を作成して、花火アニメーションを開始する
    useEffect(() => {
        (async () => {
            for(const id of Object.keys(imageDataObj)){
                // console.log(id)
                if(imageDataObj[id]){
                    startBurstAnimation(id, imageDataObj[id]);
                    await new Promise(resolve => setTimeout(resolve, 250));
                }
            }
        })();

        // アンマウント時にアニメーションを停止
        return () => {
            Object.keys(imageDataObj).forEach(id => {
                if(fireworksAnimationFrameIdObj[id]) cancelAnimationFrame(fireworksAnimationFrameIdObj[id]);
                isFinishedFireworksAnimationObj.current[id] = true;
                if(sparksAnimationFrameIdObj[id]) cancelAnimationFrame(sparksAnimationFrameIdObj[id]);
                isFinishedSparksAnimationObj.current[id] = true;
            });
        };
    }, [imageDataObj]);

    // starsやsparksが変更される度、再度キャンバスに描画する
    useEffect(() => {
        console.log("redraw caused");
        // Canvasコンテキストを取得
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvasをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 花火を描画
        Object.keys(imageDataObj).forEach(id => {
            // 火花を描画
            if(sparksObj[id]){
                for(const spark of sparksObj[id]){
                    drawSpark(ctx, spark);
                }
            }

            // 花火の星を描画
            if(starsObj[id]){
                for(const star of starsObj[id]){
                    drawStar(ctx, star);
                }
            }
        })
    }, [starsObj, sparksObj]);

    return (
        <FireworksContext.Provider
            value={{
                canvasRef,
                initializeImageSrc
            }}
        >
            {children}
        </FireworksContext.Provider>
    )
}
