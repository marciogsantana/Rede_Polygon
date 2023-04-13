// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/introspection/ERC165.sol';

import './ERC2981Base.sol';

// @dev Este é um contrato usado para adicionar suporte ERC2981 a ERC721 e 1155
// @dev Esta implementação tem os mesmos royalties para cada token
abstract contract ERC2981ContractWideRoyalties is ERC2981Base {
    RoyaltyInfo private _royalties;

    // @dev Define royalties de token
    // @param destinatário destinatário dos royalties
    // @param porcentagem do valor (usando 2 casas decimais - 10000 = 100, 0 = 0)
    function _setRoyalties(address recipient, uint256 value) internal {
        require(value <= 10000, 'ERC2981Royalties: Too high');
        _royalties = RoyaltyInfo(recipient, uint24(value));
    }

    // @inheritdoc	IERC2981Royalties
    function royaltyInfo(uint256, uint256 value)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        RoyaltyInfo memory royalties = _royalties;
        receiver = royalties.recipient;
        royaltyAmount = (value * royalties.amount) / 10000;
    }
}
