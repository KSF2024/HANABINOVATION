import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../providers/DataProvider";
import { getAllImageData, getBoothColor } from "../utils/modules";
import { drawSpark, drawStar, generateSparks, generateStars } from "../utils/hanabi";
import { Spark, Star } from "../utils/types";
import { Grid } from "@mui/material";

export default function PickUpSetUp(){
    const [fireworkImages, setFireworkImages] = useState<ImageData[]>([]); // 花火の画像データ
    const [fireworkSize, setFireworkSize] = useState<{width: number, height: number}>({width: 0, height: 0}); // 花火の幅

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


    // 花火を初期表示する関数
    function previewFireworks(ctx: CanvasRenderingContext2D, imageData: ImageData){
        // imageDataから花火の星を作成する
        const newStars: Star[] = generateStars(imageData, 0);

        // 花火を打ち上げる中心点を求める
        newStars.forEach((star) => {
            star.x += 0;
            star.y += 0;
            drawStar(ctx, star, 255);
        })
    }

    // 火花を初期表示する関数
    function previewSparks(ctx: CanvasRenderingContext2D){
        if(!boothId) return;
        const sparksColor: string | null = getBoothColor(boothId);
        if(!sparksColor) return;

        const initialX: number = 0;
        const initialY: number = 0;

        // 火花データを生成する
        const generatedSparks: Spark[] = generateSparks(sparksType, sparksColor, 0, 0);
        const finalSparks: Spark[] = getFinalSparks();

        finalSparks.forEach(spark => {
            drawSpark(ctx, spark, 255);
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
            setFireworkSize({
                width: allImageData[0].width,
                height: allImageData[0].height
            });
            setFireworkImages(allImageData.map(image => image.imageData));
        })();
    }, [boothId]);

    return (
        <div
            style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                margin: "1rem"
            }}
        >
            <canvas
                ref={previewCanvasRef}
                style={{
                    width: "80vw",
                    height: "80vw",
                    maxWidth: "50vh",
                    maxHeight: "50vh",
                    border: "1px black solid"
                }}
            />
            <Grid
                container
                spacing={5}
                style={{
                    height: "20vw",
                    maxHeight: "10vh",
                }}
            >
                {[1, 2, 3].map((_fireworkType, index) => (
                    <canvas
                        key={index}
                        ref={(element) => (fireworkCanvasRefs.current[index] = element)}
                        style={{
                            width: "20vw",
                            height: "20vw",
                            maxWidth: "10vh",
                            maxHeight: "10vh",
                            border: "1px black solid"
                        }}
                    />
                ))}
            </Grid>
            <Grid
                container
                spacing={5}
                style={{
                    height: "20vw",
                    maxHeight: "10vh",
                }}
            >
                {[0, 1, 2].map((_sparksType, index) => (
                    <canvas
                        key={index}
                        ref={(element) => (sparksCanvasRefs.current[index] = element)}
                        style={{
                            width: "20vw",
                            height: "20vw",
                            maxWidth: "10vh",
                            maxHeight: "10vh",
                            border: "1px black solid"
                        }}
                    />
                ))}
            </Grid>
        </div>
    )
}
