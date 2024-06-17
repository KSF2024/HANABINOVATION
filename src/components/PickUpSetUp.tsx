import { CSSProperties, useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../providers/DataProvider";
import { getAllImageData, getBoothColor, getCtxFromCanvas } from "../utils/modules";
import { drawSpark, drawStar, generateSparks, generateStars } from "../utils/hanabi";
import { Size, Spark, Star } from "../utils/types";

const containerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: "0.5rem 0"
};

function getPrimaryCanvasSize(): number{
    const maxWidth: number = window.innerHeight * 0.4;
    const width: number = window.innerWidth * 0.8;
    if(maxWidth > width){
        return width;
    }else{
        return maxWidth;
    }
}

function getSecondaryCanvasSize(): number{
    const maxWidth: number = window.innerHeight * 0.1;
    const width: number = window.innerWidth * 0.2;
    if(maxWidth > width){
        return width;
    }else{
        return maxWidth;
    }
}

export default function PickUpSetUp(){
    const [fireworkImages, setFireworkImages] = useState<ImageData[]>([]); // 花火の画像データ

    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const fireworkCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
    const sparksCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    // データを管理するためのcontext
    const {
        boothId,
        fireworkType,
        setFireworkType,
        sparksType,
        setSparksType
    } = useContext(DataContext);

    // 花火の大きさを取得する関数
    function getFireworkSize(fireworkType: number): Size{
        // 花火の大きさを取得する
        return {
            width: fireworkImages[fireworkType]?.width || 0,
            height: fireworkImages[fireworkType]?.height || 0
        }
    }

    // 花火を初期表示する関数
    function previewFireworks(
        ctx: CanvasRenderingContext2D,
        imageData: ImageData,
        canvasSize: number,
        fireworkSize: Size
    ){
        // imageDataから花火の星を作成する
        const newStars: Star[] = generateStars(imageData);

        // 花火の中心点を求める
        const defaultWidth: number = 300; // 花火の基本サイズ
        const reductionRate: number = 0.8; // 花火の縮小率
        const scale: number = canvasSize / defaultWidth * reductionRate; // 300を基準としたスケーリングファクター
        const initialX: number = (defaultWidth / 2) - (fireworkSize.width / 2) + (defaultWidth * (1 - reductionRate) / 2);
        const initialY: number = (defaultWidth / 2) - (fireworkSize.height / 2) + (defaultWidth * (1 - reductionRate) / 2);

        // 花火を描画する
        newStars.forEach((star) => {
            star.x += initialX;
            star.y += initialY;
            drawStar(ctx, star, 255, scale);
        })
    }

    // 火花を初期表示する関数
    function previewSparks(ctx: CanvasRenderingContext2D, sparksType: number, canvasSize: number){
        if(!boothId) return;
        const sparksColor: string | null = getBoothColor(boothId);
        if(!sparksColor) return;

        const defaultWidth: number = 300; // 花火の基本サイズ
        const reductionRate: number = 0.8; // 花火の縮小率
        const scale: number = canvasSize / defaultWidth * reductionRate; // 300を基準としたスケーリングファクター
        const initialX: number = canvasSize / 2;
        const initialY: number = canvasSize / 2;

        // 火花データを生成する
        const generatedSparks: Spark[] = generateSparks(sparksType, sparksColor, initialX, initialY);
        const finalSparks: Spark[] = getFinalSparks();

        finalSparks.forEach(spark => {
            drawSpark(ctx, spark, 255, Math.max(scale, 0.5));
        })

        // 火花の最終位置を取得する関数
        function getFinalSparks(): Spark[]{
            const speed: number = 10 * scale;
            const outerDifference: number = 0.75; // 外火花と内火花の距離の差の倍率
            let result: Spark[] = [...generatedSparks];
            let isNotFinished: boolean = true; // 火花の最終位置の取得が済んでいないか
            while(isNotFinished){
                const afterImageSparks: Spark[] = []; // 火花の残像
                const newSparks = result.map(spark => {
                    // 火花の最終位置を計算する
                    const maxDistance: number = (300 / 2) * 1.1 * scale;
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
                result = [...newSparks, ...afterImageSparks];
            }
            return result;
        }
    }

    // ブースIDが取得出来たら、花火の画像データを読み込む
    useEffect(() => {
        if(!boothId) return;
        (async () => {
            const allImageData = await getAllImageData(boothId, [1, 2, 3]);
            setFireworkImages(allImageData.map(image => image.imageData));
        })();
    }, [boothId]);

    // 画像データを読み込み終えたら、セットアップ選択用canvasに描画を行う
    useEffect(() => {
        if(fireworkImages.length <= 0) return;

        const secondaryCanvasSize: number = getSecondaryCanvasSize();
        const fireworkSize = getFireworkSize(fireworkType - 1);

        // 火花のセットアップ選択用描画を行う
        sparksCanvasRefs.current.forEach((canvasElement, index) => {
            const ctx = getCtxFromCanvas(canvasElement);
            if(!ctx) return;
            if(!canvasElement) return;
            previewSparks(ctx, index, secondaryCanvasSize);
        });

        // 花火のセットアップ選択用描画を行う
        fireworkCanvasRefs.current.forEach((canvasElement, index) => {
            const ctx = getCtxFromCanvas(canvasElement);
            if(!ctx) return;
            if(!canvasElement) return;
            previewFireworks(ctx, fireworkImages[index], secondaryCanvasSize, fireworkSize);
        });
    }, [fireworkImages]);


    // 花火の初期表示を行う
    useEffect(() => {
        if(fireworkImages.length <= 0) return;
        if(!previewCanvasRef.current) return;

        const primaryCanvasSize: number = getPrimaryCanvasSize();
        const fireworkSize = getFireworkSize(fireworkType - 1);

        // セットアップ確認ウィンドウ用描画を行う
        const mainCtx = getCtxFromCanvas(previewCanvasRef.current);
        if(!mainCtx) return;
        mainCtx.clearRect(0, 0, primaryCanvasSize, primaryCanvasSize);
        previewSparks(mainCtx, sparksType, primaryCanvasSize);
        previewFireworks(mainCtx, fireworkImages[fireworkType - 1], primaryCanvasSize, fireworkSize);
    }, [fireworkImages, fireworkType, sparksType]);

    return (
        <div
            style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <canvas
                ref={previewCanvasRef}
                className="bg-img-transparent"
                width={getPrimaryCanvasSize()}
                height={getPrimaryCanvasSize()}
                style={{
                    margin: "0.5rem",
                    border: "1px black solid"
                }}
            />
            <div>
                <div style={containerStyle}>
                    {[1, 2, 3].map((value, index) => (
                        <canvas
                            key={index}
                            ref={(element) => (fireworkCanvasRefs.current[index] = element)}
                            className="bg-img-transparent"
                            width={getSecondaryCanvasSize()}
                            height={getSecondaryCanvasSize()}
                            style={{
                                border: "1px black solid",
                                marginLeft: (index === 0) ? 0 : "1rem",
                                outline: (value === fireworkType) ? "0.3rem #1976D2 solid" : ""
                            }}
                            onClick={() => setFireworkType(value as 1 | 2 | 3)}
                        />
                    ))}
                </div>
                <div style={{...containerStyle, marginTop: "1.5rem"}}>
                    {[0, 1, 2].map((value, index) => (
                        <canvas
                            key={index}
                            ref={(element) => (sparksCanvasRefs.current[index] = element)}
                            width={getSecondaryCanvasSize()}
                            height={getSecondaryCanvasSize()}
                            style={{
                                border: "1px black solid",
                                marginLeft: (index === 0) ? 0 : "1rem",
                                backgroundColor: "black",
                                outline: (value === sparksType) ? "0.3rem #1976D2 solid" : ""
                            }}
                            onClick={() => setSparksType(value as 0 | 1 | 2)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
