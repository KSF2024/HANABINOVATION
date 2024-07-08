import { CameraProvider } from "./CameraProvider";
import { CaptureProvider } from "./CaptureProvider";
import { DataProvider } from "./DataProvider";
import { FireworksProvider } from "./FireworkProvider";
import { ModalProvider } from "./ModalProvider";
import { MultiFireworksProvider } from "./MultiFireworksProvider";
import { SocketProvider } from "./SocketProvider";

export function Providers({ children }: {children: React.ReactNode}){
    return (
        <ModalProvider>
            <DataProvider>
                <FireworksProvider>
                    <MultiFireworksProvider>
                        <CameraProvider>
                            <CaptureProvider>
                                <SocketProvider>
                                    {children}
                                </SocketProvider>
                            </CaptureProvider>
                        </CameraProvider>
                    </MultiFireworksProvider>
                </FireworksProvider>
            </DataProvider>
        </ModalProvider>
    )
}
