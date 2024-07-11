import Footer from "./Footer";

export default function FooterPage({ children }: {children: React.ReactNode}){
    return (
        <div
            style={{
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
                zIndex: "100"
            }}
        >
            <div
                style={{
                    flexGrow: 1,
                    maxHeight: "calc(100dvh - 4rem)",
                    margin: 0
                }}>
                    {children}
            </div>
            <Footer/>
        </div>
    )
}
