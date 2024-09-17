import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const LISK = "0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f";
  const TOKEN_HOLDER = "0x28C6c06298d514Db089934071355E5743bf21d60";
  const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const POOL_ADDRESS = "0x7858E59e0C01EA06Df3aF3D20aC7B0003275D4Bf";

  const LISKDesired = ethers.parseUnits("2000", 18);
  const LISKMin = ethers.parseUnits("50", 18);
  const ETHMin = ethers.parseEther("1");
  const ETHDesired = ethers.parseEther("2");
  const deadLine = Math.floor(Date.now() / 1000) + 60 * 10;

  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonateSigner = await ethers.getSigner(TOKEN_HOLDER);

  const LISKContract = await ethers.getContractAt(
    "IERC20",
    LISK,
    impersonateSigner
  );

  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router01",
    UNISWAP_V2_ROUTER,
    impersonateSigner
  );

  await LISKContract.approve(ROUTER, LISKDesired);

  const liskBefore = await LISKContract.balanceOf(impersonateSigner.address);

  console.log(
    "======================BEFORE ADDING LIQUIDITY======================="
  );
  console.log("LISK IN WALLET:", liskBefore);

  await ROUTER.addLiquidityETH(
    LISK,
    LISKDesired,
    LISKMin,
    ETHMin,
    TOKEN_HOLDER,
    deadLine,
    { value: ETHDesired }
  );

  const liskAfter = await LISKContract.balanceOf(impersonateSigner.address);

  console.log(
    "======================AFTER ADDING LIQUIDITY======================="
  );
  console.log("LISK IN WALLET:", liskAfter);

  const WETHValue = await ROUTER.WETH();

  console.log("=====================2ND FUNCTION=================");
  console.log("WETH After transaction: ", WETHValue);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
