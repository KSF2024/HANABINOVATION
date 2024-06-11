import { Color, Point } from "./types";

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
