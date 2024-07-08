// 文字列配列からdiv要素を作る関数
export function createDivElements(texts: string[], func?: () => void){
    return (
        <div onClick={func}>
            {texts.map((text, index) => (
                <div key={index}>{text}</div>
            ))}
        </div>
    );
}
