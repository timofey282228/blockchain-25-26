import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CROWDFUNDING_TARGET = 100n
const CROWDFUNDING_TIME_SEC = 60 * 60


export default buildModule("Crowdfunding", (m) => {
  const crowdfunding = m.contract("Crowdfunding",
    [CROWDFUNDING_TARGET, CROWDFUNDING_TIME_SEC]
  );

  return { crowdfunding: crowdfunding };
});
