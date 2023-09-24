import { ethers } from "ethers"
import { namehash, isAddress} from "./utils/utils"
import { toChecksumAddress } from "ethereum-checksum-address"

const ethNamehash = require('eth-ens-namehash')
const resolverABI = require("./contracts/PublicResolver.json")
const reverseRecordsABI = require("./contracts/ReverseRecords.json")
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'
const defaultRpc = 'https://eth-rpc-api.thetatoken.org/rpc'


const getResolvercontract = (provider) => {
    return new ethers.Contract("0x428101CB7a0D22587a6f098A518c36Af2a1b2E31", resolverABI, provider)
}

const getReverseRecordsContract = (provider) => {
    return new ethers.Contract("0x5aA729cB43FDcC26CA947Dfb1Cbe11cc8d245B9C", reverseRecordsABI, provider)
}

const getAddressRecord = async(domain, provider) => {
    try {
        const label = namehash(domain + '.theta')
        const resolverContract = getResolvercontract(provider)
        return await resolverContract['addr(bytes32)'](label)   
    } catch (e) {
        console.log(`Error getAddressRecord for resolverContract`, e)
        return null
    }
}

const getReverseName = async(address, provider) => {
    try {
        const reverseNode = `${address.slice(2)}.addr.reverse`
        const reverseNamehash = namehash(reverseNode)
        const resolverContract = getResolvercontract(provider)
        return await resolverContract.name(reverseNamehash)
    } catch (e) {
        console.log(`Error getReverseName for resolverContract`, e)
        return null
    }
}

const getReverseNames = async(addresses, extension, provider) => {
    try {
        if (!extension) extension = 'theta'
        const reverseRecordsContract = getReverseRecordsContract(provider)
        return await reverseRecordsContract.getNames(addresses, extension)
    } catch (e) {
        console.log(`Error getReverseNames for reverseRecordsContract`, e)
        return null
    }
}

export default class TNS {
    constructor(options) {
        const { customRpcEndpoint } = options || {};
        let rpcEndpoint = customRpcEndpoint ? customRpcEndpoint : defaultRpc
        this.provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
    }

    //Returns record address of domain if it matches the reversename
    async getAddress(domain) {
        try {
            const formattedDomain = domain.toLowerCase().replace('.theta', '')
            const addressRecord = await getAddressRecord(formattedDomain, this.provider)
            if (addressRecord && addressRecord !== EMPTY_ADDRESS) {
                const reverseName = await getReverseName(addressRecord, this.provider)
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


    async getDomainNames(addresses, extension) {
        try {
            let addressesToReverse = [],
             result = {},
             count = 0,
             reversedNames = []
            for (const address of addresses) {
                if (isAddress(address)) {
                    const checksummedAddress = toChecksumAddress(address)
                    addressesToReverse.push(checksummedAddress)
                } else {
                    addressesToReverse.push(address)
                }
                if (count <= 2000) {
                    count++
                } else {
                    const tempreversedNames = await getReverseNames(addressesToReverse, extension, this.provider)
                    reversedNames.push(...tempreversedNames)
                    addressesToReverse = []
                    count = 0
                }
            }
            if (addressesToReverse.length) {
                const tempreversedNames = await getReverseNames(addressesToReverse, extension, this.provider)
                reversedNames.push(...tempreversedNames)
                addressesToReverse = []
            }
            const validReversedNames = reversedNames.map((n) => { return ethNamehash.normalize(n) === n ? n : '' })
            addresses.forEach((key, i) => result[key] = validReversedNames[i])
            return result
        } catch (e) {
            console.log(`Error in getDomainNames`, e)
            return null
        }
    }

    //Get reverse name of address. Returns null if user has not set it.
    async getDomainName(address) {
        try {
            if (isAddress(address)) {
                const checksummedAddress = toChecksumAddress(address)
                const domain = await getReverseName(checksummedAddress, this.provider)
                if (domain) {
                    const addressRecord = await getAddressRecord(domain, this.provider)
                    if (addressRecord && addressRecord === checksummedAddress) {
                        return domain + ".theta"
                    }
                }
            }
            return null
        } catch (e) {
            console.log(`Error in getDomainName`, e)
            return null
        }
    }
}
