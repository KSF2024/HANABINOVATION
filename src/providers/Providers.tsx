import { CameraProvider } from "./CameraProvider";
import { DataProvider } from "./DataProvider";
import { FireworksProvider } from "./FireworkProvider";

export function Providers({ children }: {children: React.ReactNode}){
    return (
        <DataProvider>
            <FireworksProvider>
                <CameraProvider>
                    {children}
                </CameraProvider>
            </FireworksProvider>
        </DataProvider>
    )
}
