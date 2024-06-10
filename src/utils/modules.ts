import { Color } from "./hanabi";

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

// 使用例
const colorCode = "#3498db";
const transparency = 0.5;
const rgbaColor = hexToRgba(colorCode, transparency);
console.log(rgbaColor); // 出力: "rgba(52, 152, 219, 0.5)"
