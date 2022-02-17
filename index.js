import { ethers } from "ethers";
import { namehash, isAddress} from "./utils/utils";
import { toChecksumAddress } from "ethereum-checksum-address"

const resolverABI = require("./contracts/PublicResolver.json")
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
const provider = new ethers.providers.JsonRpcProvider("https://eth-rpc-api.thetatoken.org/rpc");
const resolverContract = new ethers.Contract("0x9f0a9D6788FA98E50Ed1cA062abd1F69BC6C3A12", resolverABI, provider)


//Get reverse name of address. Returns null if user has not set it.
export const getDomainName = async(address) => {
    try {
        if (isAddress(address)) {
            const checksummedAddress = toChecksumAddress(address)
            const domain = await getReverseName(checksummedAddress)
            if (domain) {
                const addressRecord = await getAddressRecord(domain)
                if (addressRecord && addressRecord === checksummedAddress) {
                    return domain
                }
            }    
        }
        return null
    } catch (e) {
        console.log(`Error in getDomainName`, e)
        return null
    }
}


//Returns record address of domain if it matches the reversename
export const getAddress = async(domain) => {
    try {
        const formattedDomain = domain.toLowerCase().replace('.theta', '')
        const addressRecord = await getAddressRecord(formattedDomain)
        if (addressRecord && addressRecord !== EMPTY_ADDRESS) {
            const reverseName = await getReverseName(addressRecord)
            if (reverseName && reverseName === formattedDomain) {
                return addressRecord
            }
        }
        return null    
    } catch (e) {
        console.log(`Error getAddress`, e)
        return null
    }
}

const getAddressRecord = async(domain) => {
    try {
        const label = namehash(domain + '.theta')
        return await resolverContract['addr(bytes32)'](label)   
    } catch (e) {
        console.log(`Error getAddressRecord for resolverContract`, e)
        return null
    }
}

const getReverseName = async(address) => {
    try {
        const reverseNode = `${address.slice(2)}.addr.reverse`
        const reverseNamehash = namehash(reverseNode)
        return await resolverContract.name(reverseNamehash)
    } catch (e) {
        console.log(`Error getReverseName for resolverContract`, e)
        return null
    }
}