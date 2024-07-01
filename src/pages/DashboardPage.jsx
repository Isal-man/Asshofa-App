import { useState } from "react";
import { MiniDrawer } from "../components";
import { BarChart, PieChart, LineChart } from "@mui/x-charts";
import { useEffect } from "react";
import api from "../services/AxiosInterceptor";
import { APP_BACKEND } from "../config/constant";
import { Paper } from "@mui/material";

export const DashboardPage = () => {
  const [totalSantri, setTotalSantri] = useState("");
  const [dataSantri, setDataSantri] = useState([]);
  const [dataRataRata, setDataRataRata] = useState([]);
  const [dataBulan, setDataBulan] = useState([]);

  useEffect(() => {
    loadDashboardJumlahSantri();
    loadDashboardRataRata();
		loadDashboardBulan()
  }, []);

  const loadDashboardJumlahSantri = async () => {
    const request = await api.get(
      APP_BACKEND + `/dashboard/dashboard-jumlah-santri`
    );
    const response = await request?.data;
    const total = await response?.data?.totalSantri;
    const data = await response?.data?.data;
    setTotalSantri(total);
    setDataSantri(data);
  };

  const loadDashboardRataRata = async () => {
    const request = await api.get(
      APP_BACKEND + `/dashboard/dashboard-rata-rata-nilai`
    );
    const response = await request?.data;
    const data = await response?.data;
    setDataRataRata(data);
  };

	const loadDashboardBulan = async () => {
    const request = await api.get(
      APP_BACKEND + `/dashboard/dashboard-bulan-santri`
    );
    const response = await request?.data;
    const data = await response?.data;
    setDataBulan(data);
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
      <MiniDrawer />
      <div className="flex flex-col mt-14 mr-4 h-5/6 w-full p-4 bg-gray-50 rounded-md">
        <p className="font-bold text-3xl">Dashboard</p>
        <div className="flex flex-col justify-around">
          <div className="flex justify-around">
            <Paper elevation={3} className="flex p-2 w-2/5">
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                  <h1 className="font-bold text-xl">Total Santri</h1>
                  <p>Berdasarkan Tahun Kelahiran</p>
                </div>
                <BarChart
                  width={500}
                  height={215}
                  series={[{ data: dataSantri?.map((data) => data?.total) }]}
                  xAxis={[
                    {
                      data: dataSantri?.map((data) => data?.tahunKelahiran),
                      scaleType: "band",
                    },
                  ]}
                />
              </div>
              <p>Total: {totalSantri}</p>
            </Paper>
            <Paper elevation={3} className="flex p-2 w-3/4">
              <div className="flex flex-col items-center">
                <h1 className="font-bold text-xl">Rata-Rata Nilai</h1>
                <PieChart
                  series={[
                    {
                      data: dataRataRata?.map((data) => data),
                    },
                  ]}
                  width={800}
                  height={215}
                />
              </div>
            </Paper>
          </div>
          <div className="w-full">
            <Paper elevation={3} className="flex p-2 w-full">
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                  <h1 className="font-bold text-xl">Total Santri</h1>
                  <p>Berdasarkan Bulan Kelahiran</p>
                </div>
                <LineChart
                  xAxis={[{ data: dataBulan?.map((data) => data?.bulanKelahiran), scaleType: 'band' }]}
                  series={[
                    {
                      data: dataBulan?.map((data) => data?.total),
                    },
                  ]}
                  width={1400}
                  height={215}
                />
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};
