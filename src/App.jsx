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
    <div>
      <h3>Discrete Quiz File Generator</h3>

      {/* form */}
      <form
        onSubmit={(e) => handleFileSubmit(e, "quiz1")}
      >
        <label>Quiz1: </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          required
          onChange={(e) => handleFile(e, "quiz1")}
        />
        <button type="submit" >
          UPLOAD
        </button>
      </form>
      <form
        onSubmit={(e) => handleFileSubmit(e, "quiz2")}
      >
        <label>Quiz2: </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          required
          onChange={(e) => handleFile(e, "quiz2")}
        />
        <button type="submit">
          UPLOAD
        </button>
      </form>
      <form
        onSubmit={(e) => handleFileSubmit(e, "quiz3")}
      >
        <label>Quiz3: </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          required
          onChange={(e) => handleFile(e, "quiz3")}
        />
        <button type="submit">
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
      <div>
        <p>
          {quiz1Data
            ? "Quiz1 File Uploaded Successfully"
            : "Please Upload Quiz1 File"}
        </p>
        <p>
          {quiz2Data
            ? "Quiz2 File Uploaded Successfully"
            : "Please Upload Quiz2 File"}
        </p>
        <p>
          {quiz3Data
            ? "Quiz2 File Uploaded Successfully"
            : "Please Upload Quiz3 File"}
        </p>
      </div>
      <div>
        <span>View the entire source code here: </span>
        <a
          href="https://github.com/aditya-jindal/discreteQuiz/blob/master/src/App.jsx"
          target="_blank"
          rel="noreferrer"
        >
           https://github.com/aditya-jindal/discreteQuiz/blob/master/src/App.jsx
        </a>{" "}
        <p>
          (To verify the program, you can copy paste the code into chatgpt and
          ask, <span style={{fontWeight:"bold"}}>&quot;tell me the exact rules by which the marks are updated&quot;</span>){" "}
        </p>
      </div>
      <span style={{fontWeight:"bold"}}>Note: </span><span>Please make sure that marks are always numbers, and never empty. Use 0 if the student did not attend the quiz.</span>
      <div>
        <h4>How the app allots marks:-</h4>
        <ul>
          <li>
            It goes through each and every student&apos;s entry one by one
          </li>
          <li>
            For each student, we get their marks in all 3 quizzes by matching
            common Registration Number in the 3 files{" "}
          </li>
          <li>
            If Quiz3 marks are 5 or 6, Quiz1 marks are set to (quiz1+1) or (10),
            whichever one is lower. Quiz2 marks remain the same
          </li>
          <li>
            If Quiz3 marks are 7 or 8, Quiz1 marks are set to (quiz1+2) or (10),
            whichever one is lower. Quiz2 marks remain the same
          </li>
          <li>
            If Quiz3 marks are 9 or 10, Quiz1 marks are set to (quiz1+3) or
            (10), whichever one is lower. Quiz2 marks remain the same
          </li>
          <li>
            If Quiz3 marks are 11 or 12, Quiz1 marks are set to (quiz1+5) or
            (10), whichever one is lower. Then Quiz2 marks are set to
            (quiz2+(updated_quiz1_marks - original_quiz1_marks)) or (10), whichever
            one is lower
          </li>
          <li>Here is the code snippet: </li>
          <li>
            <img
              src="https://raw.githubusercontent.com/aditya-jindal/discreteQuiz/master/src/assets/marks_rules.png"
              alt="marks rules code snippet"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
