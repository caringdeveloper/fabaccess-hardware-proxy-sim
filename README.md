# FabAccess Hardware Proxy Simulator

> “All parts should go together without forcing. You must remember that the parts you are reassembling were disassembled by you. Therefore, if you can’t get them together again, there must be a reason. By all means, do not use a hammer.” — IBM Manual, 1925

![TypeScript Badge](https://camo.githubusercontent.com/56e4a1d9c38168bd7b1520246d6ee084ab9abbbb/68747470733a2f2f62616467656e2e6e65742f62616467652f69636f6e2f547970655363726970743f69636f6e3d74797065736372697074266c6162656c266c6162656c436f6c6f723d626c756526636f6c6f723d353535353535) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Generic badge](https://img.shields.io/badge/Made%20with-TSOA-%3CCOLOR%3E.svg)](https://shields.io/)

## Requirements and recommendations

| Product            | Version |
| ------------------ | ------- |
| Node.js            | 12.13.1 |
| Visual Studio Code | 1.40.0  |
| Yarn               | 1.19.1  |

## Installation

```bash
$ git clone https://github.com/caringdeveloper/fabaccess-hardware-proxy-sim.git
$ cd fabaccess-hardware-proxy-sim
$ yarn # npm i
```

## Start

```bash
$ yarn build # npm run build
$ yarn main # npm run main
```

### Hints

- The project contains a `.vscode` directory which allows debugging sessions with Visual Studio Code.
- The Simulator is tested on `Linux` only but should run without any problems on `Windows` and `macOS` systems.
- Currently there is no authentication involved. In a later stage all services will need JWTs to communicate with each other.
