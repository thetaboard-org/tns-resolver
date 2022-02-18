# Theta Name Service
### Installation
To install tns-resolver use the following statement:
```console
npm install tns-resolver
```

### Import
To import tns-resolver use the following statement:
```js script
import { getDomainName, getAddress } from 'tns-resolver';
```

### Get domain name from an address
To get the domain name from an address use the ```getDomainName``` function such as: 
```js script
import { getDomainName } from 'tns-resolver';

const domainName = await getDomainName(address);
console.log(domainName);
// will return the domain name or null if no domain name is assigned on this address
// i.e. will log 'domainname' or null
```

### Get address from a domain name
To get the address from a domain name use the ```getAddress``` function such as: 
```js script
import { getAddress } from 'tns-resolver';

const address = await getAddress(domainName);
console.log(address);
// will return the address or null if the domain is not assigned to an address
// i.e. will log '0x123...' or null
```
