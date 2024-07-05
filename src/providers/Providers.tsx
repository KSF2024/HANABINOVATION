import { CameraProvider } from "./CameraProvider";
import { CaptureProvider } from "./CaptureProvider";
import { DataProvider } from "./DataProvider";
import { FireworksProvider } from "./FireworkProvider";
import { ModalProvider } from "./ModalProvider";
import { MultiFireworksProvider } from "./MultiFireworksProvider";

export function Providers({ children }: {children: React.ReactNode}){
    return (
        <ModalProvider>
            <DataProvider>
                <FireworksProvider>
                    <MultiFireworksProvider>
                        <CameraProvider>
                            <CaptureProvider>
                                {children}
                            </CaptureProvider>
                        </CameraProvider>
                    </MultiFireworksProvider>
                </FireworksProvider>
            </DataProvider>
        </ModalProvider>
    )
}
