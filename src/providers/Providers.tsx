import { CameraProvider } from "./CameraProvider";
import { CaptureProvider } from "./CaptureProvider";
import { DataProvider } from "./DataProvider";
import { FireworksProvider } from "./FireworkProvider";
import { ModalProvider } from "./ModalProvider";

export function Providers({ children }: {children: React.ReactNode}){
    return (
        <ModalProvider>
            <DataProvider>
                <FireworksProvider>
                    <CameraProvider>
                        <CaptureProvider>
                            {children}
                        </CaptureProvider>
                    </CameraProvider>
                </FireworksProvider>
            </DataProvider>
        </ModalProvider>
    )
}
