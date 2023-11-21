import { useState } from "react";
import * as XLSX from "xlsx";
// import "./App.css";

function App() {
  const [excelFile, setExcelFile] = useState(null);
  // const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  // console.log(excelData);
  const handleFile = (e,fileName) => {
    // let fileTypes = [
    //   "application/vnd.ms-excel",
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   "text/csv",
    // ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      // if (selectedFile && fileTypes.includes(selectedFile.type)) {
      // setTypeError(null);
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (e) => {
        // if(fileName=="quiz1")
        setExcelFile(e.target.result);
      };
      // } else {
      //   setTypeError("Please select only excel file types");
      //   setExcelFile(null);
      // }
    } else {
      console.log("Please select your file");
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
    }
  };

  const changedMarks = function (regno) {
    const quiz1Marks = excelData.filter(
      (student) => student["Register No"] === regno
    )[0].Mark;
    console.log("quiz1marks:-");
    console.log(quiz1Marks);
  };

  const modifyData = function (excelData) {
    return excelData.map((student) => ({
      ...student,
      Mark: changedMarks(student["Register No"]),
    }));
  };
  excelData && console.log(modifyData(excelData));

  return (
    <div className="wrapper">
      <h3>Upload & View Excel Sheets</h3>

      {/* form */}
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <input
          type="file"
          accept=".xlsx, .xls"
          className="form-control"
          required
          onChange={handleFile}
        />
        <button type="submit" className="btn btn-success btn-md">
          UPLOAD
        </button>
        {/* {typeError && (
          <div className="alert alert-danger" role="alert">
            {typeError}
          </div>
        )} */}
      </form>

      {/* view data */}
      <div className="viewer">
        {excelData ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {excelData.map((individualExcelData, index) => (
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
          <div>No File is uploaded yet!</div>
        )}
      </div>
    </div>
  );
}

export default App;
