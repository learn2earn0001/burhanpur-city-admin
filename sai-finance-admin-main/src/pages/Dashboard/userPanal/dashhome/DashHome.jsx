import React, { useEffect, useState } from "react";

import CardDataStats from "../../../../componant/CardDataStats/CardDataStats";
import ChartOne from "../../../../componant/Charts/ChartOne";
import ChartTwo from "../../../../componant/Charts/ChartTwo";
import ChartThree from "../../../../componant/Charts/ChartThree";
import axios from "../../../../axios";
const DashHome = () => {
  const [data, setData] = useState([]);
  const [weekdata, setWeekData] = useState([]);
  const [weekDays, setweekDays] = useState([]);
  const [weekAmtData, setweekAmtData] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [monthsData, setMonthData] = useState([]);
  const [monthlyAmtData, setMonthlyAmtData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalLoanAmt, setTotalLoanAmt] = useState(0);
  const [dailyCollection, setDailyCollection] = useState(0);
  const [totalCollection, setTotalCollection] = useState(0);

  // DailyCollections
  useEffect(() => {
    async function fetchData() {
      axios.get(`/admins/totalCollectionsToday`).then((response) => {
        // console.log(response?.data?.result);
        if (response?.data) {

          setDailyCollection(response?.data?.result?.totalAmount);
        }

        // const sum = response.data.result.reduce((acc, item) => {
        //   return acc + (item.amount || 0);
        // }, 0);

        // setTotalAmount(sum);
      });
    }
    fetchData();
  }, []);

  // total outgoing
  useEffect(() => {
    async function fetchData() {
      axios.get("users/").then((response) => {

        if (response?.data) {
          setUserData(response?.data?.result);

        }

        const sum = response.data.result.reduce((acc, item) => {
          return acc + (item.active_loan_id?.total_amount || 0);
        }, 0);

        setTotalLoanAmt(sum);
      });
    }
    fetchData();
  }, []);


  // total collection
  useEffect(() => {
    async function fetchData() {
      axios.get("/admins/totalCollections").then((response) => {
        // console.log(response?.data);
        if (response?.data) {
          setTotalCollection(response?.data?.result?.totalAmount);

        }

      
      });
    }
    fetchData();
  }, []);



// Monthely Collections
  useEffect(() => {
    async function fetchData() {
      axios.get("/admins/totalCollectionsMonthly").then((response) => {
        // console.log(response?.data);
        if (response?.data) {
          // setTotalCollection(response?.data?.result?.totalAmount);

        }

      });
    }
    fetchData();
  }, []);

// Monthely Collections Array Formate
  useEffect(() => {
    async function fetchData() {
      axios.get("/admins/totalCollectionsMonthlyStats").then((response) => {
 
        if (response?.data) {

          setData(response?.data?.result)
let res=response?.data?.result
          let months=res.map((e)=>{
            return e.month
      
          })
          let monthsAmt=res.map((e)=>{
            return e.totalAmount
      
          })
      
      
          setMonthData(months)
          setMonthlyAmtData(monthsAmt)
        }

      });
    }
    fetchData();
  }, []);


// Weekly Collections Array Formate
  useEffect(() => {
    async function fetchData() {
      axios.get("/admins/totalCollectionsWeeklyStats").then((response) => {
        console.log(response?.data);
        if (response?.data) {
          // setMonthData(response?.data?.result?.month);
          // setMonthlyAmtData(response?.data?.result?.totalAmount);
          setWeekData(response?.data?.result?.dailyStats)
          let res=response?.data?.result?.dailyStats
          let weeks=res.map((e)=>{
            return e.day
      
          })
          let weeksAmt=res.map((e)=>{
            return e.totalAmount
      
          })
          setweekDays(weeks)
          setweekAmtData(weeksAmt)
        }

      });
    }
    fetchData();
  }, []);




// Monthely Collections Array Formate
  useEffect(() => {
    let months=data.map((e)=>{
      return e.month

    })
    let monthsAmt=data.map((e)=>{
      return e.totalAmount

    })


    setMonthData(months)
    setMonthlyAmtData(monthsAmt)
 
  }, [data]);



  return (
    <div
      className="lg:py-12 lg:h-full h-screen bg-bgBlue"
      style={{
        // backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-4">
        <CardDataStats
          title="Daily Collection"
          total={`₹ ${dailyCollection}`}
          rate="+5.2%"
          levelUp
        >
          📈
        </CardDataStats>
        <CardDataStats
          title="Total Loan Customer"
          total={userdata.length}
          rate="-2.3%"
          levelDown
        >
          👥
        </CardDataStats>
        <CardDataStats
          title="Total Outgoing"
          total={`₹ ${totalLoanAmt}`}
          rate="+1.8%"
          levelUp
        >
          📦
        </CardDataStats>
        <CardDataStats
          title="Total Collections"
          total={`₹ ${totalCollection}`}
          // rate="+1.8%"
          // levelUp
        >
          📦
        </CardDataStats>
      </div>

      <div className=" grid grid-cols-12 gap-4  md:gap-6  2xl:gap-7.5 p-4">
        <ChartOne monthsData={monthsData} monthlyAmtData={monthlyAmtData}/>
        <ChartTwo weekDays={weekDays}  weekAmtData={weekAmtData}/>
        <ChartThree />
        {/* <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard /> */}
      </div>
    </div>
  );
};

export default DashHome;
