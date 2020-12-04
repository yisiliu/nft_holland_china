pragma solidity ^0.6.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract HollandChinaNFT is ERC721 {

    uint8 private limit;
    address private creator;
    mapping (address => bool) admin;
    mapping (address => bool) claimed;

    constructor (string memory _name, string memory _symbol) ERC721(_name, _symbol) public {
        _setBaseURI("https://holland-china-2020.s3.ap-east-1.amazonaws.com/");
        creator = msg.sender;
        admin[creator] = true;
        limit = 0;
    }

    function mintToken(address claimer) public returns (uint256) {
        require(admin[msg.sender], "Not authorized.");
        require(!claimed[claimer], "Already Claimed.");
        require(limit > 0, "Out of stock.");
        uint256 _id = uint256(keccak256(abi.encodePacked(limit - 1)));
        _safeMint(claimer, _id);
        limit -= 1;
        claimed[claimer] = true;
        return _id;
    }

    function check_availability() public view returns (uint8) {
        return limit;
    }

    function modify_limit(int8 delta) public {
        require(admin[msg.sender], "Not authorized.");
        require(delta < 64, "Non Overflow");        
        require(int8(limit) + delta > 0, "Non Negative");        
        limit = uint8(int8(limit) + delta);
    }

    function modify_admin(address target, bool ifadmin) public {
        require(msg.sender == creator, "Not the contract creator");
        require(admin[msg.sender] == true, "Not admin");
        admin[target] = ifadmin;
    }
}
