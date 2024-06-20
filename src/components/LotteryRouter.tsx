import { useState } from "react";
import LotteryConfirmationPage from "../pages/LotteryConfirmationPage";
import LotteryPage from "../pages/LotteryPage";
import LotteryEntryGuidePage from "../pages/LotteryEntryGuidePage";

export default function LotteryRouter(){
    const [ isApplied, setisApplied ] = useState(false);
    const [ canApply, setcanApply ] = useState(true);

    return (isApplied) ? (
        <LotteryConfirmationPage/>
      ) : ((canApply) ? (
        <LotteryPage/>
      ) : (
        <LotteryEntryGuidePage/>
      )
    )
};