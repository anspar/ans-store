import "@anspar/anspar-theme/styles.css";
import './App.css';
import walletStyles from "./Wallet.module.css";
import { Wallet, WalletContext } from '@anspar/ans-wallet';
import { ThemeSwitch } from '@anspar/anspar-theme';
import Main from "./Main/Main";

function App() {
  return (
    <WalletContext testnets>
      <div className={`${walletStyles.nav} as-shadow-sm`}>
        <div className={walletStyles.navAlign}>
          <ThemeSwitch style={{width: "30px", display: "flex", justifyContent: "center"}}/>
          <Wallet/>
        </div>
      </div>
      <div className={walletStyles.contentMargin}>
        {/* <HosqUploadFiles allowPinning /> */}
        <Main />
      </div>
    </WalletContext>
  );
}

export default App;
