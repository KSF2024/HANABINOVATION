import { CameraProvider } from "./CameraProvider";
import { CaptureProvider } from "./CaptureProvider";
import { DataProvider } from "./DataProvider";
import { FireworksProvider } from "./FireworkProvider";

export function Providers({ children }: {children: React.ReactNode}){
    return (
        <DataProvider>
            <FireworksProvider>
                <CameraProvider>
                    <CaptureProvider>
                        {children}
                    </CaptureProvider>
                </CameraProvider>
            </FireworksProvider>
        </DataProvider>
    )
}
