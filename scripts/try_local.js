// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');
    const {ens, registrar, controller, resolver} = await attach({
        // set your own contract addresses
        ens: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
        resolver: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
        registrar: '0x68B1D87F95878fE05B998F19b66F4baba5De1aed',
        dummyOracle: '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c',
        priceOracle: '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d',
        controller: '0x59b670e9fA9D0A427751Af201D676719a970857b',
    });

    // do something with contracts ...
}

async function attach(addrs) {
    const ENSContract = await hre.ethers.getContractFactory('ENSRegistry');
    const ens = await ENSContract.attach(addrs.ens);
    console.log("ENSRegistry attached to:", ens.address);

    const ResolverContract = await hre.ethers.getContractFactory('PublicResolver');
    const resolver = await ResolverContract.attach(addrs.resolver);
    console.log("PublicResolver attached to:", resolver.address);

    const BaseRegistrarContract = await hre.ethers.getContractFactory('BaseRegistrarImplementation');
    const registrar = await BaseRegistrarContract.attach(addrs.registrar);

    const DummyOracleContract = await hre.ethers.getContractFactory('DummyOracle');
    const dummyOracle = await DummyOracleContract.attach(addrs.dummyOracle);
    console.log("DummyOracle attached to:", dummyOracle.address);

    const PriceOracleContract = await hre.ethers.getContractFactory('StablePriceOracle');
    const priceOracle = await PriceOracleContract.attach(addrs.priceOracle);
    console.log("StablePriceOracle attached to:", priceOracle.address);

    // Deploying ETHRegistrar
    const ControllerContract = await hre.ethers.getContractFactory('ETHRegistrarController');
    const controller = await ControllerContract.attach(addrs.controller);
    console.log("ETHRegistrarController attached to:", controller.address);

    return {
        ens,
        controller,
        resolver,
        priceOracle,
        dummyOracle,
        registrar
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
