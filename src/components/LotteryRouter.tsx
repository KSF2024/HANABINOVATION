import { useContext, useState } from "react";
import LotteryConfirmationPage from "../pages/LotteryConfirmationPage";
import LotteryPage from "../pages/LotteryPage";
import LotteryEntryGuidePage from "../pages/LotteryEntryGuidePage";
import { DataContext } from "../providers/DataProvider";

export default function LotteryRouter(){
    const {
        isApplied,
        canApply
    } = useContext(DataContext);

    // 応募修正中かどうか
    const [ isRevising, setIsRevising ] = useState(false);

    return (isApplied && !isRevising) ? (
            <LotteryConfirmationPage setIsRevising={setIsRevising}/>
        ) : ((canApply) ? (
            <LotteryPage isRevising={isRevising} setIsRevising={setIsRevising}/>
        ) : (
            <LotteryEntryGuidePage/>
        )
    )
};
