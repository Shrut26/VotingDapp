import "../styles/globals.css";
import Navbar from "../components/Navbar/Navbar";
import { VotingProvider } from "../context/Voters";
import TestPage from "./TestPage";

export default function App({ Component, pageProps }) {
  return (
    <VotingProvider>
      <div>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </VotingProvider>
    // <div className="App">
    //   <TestPage />
    // </div>
  );
}