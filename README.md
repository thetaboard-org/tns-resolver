# Theta Name Service - TNS Resolver

###### This NPM can be used to retrieve an address from a TNS or a TNS from an address on the Theta Blockchain.
###### It can also retrieve a list of domain names from a list of addresses.

### Installation
To install tns-resolver use the following statement:
```console
npm install tns-resolver
```

### Import and instanciate TNS
To import and instanciate tns-resolver use the following statement:
```js script
import TNS from "tns-resolver";

const tns = new TNS();
```

### Get domain name from an address
To get the domain name from an address use the ```getDomainName``` function such as: 
```js script
import TNS from 'tns-resolver';

const address = '0x123...';
const tns = new TNS();
const domainName = await tns.getDomainName(address);
console.log(domainName);
/* will return the domain name 
 or null if no domain name is assigned to this address
 i.e. will log 'domainname.theta' or null */
```

### Get address from a domain name
To get the address from a domain name use the ```getAddress``` function such as:
```js script
import TNS from 'tns-resolver';

const domainName = 'test.theta';
const tns = new TNS();
const address = await tns.getAddress(domainName);
console.log(address);
/* will return the address or null if the domain
is not assigned to an address
i.e. will log '0x123...' or null */
```

### Get domain names for a list of addresses
If you need to process many addresses (eg: showing domain names of transaction histories), use the ```getDomainNames``` function such as: 
```js script
import TNS from 'tns-resolver';

const addresses = ['0x123...', '0x456...'];
const tns = new TNS();
const domainNames = await tns.getDomainNames(addresses);
console.log(domainNames);
/* will return an object where the key is the address
 and the value is the domain name or an empty string if no domain name is assigned on this address
 i.e. will log { "0x123...": "domainname.theta", "0x456...": "" } */
```

### Instanciate TNS with a custom RPC endpoint
To instanciate tns-resolver using a custom RPC endpoint use the following statement:
```js script
import TNS from "tns-resolver";

const tns = new TNS({customRpcEndpoint: 'YOUR_CUSTOM_RPC_ENDPOINT_HERE'});
```
