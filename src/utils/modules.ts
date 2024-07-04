import { ulid } from "ulidx";
import { Color, ImageInfo, Point } from "./types";
import { BOOTH_ID_LIST, SCHOOL_DATA } from "./config";

/**
 * カラーコードと透明度を受け取り、オブジェクト形式に変換する関数
 * @param hex カラーコード (例: "#RRGGBB" または "#RGB")
 * @param alpha 透明度 (0 から 1 の間)
 * @returns オブジェクト形式のカラー
 */
export function hexToRgba(hex: string, alpha: number): Color{
    // カラーコードの前にある「#」を削除
    hex = hex.replace(/^#/, "");

    // 3桁の場合は6桁に変換
    if (hex.length === 3) {
        hex = hex.split("").map(char => char + char).join("");
    }

    // RGB値を抽出
    const bigint = parseInt(hex, 16);
    const red: number = (bigint >> 16) & 255;
    const green: number = (bigint >> 8) & 255;
    const blue: number = bigint & 255;

    // RGBA形式の文字列を返す
    return { red, green, blue, alpha };
}

// 指定した条件に基づいてY軸と交わる点を計算する関数
export function findIntersection(start: Point, angleDegrees: number, height: number): Point {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const slope = Math.tan(angleRadians);

    // 方程式: height = slope * (x - start.x) + start.y
    // 軸 (y = height) と交わる点
    const xAxisIntersectionX = (height - start.y) / slope + start.x;
    const xAxisIntersection: Point = { x: xAxisIntersectionX, y: height };

    return xAxisIntersection;
}

// 二点間の距離を計算する関数
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

// sleep関数
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 画像からImageDataを作成する関数
export async function getImageData(image: string): Promise<ImageInfo>{
    return new Promise<ImageInfo>((resolve, _rejects) => {
        // canvas要素を作成
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // 画像を読み込み、canvasに描画
        const img = new Image();
        const newId: string = ulid();
        img.onload = () => {
            if (!ctx) return;

            // 元の画像の比率を保持したまま横幅を300pxに設定
            const originalWidth = img.width;
            const originalHeight = img.height;
            const newWidth = 300;
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
            resolve(result);
        };
        img.src = image;
    });
}

// 正しいブースIDかどうかを確かめる関数
export function validateBoothId(boothId: string): boolean{
    return BOOTH_ID_LIST.includes(boothId);
}

// 画像データのパスを取得する関数
export function getImageSrc(boothId: string, fireworkType: 0 | 1 | 2 | 3, fireworkDesign: Blob | null): string | null{
    let result: string = "";

    // 例外処理を行う
    if(!boothId) return null;
    if(!validateBoothId(boothId)) return null;

    // 画像データへのパスを取得する
    if(fireworkType === 0){
        if(!fireworkDesign) return null;
        result = URL.createObjectURL(fireworkDesign);
    }else{
        const fireworkTypeIndex: 0 | 1 | 2 = (fireworkType - 1) as (0 | 1 | 2);
        result = SCHOOL_DATA[boothId].fireworksImages[fireworkTypeIndex];
    }

    return result;
}

// ブースIDを指定して、各専門学校のテーマカラーを取得する関数
export function getBoothColor(boothId: string): string | null{
    if(!validateBoothId(boothId)) return null;
    return SCHOOL_DATA[boothId].color;
}

// ブースの3種類の花火型のセットアップのImageDataを取得する関数
export async function getAllImageData(boothId: string, setupList: number[]): Promise<ImageInfo[]>{
    const newFireworkImages: ImageInfo[] = [];
    for(const fireworkType of setupList){
        const imageSrc = getImageSrc(boothId, fireworkType as any, null);
        if(imageSrc){
            const newImageData = await getImageData(imageSrc);
            newFireworkImages.push(newImageData);
        }
    }
    return newFireworkImages;
}

// canvas要素からctxを取得する関数
export function getCtxFromCanvas(canvasElement: HTMLCanvasElement | null): CanvasRenderingContext2D  | null{
    if (!canvasElement) return null;;
    const ctx = canvasElement.getContext("2d");
    return ctx;
}

// BlobをImageDataに変換する関数
export async function convertBlobToImageData(blob: Blob){
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            resolve(imageData);
        };

        img.onerror = (error) => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}