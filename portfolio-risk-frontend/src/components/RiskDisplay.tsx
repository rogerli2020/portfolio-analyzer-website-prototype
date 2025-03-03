import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { RiskStats } from '../interfaces/riskStats';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
  } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { UseDispatch } from 'react-redux';
import { loadExampleData } from '../redux/reducers/riskStatsSlice';
import { enqueueSnackbar } from 'notistack'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };  

  
export default function RiskDisplay() {
    const dispatch = useDispatch();
    const riskData : RiskStats = useSelector((state : any) => (state.riskStats));

    console.log(riskData)

    const data = {
        labels: Object.keys(riskData.portfolio_ts),
        datasets: [
            {
              label: 'Your Portfolio',
              data: Object.values(riskData.portfolio_ts),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'S&P500',
              data: Object.values(riskData.scaled_sp500_ts),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
    }

    const returnValues = Object.values(riskData.logreturn_ts);
    const bucketSize = 0.025;
    const minVal = Math.floor(Math.min(...returnValues) / bucketSize) * bucketSize;
    const maxVal = Math.ceil(Math.max(...returnValues) / bucketSize) * bucketSize;

    const labels: string[] = [];
    const buckets: Record<string, number> = {};

    for (let i = minVal; i <= maxVal; i += bucketSize) {
        const bucketLabel = `${i.toFixed(1)} to ${(i + bucketSize).toFixed(1)}`;
        labels.push(bucketLabel);
        buckets[bucketLabel] = 0;
    }

    returnValues.forEach((value) => {
        for (let i = minVal; i <= maxVal; i += bucketSize) {
          if (value >= i && value < i + bucketSize) {
            const bucketLabel = `${i.toFixed(1)} to ${(i + bucketSize).toFixed(1)}`;
            buckets[bucketLabel]++;
            break;
          }
        }
    });

    const handleClickExampleData = () => {
        dispatch(loadExampleData());
        enqueueSnackbar("Loaded example data.");
    }

    const histogramData = {
        labels: labels,
        datasets: [
          {
            label: "Log Return Distribution",
            data: labels.map((label) => buckets[label]), // Map bucket counts
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };

    return (
        <Box sx={{marginTop : 6}}>

            <Typography variant="h5">
                PORTFOLIO RISK MEASURES             
                <Button 
                    variant='outlined'
                    onClick={handleClickExampleData}
                >
                    Load Example Data
                </Button>
            </Typography>
            <Typography variant="subtitle2">
                Example data portfolio: 1 long AMZN, 1 long MSFT, 1 long GOOGL, 4 long NVDA, short 2 GE, short 2 XOM, short 10 F, short 2 KO. Time horizon: 1825 normal days.
            </Typography>
            <Box sx={{marginBottom:2}}/>

            <Typography variant="body1">
                Portfolio Daily Volatility: {riskData.portfolio_volatility.toPrecision(4)}
            </Typography>
            <Typography variant="body1">
                Portfolio 5% Value at Risk: {(riskData.portfolio_VaR*100.0).toPrecision(4)}%
            </Typography>
            <Typography variant="body1">
                Portfolio 5% Expected Shortfall: {(riskData.portfolio_ES*100.0).toPrecision(4)}%
            </Typography>

            <Box sx={{m:1}}></Box>
            <Typography variant="body1">
                S&P500 Daily Volatility: {riskData.sp500_volatility.toPrecision(4)}
            </Typography>
            <Typography variant="body1">
                S&P500  5% Value at Risk: {(riskData.sp500_VaR*100.0).toPrecision(4)}%
            </Typography>
            <Typography variant="body1">
                S&P500  5% Expected Shortfall: {(riskData.sp500_ES*100.0).toPrecision(4)}%
            </Typography>

            <Line options={options} data={data}></Line>
            <Bar data={histogramData}></Bar>
        </Box>
    )
}