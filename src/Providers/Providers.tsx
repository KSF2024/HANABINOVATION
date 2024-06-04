import { CameraProvider } from "./CameraProvider";
import { DataProvider } from "./DataProvider";

export function Providers({ children }: {children: React.ReactNode}) {
    return (
        <DataProvider>
            <CameraProvider>
                {children}
            </CameraProvider>
        </DataProvider>
    )
}