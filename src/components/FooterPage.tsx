import Footer from "./Footer";

export default function FooterPage({ children }: {children: React.ReactNode}){
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <div
                style={{
                    flexGrow: 1,
                    maxHeight: "calc(100% - 4rem)"
                }}>
                    {children}
                    <Footer/>
            </div>
        </div>
    )
}