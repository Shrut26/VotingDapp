import "../styles/globals.css";
import Navbar from "../components/Navbar/Navbar";
import { VotingProvider } from "../context/Voters";

export default function App({ Component, pageProps }) {
  return (
    <VotingProvider>
      <div>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </VotingProvider>
  );
}
