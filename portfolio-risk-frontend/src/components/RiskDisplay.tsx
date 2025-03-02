import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from "react-redux";
import { RiskStats } from '../interfaces/riskStats';

export default function RiskDisplay() {
    const riskData : RiskStats = useSelector((state : any) => (state.riskStats))
    return (
        <Box sx={{marginTop : 5}}>
            <Typography variant="h5">
                RISK MEASURES
            </Typography>
            <p>{JSON.stringify(riskData)}</p>
        </Box>
    )
}