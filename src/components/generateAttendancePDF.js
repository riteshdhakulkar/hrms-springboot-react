import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateAttendancePDF = (employees, todayStatus) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Attendance Report", 14, 15);

  const tableData = employees.map((emp, index) => {
    const status = todayStatus[emp.id] || "NOT MARKED";

    return [
      index + 1,
      emp.fname,
      emp.email || "-",
      status,
    ];
  });

  autoTable(doc, {
    head: [["S.No", "Name", "Email", "Status"]],
    body: tableData,
    startY: 25,
  });

  doc.save("attendance-report.pdf");
};