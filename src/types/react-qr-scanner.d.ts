declare module 'react-qr-scanner' {
    import { Component } from 'react';

    export interface QRScannerProps {
        delay?: number | false;
        onError?: (error: any) => void;
        onScan?: (data: { text: string } | null) => void;
        style?: React.CSSProperties;
        className?: string;
        facingMode?: 'user' | 'environment';
        legacyMode?: boolean;
        maxImageSize?: number;
        resolution?: number;
        showViewFinder?: boolean;
        constraints?: MediaTrackConstraints;
    }

    export default class QRScanner extends Component<QRScannerProps> {}
}
