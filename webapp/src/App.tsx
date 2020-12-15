import React, { useState } from "react";

import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import ProgressBar from "./components/ui/ProgressBar";
import Controls from "./components/ui/Controls";
import ScrobbleTable from "./components/ScrobbleTable/ScrobbleTable";

import GridLoader from "react-spinners/GridLoader";

import "./App.css";

import fetchScrobbles from "./components/lastfm";
import { Scrobble } from "./components/lastfm";

const App: React.FC = () => {
  //const [userName, setUserName] = useState<string>("");
  const [progress, setProgress] = useState<number>(-1);
  const [scrobbles, setScrobbles] = useState<Array<Scrobble>>([]);

  return (
    <div className="App">
      <Header />
      <main>
        <div className="top-container">
          <Controls
            startProcess={(u: string) =>
              fetchScrobbles(u, setProgress, setScrobbles)
            }
          />
          {progress >= 0 && progress < 100 && (
            <ProgressBar value={Math.round(progress)} />
          )}
        </div>
        {progress >= 0 && progress < 100 ? (
          <GridLoader size={50} color={"#000"} loading={progress < 100} />
        ) : (
          <ScrobbleTable scrobbles={scrobbles} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;