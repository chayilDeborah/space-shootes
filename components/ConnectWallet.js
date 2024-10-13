   // components/ConnectWallet.js
   import { ConnectButton } from '@rainbow-me/rainbowkit';

   const ConnectWallet = ({ onConnect }) => {
     return (
       <ConnectButton
         onConnect={(account) => {
           const address = account.address;
           onConnect(address);
         }}
       />
     );
   };

   export default ConnectWallet;