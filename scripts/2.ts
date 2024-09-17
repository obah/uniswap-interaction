import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const USDT = "0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f";

  const TOKEN_HOLDER = "0x28C6c06298d514Db089934071355E5743bf21d60";

  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonateSigner = await ethers.getSigner(TOKEN_HOLDER);

  const designerAmountA = ethers.parseUnits("1000", 18);
  const minAmountA = ethers.parseUnits("10", 18);

  const amountEthMin = ethers.parseEther("5");

  const ETHDesired = ethers.parseEther("6");

  const deadLine = Math.floor(Date.now() / 1000) + 60 * 60;

  const USDT_Contract = await ethers.getContractAt(
    "IERC20",
    USDT,
    impersonateSigner
  );

  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router01",
    ROUTER_ADDRESS,
    impersonateSigner
  );

  await USDT_Contract.approve(ROUTER, designerAmountA);

  const usdtBal = await USDT_Contract.balanceOf(impersonateSigner.address);
  const ethBal = await ethers.provider.getBalance(impersonateSigner.address);

  console.log("--- ADD LIQUIDITY ETH ---");

  console.log("USDT balance before ", usdtBal);

  console.log(
    "======================BEFORE ADDING LIQUIDITY======================="
  );
  console.log("USDT IN WALLET:", usdtBal);

  await ROUTER.addLiquidityETH(
    USDT,
    designerAmountA,
    minAmountA,
    amountEthMin,
    TOKEN_HOLDER,
    deadLine,
    { value: ETHDesired }
  );

  console.log("========================================");

  const usdtBalAfter = await USDT_Contract.balanceOf(impersonateSigner.address);
  const ethBalAfter = await ethers.provider.getBalance(
    impersonateSigner.address
  );

  console.log("USDT balance after ", usdtBalAfter);
  console.log("ETH balance after ", ethBalAfter);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
