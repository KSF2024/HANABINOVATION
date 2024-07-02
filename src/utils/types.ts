// 位置データの型
export type Point = {
    x: number;
    y: number;
};

export type Size = {
    width: number;
    height: number;
}

// 色データの型
export type Color = {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

// 花火の星データの型
export type Star = {
    color: Color;
    x: number
    y: number
    radius: number
}

// 画像データの型
export type ImageInfo = {
    id: string;
    imageData: ImageData;
    width: number;
    height: number;
}

// 火花データの型
export type Spark = {
    color: Color;
    x: number;
    y: number;
    standardRadius: number;
    radius: number;
    direction: number;
    movementType: 0 | 1 | 2; // 火花の動き(0: 停止, 1: 内丸, 2: 外丸)
    sparkType: 0 | 1 | 2; // 火花の形(0: 丸型, 1: 線型, 2: 雫型)
}

// 打ち上げ用花火の残像データの型
export type RisingAfterImage = {
    star: Star;
    radian: number;
    speed: number;
}

// 打ち上げ用花火データの型
export type RisingStars = {
    capitalStar: Star,
    afterImageStars: RisingAfterImage[],
    goalPositions: Point
}

// データベースに登録された花火データの型
export type FireworksData = {
    [boothId: string]: FireworkData;
}

// データベースとやりとりするための花火データのの型
export type FireworkData = {
    createdAt?: number; // データが登録された日時
    fireworkType: number; // 花火のセットアップの種類(0の場合はオリジナルデザインを使用)
    fireworkDesign?: Blob; // ユーザーが作成した花火のオリジナルデザイン
    sparksType: number; // 火花のセットアップの種類
}

// 応募データの型
export type Profile = {
    userId: string, // ユーザーID
    userName: string; // ユーザー名
    email: string; // メールアドレス
    telephone?: string; // 電話番号
    age?: number; // 年齢
    schoolName?: string; // 学校名
    schoolGrade?: number; // 学年
}

// 応募受付データの型
export type Registration = {
    receipt: string; // 受付番号
    userName: string; // ユーザー名
}
