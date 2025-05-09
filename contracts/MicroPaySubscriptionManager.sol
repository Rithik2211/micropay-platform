// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BaseHook} from "v4-periphery/BaseHook.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {Currency, CurrencyLibrary} from "v4-core/types/Currency.sol";
import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title MicroPaySubscriptionManager
 * @notice Manages subscriptions and microtransactions with optimized fee structure using Uniswap v4 hooks
 * @dev Implements BaseHook from Uniswap v4 to customize swap behavior for microtransactions
 */
contract MicroPaySubscriptionManager is BaseHook, Ownable, ReentrancyGuard {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;
    using SafeERC20 for IERC20;

    // Events
    event SubscriptionCreated(
        address indexed creator,
        uint256 indexed subId,
        string name,
        uint256 price,
        uint256 frequency
    );
    event SubscriptionPurchased(
        address indexed subscriber,
        address indexed creator,
        uint256 indexed subId,
        uint256 expiryTime
    );
    event SubscriptionRenewed(
        address indexed subscriber,
        address indexed creator,
        uint256 indexed subId,
        uint256 expiryTime
    );
    event MicroPaymentProcessed(
        address indexed payer,
        address indexed receiver,
        uint256 amount
    );
    event FeeCollected(address indexed token, uint256 amount);
    event CreatorWithdrawal(address indexed creator, uint256 amount);
    event DiscountApplied(address indexed user, uint256 discount);

    // Subscription structure
    struct Subscription {
        address creator;
        string name;
        string description;
        uint256 price;          // Price in smallest token units (e.g., wei)
        uint256 frequency;      // Subscription duration in seconds
        bool active;
        uint256 subscriberCount;
        uint256 totalRevenue;
    }

    // User subscription record
    struct UserSubscription {
        uint256 subId;
        uint256 startTime;
        uint256 expiryTime;
        bool autoRenew;
    }

    // Custom fee settings for Uniswap v4 hook
    struct FeeSettings {
        // Fee is expressed in basis points (1/10000)
        uint24 microTxFee;      // Fee for microtransactions
        uint24 subscriptionFee; // Fee for subscription payments
        uint24 standardFee;     // Standard fee for regular transactions
        uint256 microTxThreshold; // Maximum amount considered a microtransaction
    }

    // State variables
    uint256 public nextSubId = 1;
    FeeSettings public feeSettings;
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => mapping(uint256 => UserSubscription)) public userSubscriptions;
    mapping(address => UserSubscription[]) public userSubscriptionsList;
    mapping(address => uint256) public creatorBalances;
    mapping(address => uint256) public userTransactionCount;
    mapping(address => uint256) public userDiscountRate; // Discount rate in basis points

    // Stablecoin for payments (e.g., USDC on Base)
    IERC20 public paymentToken;

    /**
     * @notice Constructor initializes the contract with Uniswap v4 pool manager
     * @param _poolManager Address of the Uniswap v4 pool manager
     * @param _paymentToken Address of the stablecoin used for payments
     */
    constructor(IPoolManager _poolManager, address _paymentToken) BaseHook(_poolManager) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        
        // Initialize default fee settings
        feeSettings = FeeSettings({
            microTxFee: 25,      // 0.25% for microtransactions
            subscriptionFee: 100, // 1% for subscriptions
            standardFee: 200,     // 2% for standard transactions
            microTxThreshold: 1 * 10**6  // $1 (assuming 6 decimals for USDC)
        });
    }

    /**
     * @notice Returns the hook's callback selector to be executed on swap events
     */
    function getHooksCalls() public pure override returns (Hooks.Calls memory) {
        return Hooks.Calls({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false
        });
    }

    /**
     * @notice Hook called before a swap to determine custom fee rate
     * @dev Reduces fees for microtransactions and loyal users
     */
    function beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata
    ) external override returns (bytes4) {
        // Only apply custom fees for our payment token pools
        if (key.currency0.toAddress() == address(paymentToken) || key.currency1.toAddress() == address(paymentToken)) {
            uint256 amountIn = uint256(params.amountSpecified < 0 ? -params.amountSpecified : params.amountSpecified);
            
            // Apply microtransaction fee if amount is below threshold
            if (amountIn <= feeSettings.microTxThreshold) {
                // Implementation would adjust fee dynamically in the pool
                // This would require custom logic in the Uniswap v4 pool implementation
            }
        }

        return BaseHook.beforeSwap.selector;
    }

    /**
     * @notice Hook called after a swap to track user activity
     */
    function afterSwap(
        address sender,
        PoolKey calldata,
        IPoolManager.SwapParams calldata,
        bytes calldata,
        int256
    ) external override returns (bytes4) {
        // Increment user transaction count for loyalty discounts
        userTransactionCount[sender]++;
        
        // Apply loyalty discount if user has made many transactions
        if (userTransactionCount[sender] > 10 && userDiscountRate[sender] == 0) {
            userDiscountRate[sender] = 50; // 0.5% discount
            emit DiscountApplied(sender, 50);
        } else if (userTransactionCount[sender] > 50 && userDiscountRate[sender] == 50) {
            userDiscountRate[sender] = 100; // 1% discount
            emit DiscountApplied(sender, 100);
        }

        return BaseHook.afterSwap.selector;
    }

    /**
     * @notice Creates a new subscription plan
     * @param name Name of the subscription
     * @param description Description of the subscription
     * @param price Price in smallest token units
     * @param frequency Duration in seconds (e.g., 30 days = 2592000)
     * @return subId ID of the created subscription
     */
    function createSubscription(
        string memory name,
        string memory description,
        uint256 price,
        uint256 frequency
    ) external returns (uint256 subId) {
        require(price > 0, "Price must be greater than 0");
        require(frequency > 0, "Frequency must be greater than 0");
        
        subId = nextSubId++;
        
        Subscription storage sub = subscriptions[subId];
        sub.creator = msg.sender;
        sub.name = name;
        sub.description = description;
        sub.price = price;
        sub.frequency = frequency;
        sub.active = true;
        
        emit SubscriptionCreated(msg.sender, subId, name, price, frequency);
        return subId;
    }

    /**
     * @notice Purchases a subscription for a user
     * @param subId ID of the subscription to purchase
     * @param autoRenew Whether to automatically renew the subscription
     */
    function purchaseSubscription(uint256 subId, bool autoRenew) external nonReentrant {
        Subscription storage sub = subscriptions[subId];
        require(sub.active, "Subscription is not active");
        
        // Transfer payment from user to contract
        uint256 fee = calculateFee(sub.price, feeSettings.subscriptionFee, msg.sender);
        uint256 creatorAmount = sub.price - fee;
        
        // Transfer payment token from user to contract
        paymentToken.safeTransferFrom(msg.sender, address(this), sub.price);
        
        // Credit creator's balance
        creatorBalances[sub.creator] += creatorAmount;
        
        // Update subscription stats
        sub.subscriberCount++;
        sub.totalRevenue += sub.price;
        
        // Store user subscription info
        UserSubscription memory userSub = UserSubscription({
            subId: subId,
            startTime: block.timestamp,
            expiryTime: block.timestamp + sub.frequency,
            autoRenew: autoRenew
        });
        
        userSubscriptions[msg.sender][subId] = userSub;
        userSubscriptionsList[msg.sender].push(userSub);
        
        emit SubscriptionPurchased(msg.sender, sub.creator, subId, userSub.expiryTime);
    }

    /**
     * @notice Processes a microtransaction payment
     * @param receiver Address receiving the payment
     * @param amount Amount of the payment
     * @dev Applies reduced fees for small payments
     */
    function processMicroPayment(address receiver, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(receiver != address(0), "Invalid receiver address");
        
        // Determine fee based on payment size
        uint24 feeRate = amount <= feeSettings.microTxThreshold ? 
                         feeSettings.microTxFee : 
                         feeSettings.standardFee;
        
        uint256 fee = calculateFee(amount, feeRate, msg.sender);
        uint256 receiverAmount = amount - fee;
        
        // Transfer payment token from user to contract
        paymentToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Credit receiver's balance
        creatorBalances[receiver] += receiverAmount;
        
        emit MicroPaymentProcessed(msg.sender, receiver, amount);
    }

    /**
     * @notice Renews a subscription
     * @param subId ID of the subscription to renew
     */
    function renewSubscription(uint256 subId) external nonReentrant {
        UserSubscription storage userSub = userSubscriptions[msg.sender][subId];
        require(userSub.subId == subId, "Subscription not found");
        
        Subscription storage sub = subscriptions[subId];
        require(sub.active, "Subscription is not active");
        
        // Transfer payment from user to contract
        uint256 fee = calculateFee(sub.price, feeSettings.subscriptionFee, msg.sender);
        uint256 creatorAmount = sub.price - fee;
        
        paymentToken.safeTransferFrom(msg.sender, address(this), sub.price);
        
        // Credit creator's balance
        creatorBalances[sub.creator] += creatorAmount;
        
        // Update subscription stats
        sub.totalRevenue += sub.price;
        
        // Update user subscription expiry
        userSub.expiryTime = block.timestamp + sub.frequency;
        
        emit SubscriptionRenewed(msg.sender, sub.creator, subId, userSub.expiryTime);
    }

    /**
     * @notice Batch processes renewals for auto-renewing subscriptions
     * @param users Array of user addresses
     * @param subIds Array of subscription IDs
     * @dev Can be called by an operator to handle multiple renewals at once
     */
    function batchProcessRenewals(address[] calldata users, uint256[] calldata subIds) external {
        require(users.length == subIds.length, "Array lengths must match");
        
        for (uint i = 0; i < users.length; i++) {
            UserSubscription storage userSub = userSubscriptions[users[i]][subIds[i]];
            
            // Skip if not auto-renew or not expired
            if (!userSub.autoRenew || userSub.expiryTime > block.timestamp) {
                continue;
            }
            
            Subscription storage sub = subscriptions[subIds[i]];
            if (!sub.active) {
                continue;
            }
            
            // Check user allowance and balance
            if (paymentToken.allowance(users[i], address(this)) >= sub.price && 
                paymentToken.balanceOf(users[i]) >= sub.price) {
                
                try paymentToken.safeTransferFrom(users[i], address(this), sub.price) {
                    // Fee calculation
                    uint256 fee = calculateFee(sub.price, feeSettings.subscriptionFee, users[i]);
                    uint256 creatorAmount = sub.price - fee;
                    
                    // Credit creator's balance
                    creatorBalances[sub.creator] += creatorAmount;
                    
                    // Update subscription stats
                    sub.totalRevenue += sub.price;
                    
                    // Update user subscription expiry
                    userSub.expiryTime = block.timestamp + sub.frequency;
                    
                    emit SubscriptionRenewed(users[i], sub.creator, subIds[i], userSub.expiryTime);
                } catch {
                    // Payment failed, subscription remains expired
                }
            }
        }
    }

    /**
     * @notice Allows creators to withdraw their earnings
     */
    function creatorWithdraw() external nonReentrant {
        uint256 amount = creatorBalances[msg.sender];
        require(amount > 0, "No balance available");
        
        creatorBalances[msg.sender] = 0;
        paymentToken.safeTransfer(msg.sender, amount);
        
        emit CreatorWithdrawal(msg.sender, amount);
    }

    /**
     * @notice Updates the fee settings
     * @param _microTxFee New fee for microtransactions (in basis points)
     * @param _subscriptionFee New fee for subscriptions (in basis points)
     * @param _standardFee New fee for standard transactions (in basis points)
     * @param _microTxThreshold New threshold for microtransactions
     */
    function updateFeeSettings(
        uint24 _microTxFee,
        uint24 _subscriptionFee,
        uint24 _standardFee,
        uint256 _microTxThreshold
    ) external onlyOwner {
        require(_microTxFee <= 1000, "Micro fee too high"); // Max 10%
        require(_subscriptionFee <= 2000, "Subscription fee too high"); // Max 20%
        require(_standardFee <= 3000, "Standard fee too high"); // Max 30%
        
        feeSettings.microTxFee = _microTxFee;
        feeSettings.subscriptionFee = _subscriptionFee;
        feeSettings.standardFee = _standardFee;
        feeSettings.microTxThreshold = _microTxThreshold;
    }

    /**
     * @notice Withdraws platform fees to the owner
     * @param amount Amount to withdraw
     */
    function withdrawFees(uint256 amount) external onlyOwner {
        uint256 contractBalance = paymentToken.balanceOf(address(this)) - getTotalCreatorBalances();
        require(amount <= contractBalance, "Amount exceeds available fees");
        
        paymentToken.safeTransfer(owner(), amount);
        emit FeeCollected(address(paymentToken), amount);
    }

    /**
     * @notice Checks if a user has an active subscription
     * @param user Address of the user
     * @param subId ID of the subscription
     * @return isActive Whether the subscription is active
     */
    function hasActiveSubscription(address user, uint256 subId) public view returns (bool isActive) {
        UserSubscription memory userSub = userSubscriptions[user][subId];
        return userSub.subId == subId && userSub.expiryTime >= block.timestamp;
    }

    /**
     * @notice Gets all subscriptions for a user
     * @param user Address of the user
     * @return Array of user subscriptions
     */
    function getUserSubscriptions(address user) external view returns (UserSubscription[] memory) {
        return userSubscriptionsList[user];
    }

    /**
     * @notice Calculates fee amount with discounts applied
     * @param amount Base amount
     * @param baseFeeRate Base fee rate in basis points
     * @param user User address to check for discounts
     * @return feeAmount The final fee amount
     */
    function calculateFee(uint256 amount, uint24 baseFeeRate, address user) public view returns (uint256 feeAmount) {
        // Apply user discount if available
        uint256 effectiveFeeRate = baseFeeRate;
        if (userDiscountRate[user] > 0) {
            if (userDiscountRate[user] >= baseFeeRate) {
                return 0; // Full discount
            }
            effectiveFeeRate = baseFeeRate - userDiscountRate[user];
        }
        
        return (amount * effectiveFeeRate) / 10000;
    }

    /**
     * @notice Gets the total balance owed to all creators
     * @return total Total balance owed to creators
     */
    function getTotalCreatorBalances() public view returns (uint256 total) {
        // This is an approximation and may not be practical on-chain for many creators
        // In production, keep a running total instead
        return 0; // Placeholder - implement real tracking in production
    }
}