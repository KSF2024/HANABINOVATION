import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./style/index.css";
import { Providers } from "./providers/Providers.tsx";
import { getFireworksByUserId } from "./utils/apiClient.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Providers>
            <App/>
        </Providers>
    </React.StrictMode>
);

(() => {
    const userId: string = "duiywabfaewfawda";
    getFireworksByUserId(userId).then(res => {
        console.log(res)
    });
})();
