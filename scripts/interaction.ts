// import helpers from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const TOKEN_HOLDER = "0x28C6c06298d514Db089934071355E5743bf21d60";
  const UNISWAP_V2_ROUTER = "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a";
  const POOL_ADDRESS = "0x7858E59e0C01EA06Df3aF3D20aC7B0003275D4Bf";

  const USDTDesired = ethers.parseUnits("1000", 18);
  const USDTMin = ethers.parseUnits("50", 18);
  const ETHMin = ethers.parseEther("0.01");
  const ETHDesired = ethers.parseEther("2");
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; //30 Minutes in UNIX Timestamp

  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  const USDTContract = await ethers.getContractAt(
    "IERC20",
    USDT,
    impersonatedSigner
  );

  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router01",
    UNISWAP_V2_ROUTER,
    impersonatedSigner
  );

  await USDTContract.approve(ROUTER, USDTDesired);

  const USDTBalanceBeforeTransaction = await USDTContract.balanceOf(
    TOKEN_HOLDER
  );
  //   const ETHBeforeTransaction = await helpers

  console.log(
    "======================BEFORE ADDING LIQUIDITY======================="
  );
  console.log("USDT IN WALLET:", USDTBalanceBeforeTransaction);
  console.log("ETH IN WALLER");

  await USDTContract.approve(ROUTER, USDTDesired);

  const tx = await ROUTER.addLiquidityETH(
    USDT,
    USDTDesired,
    USDTMin,
    ETHMin,
    impersonatedSigner,
    deadline,
    { value: ETHDesired }
  );

  await tx.wait();

  const USDTBalanceAfterTransaction = await USDTContract.balanceOf(
    TOKEN_HOLDER
  );

  console.log(
    "======================AFTER ADDING LIQUIDITY======================="
  );
  console.log("USDT IN WALLET:", USDTBalanceAfterTransaction);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
