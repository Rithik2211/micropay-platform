// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC721} from "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {ERC721} from "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {IERC721Metadata} from "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import {ERC721URIStorage} from "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Counters} from "lib/openzeppelin-contracts/contracts/utils/Counters.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title SubscriptionNFT
 * @notice NFT representing active subscriptions with metadata
 * @dev Extends ERC721 to create subscription tokens that can be verified on-chain
 */
contract SubscriptionNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    // Token counter
    Counters.Counter private _tokenIds;
    
    // Subscription manager contract
    address public subscriptionManager;
    
    // Subscription metadata
    struct SubscriptionMetadata {
        uint256 subId;
        uint256 expiryTime;
        string name;
        string description;
    }
    
    // Mapping from token ID to subscription metadata
    mapping(uint256 => SubscriptionMetadata) public subscriptionData;
    
    // Events
    event SubscriptionNFTMinted(address indexed subscriber, uint256 tokenId, uint256 subId, uint256 expiryTime);
    event SubscriptionNFTUpdated(uint256 tokenId, uint256 expiryTime);
    
    /**
     * @notice Constructor
     * @param _name Name of the NFT collection
     * @param _symbol Symbol of the NFT collection
     */
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) Ownable(msg.sender) {}
    
    /**
     * @notice Sets the subscription manager address
     * @param _subscriptionManager Address of the subscription manager contract
     */
    function setSubscriptionManager(address _subscriptionManager) external onlyOwner {
        subscriptionManager = _subscriptionManager;
    }
    
    /**
     * @notice Mints a new subscription NFT
     * @param to Address to mint the NFT to
     * @param subId Subscription ID
     * @param expiryTime Expiry timestamp
     * @param name Subscription name
     * @param description Subscription description
     * @param tokenURI URI for the NFT metadata
     * @return tokenId The minted token ID
     */
    function mintSubscriptionNFT(
        address to,
        uint256 subId,
        uint256 expiryTime,
        string memory name,
        string memory description,
        string memory tokenURI
    ) external returns (uint256) {
        require(msg.sender == subscriptionManager, "Only subscription manager can mint");
        
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        subscriptionData[tokenId] = SubscriptionMetadata({
            subId: subId,
            expiryTime: expiryTime,
            name: name,
            description: description
        });
        
        emit SubscriptionNFTMinted(to, tokenId, subId, expiryTime);
        
        return tokenId;
    }
    
    /**
     * @notice Updates the expiry time of an existing subscription NFT
     * @param tokenId Token ID to update
     * @param newExpiryTime New expiry timestamp
     */
    function updateExpiryTime(uint256 tokenId, uint256 newExpiryTime) external {
        require(msg.sender == subscriptionManager, "Only subscription manager can update");
        require(_exists(tokenId), "Token does not exist");
        
        subscriptionData[tokenId].expiryTime = newExpiryTime;
        
        emit SubscriptionNFTUpdated(tokenId, newExpiryTime);
    }
    
    /**
     * @notice Checks if a subscription is active
     * @param tokenId Token ID to check
     * @return isActive Whether the subscription is active
     */
    function isSubscriptionActive(uint256 tokenId) external view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        return subscriptionData[tokenId].expiryTime >= block.timestamp;
    }
    
    /**
     * @notice Gets subscription details
     * @param tokenId Token ID to query
     * @return metadata The subscription metadata
     */
    function getSubscriptionDetails(uint256 tokenId) external view returns (SubscriptionMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return subscriptionData[tokenId];
    }
}