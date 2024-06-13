import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function DesignPage(){
    const [ isDrawing, setIsDrawing ] = useState<boolean>(false); // 「自分で描く」中かどうか

    return (
        <Box sx={{ p: 2 }}>
            <Typography
                variant="h6"
                style={{ textAlign: "center" }}
            >
                好きな形の花火と火花を選んで、オリジナルの花火を作ろう！
            </Typography>
        </Box>
    )
}
