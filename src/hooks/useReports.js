import { useState } from "react";
import { mockMonthlySummary, mockSpendingData } from "../data/mockData";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MONTH_MAP = {
  "Sep": "2025-09",
  "Oct": "2025-10",
  "Nov": "2025-11",
  "Dec": "2025-12",
  "Jan": "2026-01",
  "Feb": "2026-02",
};

function useReports() {

  const [dateFrom, setDateFrom] = useState("2025-09");
  const [dateTo, setDateTo] = useState("2026-02");
  const [exported, setExported] = useState(false);
  const [exportMsg, setExportMsg] = useState("");

  const [filteredData, setFilteredData] = useState(mockMonthlySummary);
  const [filteredChart, setFilteredChart] = useState(mockSpendingData);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateReport = () => {

    const resultTable = mockMonthlySummary.filter((row) => {
      const d = new Date(row.month);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}`;
      return key >= dateFrom && key <= dateTo;
    });

    setFilteredData(resultTable.length ? resultTable : mockMonthlySummary);

    const resultChart = mockSpendingData.filter((d) => {
      const key = MONTH_MAP[d.month];
      if (!key) return false;
      return key >= dateFrom && key <= dateTo;
    });

    setFilteredChart(resultChart.length ? resultChart : mockSpendingData);

    setHasGenerated(true);
  };

  const totalSpendNum = filteredData.reduce((sum, r) => {
    const num = parseFloat(String(r.totalSpend).replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const totalUsers = filteredData.reduce((sum, r) => sum + (r.users || 0), 0);

  const totalAlerts = filteredData.reduce((sum, r) => sum + (r.alerts || 0), 0);

  const totalSavingsNum = filteredData.reduce((sum, r) => {
    const num = parseFloat(String(r.savings).replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);


  const handleExportCSV = () => {

    const headers = [
      "Month","Active Users","Total Spend","Avg / User",
      "AI Alerts","Total Savings","Top Category"
    ];

    const rows = filteredData.map((r) => [
      r.month,r.users,r.totalSpend,r.avgSpend,r.alerts,r.savings,r.topCategory
    ]);

    const csv = [headers,...rows]
      .map((row)=>row.map((c)=>`"${String(c).replace(/"/g,'""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `SpendWise_Report_${dateFrom}_to_${dateTo}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setExportMsg("✓ CSV downloaded!");
    setExported(true);

    setTimeout(()=>setExported(false),2500);
  };


  const handleExportPDF = () => {

    const doc = new jsPDF({orientation:"landscape",unit:"pt",format:"a4"});

    doc.setFontSize(18);
    doc.setTextColor(26,43,71);
    doc.text("SpendWise AI - Monthly Report",40,40);

    doc.setFontSize(10);
    doc.setTextColor(100,116,139);
    doc.text("Analytics & Export",40,58);
    doc.text(`Period: ${dateFrom} -> ${dateTo}`,40,72);

    const kpis=[
      {label:"TOTAL SPENDING", value:"₱"+totalSpendNum.toLocaleString()},
      {label:"TOTAL USERS", value:totalUsers.toLocaleString()},
      {label:"TOTAL ALERTS", value:totalAlerts.toLocaleString()},
      {label:"TOTAL SAVINGS", value:"₱"+totalSavingsNum.toLocaleString()},
    ];

    const boxW=170,boxH=48,startX=40,startY=88,gap=12;

    kpis.forEach((k,i)=>{
      const x=startX+i*(boxW+gap);

      doc.setDrawColor(226,232,240);
      doc.setFillColor(248,250,252);
      doc.roundedRect(x,startY,boxW,boxH,4,4,"FD");

      doc.setFontSize(8);
      doc.setTextColor(148,163,184);
      doc.text(k.label,x+12,startY+16);

      doc.setFontSize(16);
      doc.setTextColor(26,43,71);
      doc.text(k.value,x+12,startY+36);
    });

    autoTable(doc,{
      startY:166,
      head:[["Month","Active Users","Total Spend","Avg / User","AI Alerts","Total Savings","Top Category"]],
      body:filteredData.map((r)=>[
        r.month,r.users.toLocaleString(),r.totalSpend,r.avgSpend,r.alerts,r.savings,r.topCategory
      ])
    });

    doc.save(`SpendWise_Report_${dateFrom}_to_${dateTo}.pdf`);

    setExportMsg("✓ PDF downloaded!");
    setExported(true);

    setTimeout(()=>setExported(false),2500);
  };

  return {
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    exported,
    exportMsg,
    filteredData,
    filteredChart,
    hasGenerated,
    generateReport,
    handleExportCSV,
    handleExportPDF,
    totalSpendNum,
    totalUsers,
    totalAlerts,
    totalSavingsNum
  };
}

export default useReports;