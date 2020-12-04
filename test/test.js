const HollandChinaNFT = artifacts.require("HollandChinaNFT");
const web3 = require('Web3');

contract("HollandChinaNFT", accounts => {
    beforeEach(async () =>{
        console.log("Before ALL\n");
        nft = await HollandChinaNFT.deployed();
    });

    it("Should return the correct base uri", async () => {
        const _baseURI = await nft.baseURI.call();
        assert.equal(_baseURI, "https://holland-china-2020.s3.ap-east-1.amazonaws.com/");
    });

    it("Should lift the state limit for the state 0", async () => {
        const magic = await nft.modify_limit.sendTransaction(9);
        const remaining = await nft.check_availability();
        assert.equal(remaining, 9);
    });

    it("Should transfer a newly minted token to account 1", async () => {
        const magic = await nft.mintToken.sendTransaction(accounts[1]);
        const _id = web3.utils.soliditySha3({t: 'uint8', v: 8});
        const ownership = await nft.ownerOf(_id);
        assert.equal(ownership, accounts[1]);
    });

    it("Should not transfer a newly minted token to account 1 since claimed", async () => {
        try{
            await nft.mintToken.sendTransaction(accounts[1]);
        }
        catch(e){
            assert.equal(e['reason'], "Already Claimed.");
        }

    });

    it("Should return the limit for the state 0", async () => {
        const remaining = await nft.check_availability();
        assert.equal(remaining, 8);
    });

    it("Should reset the limit for the state 0", async () => {
        await nft.modify_limit.sendTransaction(1);
        const remaining = await nft.check_availability();
        assert.equal(remaining, 9);
    });

    it("Should add account 1 as admin and increase the limit for the state 0", async () => {
        await nft.modify_admin.sendTransaction(accounts[1], true);
        await nft.modify_limit.sendTransaction(1, {"from": accounts[1]});
        const remaining = await nft.check_availability();
        assert.equal(remaining, 10);
    });

    it("Should not transfer a newly minted token to account 1 since limit is not set", async () => {
        try{
            await nft.mintToken.sendTransaction(accounts[2]);
        }
        catch(e){
            assert.equal(e['reason'], "Out of stock.");
        }

    });

});
