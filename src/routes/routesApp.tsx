import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"; // React Router 本体をインポート
import App from "./../App"; // ルーティングページをインポート

// ルーティングテーブルを定義
const routesParam = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}/> 
    )
);

export default routesParam;
