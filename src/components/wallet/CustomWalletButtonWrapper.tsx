import dynamic from "next/dynamic";

const CustomWalletButton = dynamic(() => import("./WalletButton").then(mod => mod.CustomWalletButton),
    { ssr: false}
);

export default CustomWalletButton;