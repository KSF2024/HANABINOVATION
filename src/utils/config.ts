import image1_1 from "./../images/河原電子ビジネス専門学校/1.png";
import image1_2 from "./../images/河原電子ビジネス専門学校/2.png";
import image1_3 from "./../images/河原電子ビジネス専門学校/3.png";
import image2_1 from "./../images/河原外語観光・製菓専門学校/1.png";
import image2_2 from "./../images/河原外語観光・製菓専門学校/2.png";
import image2_3 from "./../images/河原外語観光・製菓専門学校/3.png";
import image3_1 from "./../images/大原簿記公務員専門学校 愛媛校/1.png";
import image3_2 from "./../images/大原簿記公務員専門学校 愛媛校/2.png";
import image3_3 from "./../images/大原簿記公務員専門学校 愛媛校/3.png";
import image4_1 from "./../images/河原アイペットワールド専門学校/1.png";
import image4_2 from "./../images/河原アイペットワールド専門学校/2.png";
import image4_3 from "./../images/河原アイペットワールド専門学校/3.png";
import image5_1 from "./../images/河原医療大学校/1.png";
import image5_2 from "./../images/河原医療大学校/2.png";
import image5_3 from "./../images/河原医療大学校/3.png";
import image6_1 from "./../images/河原医療福祉専門学校/1.png";
import image6_2 from "./../images/河原医療福祉専門学校/2.png";
import image6_3 from "./../images/河原医療福祉専門学校/3.png";
import image7_1 from "./../images/河原ビューティーモード専門学校/1.png";
import image7_2 from "./../images/河原ビューティーモード専門学校/2.png";
import image7_3 from "./../images/河原ビューティーモード専門学校/3.png";
import image8_1 from "./../images/河原デザイン・アート専門学校/1.png";
import image8_2 from "./../images/河原デザイン・アート専門学校/2.png";
import image8_3 from "./../images/河原デザイン・アート専門学校/3.png";
import image9_1 from "./../images/松山デザイナー専門学校/1.png";
import image9_2 from "./../images/松山デザイナー専門学校/2.png";
import image9_3 from "./../images/松山デザイナー専門学校/3.png";
import image10_1 from "./../images/河原医療大学校 新居浜校/1.png";
import image10_2 from "./../images/河原医療大学校 新居浜校/2.png";
import image10_3 from "./../images/河原医療大学校 新居浜校/3.png";

type SchoolInfo = {
    schoolName: string; // 学校名
    color: string; // 学校のテーマカラー(カラーコード)
    fireworksImages: {0: string, 1: string, 2: string}; // 花火の画像
    positionX: number; // マップ上のブースの位置(横軸)
    positionY: number; // マップ上のブースの位置(縦軸)
}

// 各学校の設定データ
export const SCHOOL_DATA: { [boothId: string]: SchoolInfo } = {
    "HF5W2T": {
        schoolName: "河原電子ビジネス専門学校",
        color: "#00FFFF",
        fireworksImages: [image1_1, image1_2, image1_3],
        positionX: 0,
        positionY: 0
    },
    "Y6XBJH": {
        schoolName: "河原外語観光・製菓専門学校",
        color: "#4800FF",
        fireworksImages: [image2_1, image2_2, image2_3],
        positionX: 0,
        positionY: 0
    },
    "7JDZVP": {
        schoolName: "大原簿記公務員専門学校 愛媛校",
        color: "#FF0000",
        fireworksImages: [image3_1, image3_2, image3_3],
        positionX: 0,
        positionY: 0
    },
    "SHSQ4A": {
        schoolName: "河原アイペットワールド専門学校",
        color: "#FFA500",
        fireworksImages: [image4_1, image4_2, image4_3],
        positionX: 0,
        positionY: 0
    },
    "FZVSW0": {
        schoolName: "河原医療大学校",
        color: "#00FF00",
        fireworksImages: [image5_1, image5_2, image5_3],
        positionX: 0,
        positionY: 0
    },
    "WA067Z": {
        schoolName: "河原医療福祉専門学校",
        color: "#CDFF00",
        fireworksImages: [image6_1, image6_2, image6_3],
        positionX: 0,
        positionY: 0
    },
    "94VPFZ": {
        schoolName: "河原ビューティモード専門学校",
        color: "#FF00FF",
        fireworksImages: [image7_1, image7_2, image7_3],
        positionX: 0,
        positionY: 0
    },
    "5HGS6W": {
        schoolName: "河原デザイン・アート専門学校",
        color: "#FFFF00",
        fireworksImages: [image8_1, image8_2, image8_3],
        positionX: 0,
        positionY: 0
    },
    "HDE5W4": {
        schoolName: "松山デザイナー専門学校",
        color: "#00FF00",
        fireworksImages: [image9_1, image9_2, image9_3],
        positionX: 0,
        positionY: 0
    },
    "Y9KFFH": {
        schoolName: "河原医療大学校 新居浜校",
        color: "#00FFAC",
        fireworksImages: [image10_1, image10_2, image10_3],
        positionX: 0,
        positionY: 0
    }
};

// ブースIDのリスト
export const BOOTH_ID_LIST: string[] = Object.keys(SCHOOL_DATA);
