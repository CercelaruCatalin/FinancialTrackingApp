import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, Typography } from '@mui/material';
import { Chart } from './apexCharts';

interface PieChartProps {
  sx: React.CSSProperties; 
}



export const PieChart: React.FC<PieChartProps> = ({ sx }) => {
  const [series, setSeries] = useState<number[]>([]); 
  const [labels, setLabels] = useState<string[]>([]); 
  const [loading, setLoading] = useState(true);

  const [user_id, setId] = useState<number | null>(null);

  const useRequireAuth = () => {
    useEffect(() => {
      const id = Number(localStorage.getItem("id"));

      if (!id) {
        window.location.href = "/login";
      } else {
        setId(id);
      }
    }, []);

    return null;
  };

  useRequireAuth();


  useEffect(() => {
    const fetchData = async (user_id: number) => {
      try {
        const response = await fetch('/components-piechart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user_id
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
  
        const { success, data } = await response.json();
        //console.log(data);
        if (success) {
          const { labels, series } = formatChartData(data);
          setLabels(labels);
          setSeries(series);
          //console.log('labels: ', labels, 'series: ', series)
        } else {
          throw new Error('Failed to fetch chart data');
        }
        setLoading(false);
      } catch (error) {
        console.error('An error occurred:', error);
        setLoading(false);
      }
    };
    if(user_id){
      fetchData(user_id);
    }

  }, [user_id]);
  

  const formatChartData = (data: { [category: string]: number }) => {
    const labels = Object.keys(data);
    const series = Object.values(data).map((amount) => Number(amount));
    //console.log(Object.keys(data), Object.values(data));
    return { labels, series };
  };

  const options = {
    chart: {
      id: 'basic-pie-chart',
    },
    legend: {
      show: true,
    },
    labels: labels, 
    tooltip:{
      y:{
        formatter:(val: number)=>{
          return `${val} Lei`
        }
      }
    }
  };

  return (
    <Card sx={sx} elevation={5}>
      <CardContent>
        <Chart options={options} series={series} type="pie" height={300} width="100%" />
        <Typography variant="h6" align="center" component="div">
          Expense Category / Money
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PieChart;