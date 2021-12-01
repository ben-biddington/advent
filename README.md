## Install

```sh
npm i && npx tsc -p . && npx babel dist/
```

## Examples

### Print salaries by role and company

```sh
./build && node dist/cli.js salaries "Product Manager" Google Microsoft Intuit
```

#### Use tor

Many commands offer the `--use-tor` options which conceals your ip address.

```sh
./build && node dist/cli.js salaries "Product Manager" Google Microsoft Intuit --use-tor
```

### Print salaries for all companies that have role "Product Manager"

```sh
./build && node dist/cli.js salaries "Product Manager"
```

Note: limited to the top `25` companies because some roles like "Software Engineer" exist at thousands of companies. 

#### More options

```sh
node dist/cli.js salaries --help
Usage: node dist/cli.js salaries [options] [role] [companies...]

Print a salary report for all levels for [role] for each [company]

Arguments:
  role                 For example, "Product Manager"
  companies            A list of names, for example Google Microsoft Intuit

Options:
  -d, --debug          output extra debugging (default: false)
      --stats          turn on statistics (default: false)
      --use-tor        use tor (default: false)
      --count <count>  how many companies to process
      --nice           run slower with lower throttle (default: false)
      --really-nice    run even slower with very low throttle (default: false)
      --ned-flanders   run extremely slowly (default: false)
  -h, --help           display help for command

Examples:

  $ node dist/cli.js salaries
  $ node dist/cli.js salaries "Product Manager" Google Microsoft Intuit
```

### Print the levels for role "Product Manager" across several companies

```sh
./build && node dist/cli.js levels "Product Manager" Google Microsoft Intuit
```

### Print all companies that have the role "Product Manager"

```sh
./build && node dist/cli.js companies "Product Manager"
```

Note: role name is case sensitive: "product manager" returns no results.

## Notes

### See tor working

```sh
./build && node dist/cli.js ip --use-tor 
useTor ON
Your current IP address: 162.247.74.201
```

```sh
./build && node dist/cli.js ip 
useTor OFF
Your current IP address: 27.252.205.143
```

```
curl https://ipv4.icanhazip.com
27.252.205.143
```

### About the levels API

Request any `api.levels` resource, for example:

Go here

>  https://www.levels.fyi/Salaries/Software-Engineer/Ireland/

And from your network tab find:

```
https://api.levels.fyi/v1/salaries?title=Software+Engineer&limit=10&orderDesc=true&searchText=&sortBy=timestamp&countryName=Ireland
```

Search it:

```
node dist/cli.js search "https://api.levels.fyi/v1/salaries?title=Software+Engineer&limit=10&orderDesc=true&searchText=&sortBy=timestamp&countryName=Ireland"
```