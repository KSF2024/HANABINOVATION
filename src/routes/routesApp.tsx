// React Router 本体をインポート
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
// ルーティングページをインポート
import App from "./../App"

// ルーティングテーブルを定義
const routesParam = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}/> 
    )
);

export default routesParam
