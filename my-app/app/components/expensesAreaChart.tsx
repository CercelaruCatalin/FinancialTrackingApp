import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@mui/material';
import { Chart } from './apexCharts';

const options = {
  chart: {
    id: 'basic-area-chart',
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yaxis: {
    title: {
      text: 'Expenses',
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#FF0000'] 
    },
  },
  fill: {
    colors: ['#FF3333'], 
    type: 'solid',
    opacity: 0.7,
  },
  stroke: {
    show: true,
    colors: ['#008000'], // Black line color
    width: 4,
    dashArray: 0,
  },
};

export const ExpensesAreaChart = (props: { sx: any }) => {
  const [user_id, setId] = useState<number | null>(null);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([{ name: 'Expenses', data: [] }]);

  const useRequireAuth = () => {
    useEffect(() => {
      const id = Number(localStorage.getItem("id"));
      if (!id) {
        window.location.href = "/login";
      } else {
        setId(id);
      }
    }, []);
  };

  useRequireAuth();

  useEffect(() => {
    const fetchData = async (user_id: number) => {
      console.log('user_id_expense_chart: ', user_id);
      try {
        const response = await fetch('/expenses-chart-months', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user_id }),
        });

        if (!response) {
          console.error('Failed to fetch chart data');
        }


        const { success, data } = await response.json();
        console.log('data: ', data);

        if(success){
          setSeries([{ name: 'Expenses', data: data }]);
        }

      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    if (user_id) {
      fetchData(user_id);
    }
  }, [user_id]);

  return (
    <Card sx={props.sx} elevation={5}>
      <CardContent>
        <Chart options={options} series={series} type="area" height={350} width="100%" />
      </CardContent>
    </Card>
  );
};

export default ExpensesAreaChart;
