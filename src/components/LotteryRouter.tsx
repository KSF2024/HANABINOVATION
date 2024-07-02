import { useState } from "react";
import LotteryConfirmationPage from "../pages/LotteryConfirmationPage";
import LotteryPage from "../pages/LotteryPage";
import LotteryEntryGuidePage from "../pages/LotteryEntryGuidePage";

export default function LotteryRouter(){
    const [ isApplied, _setIsApplied ] = useState(false);
    const [ canApply, _setCanApply ] = useState(false);

    return (isApplied) ? (
        <LotteryConfirmationPage/>
      ) : ((canApply) ? (
        <LotteryPage/>
      ) : (
        <LotteryEntryGuidePage/>
      )
    )
};