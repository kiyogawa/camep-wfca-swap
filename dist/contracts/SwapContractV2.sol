// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SwapContractV2 is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public camepToken;
    IERC20 public wfcaToken;
    uint256 public wfcaPriceInJpy; // 小数点以下6桁を含む（例：12.15 JPY = 12150000）

    event SwapExecuted(
        address indexed user,
        uint256 camepAmount,
        uint256 wfcaAmount
    );

    event WfcaDeposited(
        address indexed depositor,
        uint256 amount
    );

    constructor(
        address _camepToken,
        address _wfcaToken,
        uint256 _initialWfcaPrice
    ) {
        camepToken = IERC20(_camepToken);
        wfcaToken = IERC20(_wfcaToken);
        wfcaPriceInJpy = _initialWfcaPrice;
    }

    function setWfcaPrice(uint256 _newPrice) external onlyOwner {
        wfcaPriceInJpy = _newPrice;
    }

    function calculateWfcaAmount(uint256 camepAmount) public view returns (uint256) {
        // 1 CAMEP = 1 JPY
        // wfcaPriceInJpy is JPY per WFCA with 6 decimals
        return (camepAmount * 1000000) / wfcaPriceInJpy;
    }

    function depositWfca(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        // Use safeTransferFrom to handle non-standard token implementations
        wfcaToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit WfcaDeposited(msg.sender, amount);
    }

    function swap(uint256 camepAmount) external {
        require(camepAmount > 0, "Amount must be greater than 0");
        
        uint256 wfcaAmount = calculateWfcaAmount(camepAmount);
        require(wfcaAmount > 0, "Invalid WFCA amount");
        
        require(
            wfcaToken.balanceOf(address(this)) >= wfcaAmount,
            "Insufficient WFCA balance in contract"
        );

        // Use safeTransferFrom and safeTransfer for better compatibility
        camepToken.safeTransferFrom(msg.sender, address(this), camepAmount);
        wfcaToken.safeTransfer(msg.sender, wfcaAmount);

        emit SwapExecuted(msg.sender, camepAmount, wfcaAmount);
    }

    function withdrawCamep(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        camepToken.safeTransfer(owner(), amount);
    }

    function withdrawWfca(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        wfcaToken.safeTransfer(owner(), amount);
    }
}
