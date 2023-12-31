import { useState } from "react";
import * as XLSX from "xlsx";
// import "./App.css";

function App() {
  const [quiz1Sheet, setQuiz1Sheet] = useState(null);
  const [quiz2Sheet, setQuiz2Sheet] = useState(null);
  const [quiz3Sheet, setQuiz3Sheet] = useState(null);
  const [quiz1Data, setQuiz1Data] = useState(null);
  const [quiz2Data, setQuiz2Data] = useState(null);
  const [quiz3Data, setQuiz3Data] = useState(null);
  const [quiz1SheetName, setQuiz1SheetName] = useState("");
  const [quiz2SheetName, setQuiz2SheetName] = useState("");
  const [quiz1FileName, setQuiz1FileName] = useState("");
  const [quiz2FileName, setQuiz2FileName] = useState("");
  // const [filesNotUploaded, setFilesNotUploaded] = useState(true);

  const handleFile = (e, fileName) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileName === "quiz1") setQuiz1FileName(selectedFile.name);
      else if (fileName === "quiz2") setQuiz2FileName(selectedFile.name);
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (e) => {
        if (fileName === "quiz1") setQuiz1Sheet(e.target.result);
        if (fileName === "quiz2") setQuiz2Sheet(e.target.result);
        if (fileName === "quiz3") setQuiz3Sheet(e.target.result);
      };
    } else {
      console.log("Please select your file");
    }
  };

  const handleFileSubmit = (e, fileName) => {
    e.preventDefault();
    switch (fileName) {
      case "quiz1":
        if (quiz1Sheet !== null) {
          const workbook = XLSX.read(quiz1Sheet, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          setQuiz1SheetName(sheetName);
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          setQuiz1Data(data);
        }
        break;
      case "quiz2":
        if (quiz2Sheet !== null) {
          const workbook = XLSX.read(quiz2Sheet, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          setQuiz2SheetName(sheetName);
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          setQuiz2Data(data);
        }
        break;
      case "quiz3":
        if (quiz3Sheet !== null) {
          const workbook = XLSX.read(quiz3Sheet, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          setQuiz3Data(data);
        }
        break;
      default:
        break;
    }
  };

  const changedMarks = function (regno, fileName) {
    const quiz1Marks = quiz1Data.filter(
      (student) => student["Register No"] === regno
    )[0].Mark;
    const quiz2Marks = quiz2Data.filter(
      (student) => student["Register No"] === regno
    )[0].Mark;
    const quiz3Marks = quiz3Data.filter(
      (student) => student["Register No"] === regno
    )[0].Mark;
    let quiz1MarksUpdated = quiz1Marks;
    let quiz2MarksUpdated = quiz2Marks;
    if (quiz3Marks >= 5 && quiz3Marks <= 6) {
      quiz1MarksUpdated = Math.min(10, quiz1Marks + 1);
    } else if (quiz3Marks >= 7 && quiz3Marks <= 8) {
      quiz1MarksUpdated = Math.min(10, quiz1Marks + 2);
    } else if (quiz3Marks >= 9 && quiz3Marks <= 10) {
      quiz1MarksUpdated = Math.min(10, quiz1Marks + 3);
    } else if (quiz3Marks >= 11 && quiz3Marks <= 12) {
      quiz1MarksUpdated = Math.min(10, quiz1Marks + 5);
      quiz2MarksUpdated = Math.min(
        10,
        quiz2Marks + (5 - (quiz1MarksUpdated - quiz1Marks))
      );
    }
    if (fileName === "quiz1") return quiz1MarksUpdated;
    else if (fileName === "quiz2") return quiz2MarksUpdated;
  };
  const modifyData = function (excelData, fileName) {
    return excelData.map((student) => ({
      ...student,
      Mark: changedMarks(student["Register No"], fileName),
    }));
  };

  const exportFile = function (sheetData, fileName) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    if (fileName === "quiz1") {
      XLSX.utils.book_append_sheet(wb, ws, quiz1SheetName);
      XLSX.writeFile(
        wb,
        `${quiz1FileName.slice(0, quiz1FileName.indexOf("."))}_Updated.xlsx`
      );
    } else if (fileName === "quiz2") {
      XLSX.utils.book_append_sheet(wb, ws, quiz2SheetName);
      XLSX.writeFile(
        wb,
        `${quiz2FileName.slice(0, quiz2FileName.indexOf("."))}_Updated.xlsx`
      );
    }
  };
  const handleGenerate = function (fileName) {
    if (fileName === "quiz1")
      exportFile(modifyData(quiz1Data, "quiz1"), "quiz1");
    else if (fileName === "quiz2")
      return exportFile(modifyData(quiz2Data, "quiz2"), "quiz2");
  };
  return (
    <div className="wrapper">
      <h3>Upload & View Excel Sheets</h3>

      {/* form */}
      <form
        className="form-group custom-form"
        onSubmit={(e) => handleFileSubmit(e, "quiz1")}
      >
        <input
          type="file"
          accept=".xlsx, .xls"
          className="form-control"
          required
          onChange={(e) => handleFile(e, "quiz1")}
        />
        <button type="submit" className="btn btn-success btn-md">
          UPLOAD
        </button>
      </form>
      <form
        className="form-group custom-form"
        onSubmit={(e) => handleFileSubmit(e, "quiz2")}
      >
        <input
          type="file"
          accept=".xlsx, .xls"
          className="form-control"
          required
          onChange={(e) => handleFile(e, "quiz2")}
        />
        <button type="submit" className="btn btn-success btn-md">
          UPLOAD
        </button>
      </form>
      <form
        className="form-group custom-form"
        onSubmit={(e) => handleFileSubmit(e, "quiz3")}
      >
        <input
          type="file"
          accept=".xlsx, .xls"
          className="form-control"
          required
          onChange={(e) => handleFile(e, "quiz3")}
        />
        <button type="submit" className="btn btn-success btn-md">
          UPLOAD
        </button>
      </form>
      <button
        onClick={() => handleGenerate("quiz1")}
        disabled={!(quiz1Data && quiz2Data && quiz3Data)}
      >
        Generate Updated Quiz1 File
      </button>
      <button
        onClick={() => handleGenerate("quiz2")}
        disabled={!(quiz1Data && quiz2Data && quiz3Data)}
      >
        Generate Updated Quiz2 File
      </button>

      {/* view data */}
      <div className="viewer">
        <div>
          {quiz1Data ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(quiz1Data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {quiz1Data.map((individualExcelData, index) => (
                    <tr key={index}>
                      {Object.keys(individualExcelData).map((key) => (
                        <td key={key}>{individualExcelData[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>Quiz1 File isn&apos;t uploaded yet!</div>
          )}
        </div>
        <div>
          {quiz2Data ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(quiz2Data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {quiz2Data.map((individualExcelData, index) => (
                    <tr key={index}>
                      {Object.keys(individualExcelData).map((key) => (
                        <td key={key}>{individualExcelData[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>Quiz2 File isn&apos;t uploaded yet!</div>
          )}
        </div>
        <div>
          {quiz3Data ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(quiz3Data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {quiz3Data.map((individualExcelData, index) => (
                    <tr key={index}>
                      {Object.keys(individualExcelData).map((key) => (
                        <td key={key}>{individualExcelData[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>Quiz3 File isn&apos;t uploaded yet!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
