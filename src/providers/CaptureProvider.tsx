import { ReactNode, createContext, useRef, useContext, useEffect } from 'react';
import { saveAs } from "file-saver";
import { CameraContext } from './CameraProvider';
import { FireworksContext } from './FireworkProvider';


/* 型定義 */
// contextに渡すデータの型
type CaptureContext = {
    mergeCanvas(): HTMLCanvasElement | null;
    convertCanvasToBase64(canvasElement: HTMLCanvasElement): string;
    saveImage: (dataURL: string) => void;
};


/* Provider */
const initialData: CaptureContext = {
    mergeCanvas: () => null,
    convertCanvasToBase64: () => "",
    saveImage: () => {}
};

export const CaptureContext = createContext<CaptureContext>(initialData);

// 写真撮影(リング+カメラ)のためのプロバイダー
export function CaptureProvider({children}: {children: ReactNode}){
    /* useState, useContext等 */
    const { canvasRef } = useContext(FireworksContext);
    const { videoRef } = useContext(CameraContext);


    /* useEffect等 */


    /* 関数定義 */
    // カメラと花火のcanvas要素を合成したcanvas要素を作成する関数
    function mergeCanvas(): HTMLCanvasElement | null{
        // カメラと花火のcanvas要素を、それぞれ取得する
        const fireworkCanvas: HTMLCanvasElement | null = canvasRef.current;
        const cameraCanvas: HTMLCanvasElement | null = getVideoCanvas();
        if(!fireworkCanvas) return null;
        if(!cameraCanvas) return null;

        // 2つのcanvas要素を合成したものを貼り付けるためのcanvas要素を作成する
        const canvasElement: HTMLCanvasElement = document.createElement("canvas");
        const width: number = cameraCanvas.width;
        const height: number = cameraCanvas.height;
        canvasElement.width = width;
        canvasElement.height = height;

        // 作成したcanvasに、2つのcanvas要素を貼り付ける
        const canvasCtx: CanvasRenderingContext2D | null = canvasElement.getContext("2d");
        if(!canvasCtx) return null;
        canvasCtx.drawImage(cameraCanvas, 0, 0, width, height); // カメラを貼り付ける
        canvasCtx.drawImage(fireworkCanvas, 0, 0, width, height); // リングを貼り付ける

        return canvasElement;
    }

    // canvasをbase64として出力する関数
    function convertCanvasToBase64(canvasElement: HTMLCanvasElement){
        const dataURL: string = canvasElement.toDataURL('image/png');
        return dataURL;
    }

    // カメラのvideo要素からcanvas要素を取得する関数
    function getVideoCanvas(): HTMLCanvasElement | null{
        // video要素を取得する
        const videoElement: HTMLVideoElement | null = videoRef.current;
        if(!videoElement) return null;

        // video要素とwindowの横幅, 縦幅を取得する
        const videoRect: DOMRect = videoElement.getBoundingClientRect();
        const videoWidth: number = videoRect.width; // videoの横幅を取得
        const videoHeight: number = videoRect.height; // videoの縦幅を取得

        const windowWidth: number = window.innerWidth; // windowの横幅を取得
        const windowHeight: number = window.innerHeight; // windowの縦幅を取得

        const videoAspectRatio: number = videoWidth / videoHeight; // videoのアスペクト比を取得
        const windowAspectRatio: number = windowWidth / windowHeight; // windowのアスペクト比を取得

        // video要素の描画を貼り付けるためのcanvas要素を作成する
        const canvasElement: HTMLCanvasElement = document.createElement("canvas");

        // ウィンドウのサイズにcanvasを合わせる
        const canvasWidth: number = windowWidth;
        const canvasHeight: number = windowHeight;
        canvasElement.width = canvasWidth;
        canvasElement.height = canvasHeight;

        // 作成したcanvas要素にvideo要素の描画を貼り付けるためのctxを取得する
        const canvasCtx: CanvasRenderingContext2D | null = canvasElement.getContext('2d');
        if(!canvasCtx) return null;

        // アスペクト比や、カメラの位置を調整する
        let width: number = 10;
        let height: number = 10;
        let top: number = 0;
        let left: number = 0;
        if(windowAspectRatio > videoAspectRatio) {
            // windowのアスペクト比がvideoよりも横長の場合
            width = windowWidth;
            height = videoHeight;
        }else{
            // windowのアスペクト比がvideoよりも縦長の場合
            width = videoWidth;
            height = windowHeight;
            left = - Math.abs(windowWidth - videoWidth) / 2;
        }

        // 作成したcanvas要素にvideo要素の描画を貼り付ける
        canvasCtx.drawImage(videoElement, left, top, width, height);
        return canvasElement;
    }

    // base64形式の画像を画像ファイルとしてダウンロードする関数
    function saveImage(dataURL: string): void{
        // DataURLからBlobを作成
        const blob: Blob = dataURLToBlob(dataURL);

        // 'file-saver'ライブラリを使ってダウンロード
        saveAs(blob, "screenshot.png");
    };

    // base64形式の画像からBlobオブジェクトを作成する関数
    function dataURLToBlob(dataURL: string): Blob{
        const byteString = window.atob(dataURL.split(",")[1]);
        const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
        }
        return new Blob([uint8Array], { type: mimeString });
    };


    return (
        <CaptureContext.Provider
            value={{
                mergeCanvas,
                convertCanvasToBase64,
                saveImage
            }}
        >
            {children}
        </CaptureContext.Provider>
    );
}
