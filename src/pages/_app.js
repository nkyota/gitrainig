import '../styles/globals.css';
import MainLayout from '../components/layout/MainLayout';
import { GitSimulatorProvider } from '../lib/git-simulator/GitSimulator';

function MyApp({ Component, pageProps }) {
  return (
    <GitSimulatorProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </GitSimulatorProvider>
  );
}

export default MyApp;
