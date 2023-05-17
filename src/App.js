import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ROUTER_ABI from "./json/UniswapV2Router.json";



const rpcUrl = "https://public-node-api.klaytnapi.com/v1/baobab"
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const routerAddress = "0x17aFA78446A2107bC8bB330f43cB3A689B17Bf24";

const routerContract = new ethers.Contract(
    routerAddress, ROUTER_ABI, provider
);

const addressMap  ={
    token0 : "0x83881053E720f7B0c84321eDa81BCF7Ef4573C57",
    token1 : "0x9f01f05FF247ecaa76B49309d257292a12AfFeF8",
    token2 : "0xe6FbE29CdE8cC3e8881BEb79749698bF48dfa0a2"
};



function App() {
  const [tokenA, setTokenA] = useState("token0");
  const [tokenB, setTokenB] = useState("token1");
  const addressA = addressMap[tokenA];
  const addressB = addressMap[tokenB];
  const [tokenA_Amount, setTokenA_Amount] = useState("1");
  const [tokenB_Amount, setTokenB_Amount] = useState("1");


  const handleTokenAInputChange = (event) => {
    const value = event.target.value;
    setTokenA(value);
  };

  // useEffect(() => {
  //   console.log(tokenA_address);
  // }, [tokenA]);

  const handleTokenBInputChange = (event) => {
    const value = event.target.value;
    setTokenB(value);
  };

  const handleTokenAAmountInputChange = (event) => {
    const value = event.target.value;
    setTokenA_Amount(value);
  };

  const handleTokenBAmountInputChange = (event) => {
    const value = event.target.value;
    setTokenB_Amount(value);
  };

  const handleTokenAInputClicked = async() => {
    if(tokenA === tokenB)
    {
      setTokenB_Amount(tokenA_Amount);
    }
    else{
      const amountIn = ethers.utils.parseEther(tokenA_Amount);
      const reserves = await routerContract.getReserves(addressA, addressB);
      const tokenAReserve = reserves[0];
      const tokenBReserve = reserves[1];
      const kValue = tokenAReserve.mul(tokenBReserve);
      const differedtokenAReserve = tokenAReserve.add(amountIn);
      const differedtokenBReserve = kValue.div(differedtokenAReserve);
      const amountOut = ethers.utils.formatEther(tokenBReserve.sub(differedtokenBReserve));
      setTokenB_Amount(amountOut);
      //amountOut값이 음수가 나오는 경우 handle 필요
    }
    // else{
    //   const amountIn = ethers.utils.parseEther(tokenA_Amount);
    //   let amountsOut = await routerContract.getAmountsOut(
    //     amountIn, [addressA, addressB]
    //   );
    //   const amountOut = ethers.utils.formatEther(amountsOut[amountsOut.length - 1]);
    //   setTokenB_Amount(amountOut);
    // }
  }

  const handleTokenBInputClicked = async() => {
    if(tokenA === tokenB)
    {
      setTokenA_Amount(tokenB_Amount);
    }
    else{
      const amountOut = ethers.utils.parseEther(tokenB_Amount);
      const reserves = await routerContract.getReserves(addressA, addressB);
      const tokenAReserve = reserves[0];
      const tokenBReserve = reserves[1];
      const kValue = tokenAReserve.mul(tokenBReserve);
      const differedtokenBReserve = tokenBReserve.sub(amountOut);
      const differedtokenAReserve = kValue.div(differedtokenBReserve);
      const amountIn = ethers.utils.formatEther(differedtokenAReserve.sub(tokenAReserve));
      setTokenA_Amount(amountIn);
      //amountIn값이 음수가 나오는 경우 handle 필요
    }
    // else{
    //   const amountOut = ethers.utils.parseEther(tokenB_Amount);
    //   console.log(amountOut);
    //   const amountsIn = await routerContract.getAmountsIn(
    //     amountOut, [addressA, addressB]
    //   );
    //   console.log(amountsIn);
    //   const amountIn = ethers.utils.formatEther(amountsIn[0]);
    //   setTokenA_Amount(amountIn);
    // }
  }



  return (
    <div className="App">
      <form>
        <select name="tokenA" id="tokenA" onChange={ handleTokenAInputChange }>
          <option value="token0">token0</option>
          <option value="token1">token1</option>
          <option value="token2">token2</option>
        </select>

        <input type="text" name="tokenA_Amount" id="tokenA_Amount" value={tokenA_Amount} onChange={ handleTokenAAmountInputChange } />
        <input type="button" onClick={ handleTokenAInputClicked} value="convert"/>
      </form>
    

      <form>
        <select name="tokenB" id="tokenB" onChange={ handleTokenBInputChange } defaultValue="token1">
          <option value="token0">token0</option>
          <option value="token1" >token1</option>
          <option value="token2">token2</option>
        </select>
        <input type="text" name="tokenB_Amount" id="tokenB_Amount" value={tokenB_Amount} onChange={ handleTokenBAmountInputChange }/>
        <input type="button" onClick={ handleTokenBInputClicked} value="convert"/>
      </form>
    </div>
  );
}

export default App;
