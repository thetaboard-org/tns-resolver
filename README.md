# Theta Name Service
### Installation
To install tns-resolver use the following statement:
```console
npm install tns-resolver
```

### Import
To import tns-resolver use the following statement:
```js script
import { getDomainName, getDomainNames, getAddress } from 'tns-resolver';
```

### Get domain name from an address
To get the domain name from an address use the ```getDomainName``` function such as: 
```js script
import { getDomainName } from 'tns-resolver';

const address = '0x123...';
const domainName = await getDomainName(address);
console.log(domainName);
/* will return the domain name 
 or null if no domain name is assigned on this address
 i.e. will log 'domainname.theta' or null */
```

### Get domain names for a list of addresses
If you need to process many addresses (eg: showing domain names of transaction histories), use the ```getDomainNames``` function such as: 
```js script
import { getDomainNames } from 'tns-resolver';

const addresses = ['0x123...', '0x456...'];
const domainNames = await getDomainNames(addresses);
console.log(domainNames);
/* will return an object where 
 the key is the address 
 the value is the domain name or 
 an empty string if no domain name is assigned on this address
 i.e. will log { "0x123...": "domainname.theta", "0x456...": "" } */
```

### Get address from a domain name
To get the address from a domain name use the ```getAddress``` function such as: 
```js script
import { getAddress } from 'tns-resolver';

const address = await getAddress(domainName);
console.log(address);
/* will return the address or null if the domain 
is not assigned to an address
i.e. will log '0x123...' or null */
```