import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CommessaList from "./components/CommessaList";
import { SurveyApp } from "./survey/SurveyApp";
import TecniciSummary from "./components/TecniciSummary";
import EditorPage from "./survey/EditorPage"; 

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/commesse" element={<CommessaList />} />
        <Route path="/survey" element={<SurveyApp />} />
        <Route path="/tecnici" element={<TecniciSummary />} />
        <Route path="/survey/editor" element={<EditorPage />} /> 
      </Routes>
    </Layout>
  );
}

export default App;
