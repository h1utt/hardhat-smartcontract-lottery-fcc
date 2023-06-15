const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE =
    "../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-lottery-fcc/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        updateContractAddresses()
        updateAbi()
    }
}

async function updateAbi() {
    const deployer = (await getNamedAccounts()).deployer
    const raffle = await ethers.getContract("Raffle", deployer)
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const deployer = (await getNamedAccounts()).deployer
    const raffle = await ethers.getContract("Raffle", deployer)
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(raffle.address)) {
            contractAddresses[chainId].push(raffle.address)
        }
    }
    {
        contractAddresses[chainId] = [raffle.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
