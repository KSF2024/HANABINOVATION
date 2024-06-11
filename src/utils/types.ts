// 位置データの型
export type Point = {
    x: number;
    y: number;
};

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

// 打ち上げ用花火データの型
export type RisingStars = {
    capitalStar: Star,
    afterImageStars: Star[],
    goalPositions: Point
}
