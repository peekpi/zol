import { ethers } from "ethers";
import Contracts from "./address.json";
import IERC20 from "./ERC20.json";
import IZeroLock from "./ZeroLock.json";
window.ZOL = IZeroLock;

const AddressZero = ethers.constants.AddressZero;
const IERC20Template = new ethers.Contract(AddressZero, IERC20);
const IZeroLockTemplate = new ethers.Contract(AddressZero, IZeroLock);

const decimals = n => ethers.BigNumber.from(`1${'0'.repeat(n)}`);
const D18 = decimals(18);
D18;
export function contracts(provider) {
    const wprovider = new ethers.providers.Web3Provider(provider);
    const signer = wprovider.getSigner();
    return {
        ZO: IERC20Template.attach(Contracts.ZO).connect(signer),
        ZOL: IZeroLockTemplate.attach(Contracts.ZOL).connect(signer)
    }
}


