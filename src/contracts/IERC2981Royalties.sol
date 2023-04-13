// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// @title IERC2981Royalties
// @dev Interface for the ERC2981 - Token Royalty standard
interface IERC2981Royalties {
    // @aviso Chamado com o preço de venda para determinar quanto royalties
    //  é devido e para quem.
    // @param _tokenId - o ativo NFT consultado para obter informações sobre royalties
    // @param _value - o preço de venda do ativo NFT especificado por _tokenId
    // @return _receiver - endereço de quem deve receber o pagamento dos royalties
    // @return _royaltyAmount - o valor do pagamento de royalties pelo valor do preço de venda
    function royaltyInfo(uint256 _tokenId, uint256 _value)
        external
        view
        returns (address _receiver, uint256 _royaltyAmount);
}