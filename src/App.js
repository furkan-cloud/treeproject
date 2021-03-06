import { useSelector } from "react-redux";
import TreeList from "./components/CardList";
import Header from "./components/Header";

function App() {
  const state = useSelector((state) => state);

  return (
    <div className="section">
      <Header />
      <div className="section-cards">
        {state?.tree ? <TreeList /> : <h1>There is no data</h1>}
      </div>
    </div>
  );
}

export default App;
