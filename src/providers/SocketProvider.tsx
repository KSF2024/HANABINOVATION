import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { WS_ENDPOINT } from '../utils/apiClient';
import { MultiFireworksContext } from './MultiFireworksProvider';

/* 型定義 */
// contextに渡すデータの型
type Context = {
    socketRef: React.MutableRefObject<WebSocket | null>;
};


/* Provider */
const initialData: Context = {
    socketRef: {} as React.MutableRefObject<WebSocket | null>
};

export const SocketContext = createContext<Context>(initialData);

// websocketを管理するプロバイダー
export function SocketProvider({children}: {children: ReactNode}){
    /* state, context */
    const socketRef = useRef<WebSocket | null>(null);
    const {
        pageMode,
        animateFirework
    } = useContext(MultiFireworksContext);

    /* useEffect */
    // WebSocket関連の処理は副作用なので、useEffect内で実装
    useEffect(() => {
        // WebSocketオブジェクトを生成しサーバとの接続を開始
        let websocket: WebSocket = new WebSocket(WS_ENDPOINT);
        console.log("websocket:", websocket);
        socketRef.current = websocket;

        // メッセージ受信時のイベントハンドラ関数
        // そのままだとreactで管理している状態を取得できないので、useState + useEffectを経由させる
        function onMessage(event: MessageEvent<any>){
            setWsEvent(event);
        }

        // websocket接続切断時のイベントハンドラ関数
        function onClose(){
            console.log("websocket接続がタイムアウトしました");
            // showErrorToast("E008"); //「サーバーとの接続が切断されました。」

            // websocket切断時、websocketに再接続する
            socketRef.current = new WebSocket(WS_ENDPOINT);
            socketRef.current.addEventListener("message", onMessage);
            socketRef.current.addEventListener("close", onClose);
            console.log("websocketに再び接続しました");
        }

        // websocketインスタンスにイベントハンドラを登録する
        websocket.addEventListener("message", onMessage);
        websocket.addEventListener("close", onClose);

        // useEffectのクリーンアップの中で、WebSocketのクローズ処理を実行
        return () => {
            websocket.close();
            websocket.removeEventListener('message', onMessage);
            console.log("websocket接続が切れました");
        }
    }, [])

    // websocketのeventを監視する
    // addEventListenerを設定したタイミングの状態しか取得できないようなので、useEffect経由で状態を無理矢理取得する
    const [wsEvent, setWsEvent] = useState<MessageEvent<any> | null>(null);
    useEffect(() => {
        if(wsEvent) handleWsEvent(wsEvent);
    }, [wsEvent]);


    /* function */
    // メッセージ受信時のイベントハンドラ関数
    function handleWsEvent(event: MessageEvent<any>){
        console.log("wsOnMessage:", {event});

        // 受信したメッセージデータを処理する
        try{
            // 受け取ったレスポンスデータを取得する
            const response: any = JSON.parse(event.data);
            console.log("received data:", response);

            // actionに応じた処理を行う
            switch(response.action){
                case "show-firework":
                    // 撮影された花火を、花火大会画面に打ち上げる
                    showFirework(response.data);
                    break;
                case "draw-lottery":
                    // 当選者の花火を、当選者発表画面に打ち上げる
                    drawLottery(response.data);
                    break;
                case "send-fireworks":
                    // 送信された花火を、花火受信画面に打ち上げる
                    sendFireworks(response.data);
                    break;
                default:
                    break;
            }

        }catch(error){
            console.error(error);
        }
    }

    // 現在開いているのが花火大会画面なら、花火撮影機能で撮影された花火を即時画面上に打ち上げる関数
    function showFirework(data: any){
        if(pageMode !== "show-fireworks") return;
        console.log("show firework")
        const boothId: string = data.boothId;
        const fireworkType: number = data.fireworksData.fireworkType;
        const fireworkDesign: Blob | null = data.fireworksData.fireworkDesign || null;
        const sparksType: number = data.fireworksData.sparksType;
        animateFirework(boothId, fireworkType, fireworkDesign, sparksType);
    }

    // 現在開いているのが当選者発表画面なら、当選者の作成した花火を一斉打ち上げする関数
    function drawLottery(data: any){
        if(pageMode !== "announce-winners") return;
        console.log("draw lottery")
    }

    // 現在開いているのが花火受信画面なら、花火送信機能で送信された花火を一斉打ち上げする関数
    function sendFireworks(data: any){
        if(pageMode !== "simultaneously-raise") return;
        console.log("send fireworks")
    }


    return (
        <SocketContext.Provider
            value={{
                socketRef
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}