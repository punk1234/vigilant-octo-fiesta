import chai, { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";

chai.use(solidity);

describe("Atlantis File Manager 2", function () {
  let accounts: Signer[];
  let contract: any;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    const Contract = await ethers.getContractFactory('AtlantisFileManager');
    contract = await Contract.deploy()
  });

  it("Gets a private file", async function () {
    let name = 'gfhfdgfyd';
    let url = 'hfdieue';
    let description = 'uyhfhcjuur';

    const count = await contract._tokenIdCounter();
    
    await contract.uploadFile(name, url, description);
    
    await contract.makeFilePrivate(count);

    const file = await contract.getFileData(count)
    
    expect(file['_name']).to.be.equal(name)
    expect(file['_url']).to.be.equal(url)
    expect(file['_description']).to.be.equal(description)
    expect(file['_access_level']).to.be.equal('private')
  });

  
  it("Allows a user to share a private file with another user", async function () {
    let name = 'gfhfdgfyd';
    let url = 'hfdieue';
    let description = 'uyhfhcjuur';

    const count = await contract._tokenIdCounter();
    
    await contract.uploadFile(name, url, description);
    
    await contract.makeFilePrivate(count);

    const user2 = await accounts[1].getAddress()

    await contract.grantAccess(count, await user2)

    const file = await contract.connect(accounts[1]).getFileData(count);
    
    expect(file['_name']).to.be.equal(name)
    expect(file['_url']).to.be.equal(url)
    expect(file['_description']).to.be.equal(description)
    expect(file['_access_level']).to.be.equal('private')
  });
});