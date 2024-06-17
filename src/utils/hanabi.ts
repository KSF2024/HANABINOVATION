import { hexToRgba } from "./modules";
import { Spark, Star } from "./types";

export function generateStars(imageData: ImageData, angle: number = 0, interval: number = 10, radius: number = 5): Star[]{
    const stars: Star[] = [];
    const data = imageData.data;
    const width: number = imageData.width;
    const height: number = imageData.height;

    // 一定の間隔ごとにピクセルの色と座標を取得
    for (let y = 0; y <= height; y += interval) {
        for (let x = 0; x <= width; x += interval) {

            // ピクセルの色情報を取得
            // 画像のピクセルは1次元配列で管理されているため、
            // 4つの要素を1つのピクセルとして扱う
            const index = (y * imageData.width + x) * 4;
            const red = data[index];
            const green = data[index + 1];
            const blue = data[index + 2];
            const alpha = data[index + 3];

            // 座標を回転させる
            const rotatedPoint = (angle === 0) ? {x, y} : rotatePoint(x, y, width, height, angle);

            stars.push(Object.assign({
                color: { red, green, blue, alpha },
                radius
            }, rotatedPoint));
        }
    }

    return stars;
};

// ボードの横幅と縦幅を指定し、点を指定した角度で回転させる関数
function rotatePoint(x: number, y: number, width: number, height: number, angle: number): {x: number, y: number}{
    // ラジアンに変換
    let radians = angle * (Math.PI / 180);

    // ボードの中心を計算
    let centerX = width / 2;
    let centerY = height / 2;

    // 点を中心に移動
    let translatedX = x - centerX;
    let translatedY = y - centerY;

    // 回転行列を使用して点を回転
    let rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
    let rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians);

    // 点を元の位置に戻す
    let finalX = rotatedX + centerX;
    let finalY = rotatedY + centerY;

    return { x: finalX, y: finalY };
}

// starデータからキャンバスに点を描画する関数
export function drawStar(ctx: CanvasRenderingContext2D, star: Star, alpha?: number, scale: number = 1){
    // スケーリングされた座標と半径
    const scaledX: number = star.x * scale;
    const scaledY: number = star.y * scale;
    const scaledRadius: number = star.radius * scale;

    // 色の設定
    const starAlpha: number = (alpha) ? Math.min(star.color.alpha, alpha): star.color.alpha;
    const color: string = `rgba(${[star.color.red, star.color.green, star.color.blue, starAlpha / 255]})`;
    ctx.fillStyle = color;

    // 星の描画
    ctx.beginPath();
    ctx.arc(scaledX, scaledY, scaledRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// 火花データを生成する関数
export function generateSparks(sparkType: number, colorCode: string, initialX: number, initialY: number): Spark[]{
    const result: Spark[] = [];

    const amount: number = 30; // 火花の数
    const standardRadius: number = 5; // 火花の大きさ
    const color = hexToRgba(colorCode, 255);

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
export function drawSpark(ctx: CanvasRenderingContext2D, spark: Spark, alpha?: number, scale: number = 1){
    // スケーリングされた半径
    const scaledRadius: number = spark.radius * scale;

    // 色の設定
    const sparkAlpha: number = (alpha || spark.color.alpha) / 255;
    ctx.fillStyle = `rgba(${spark.color.red},${spark.color.green},${spark.color.blue},${sparkAlpha})`;

    // 火花の描画
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, scaledRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}
