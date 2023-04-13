//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT

// identificador unico de URI
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// contador unico para cada NFT mintado
import "@openzeppelin/contracts/utils/Counters.sol";
import './ERC2981ContractWideRoyalties.sol';

pragma solidity ^0.8.0;

contract CeloContract is ERC721URIStorage, ERC2981ContractWideRoyalties{

    // _tokeinIds é o contador de NFTS mintadas
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public  owner;

    uint256 public tokenPrice;



    

    constructor() ERC721 ("NFT_SANT", "SANT") {

        owner = msg.sender;
       

        

       
    }

    // @inheritdoc	ERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC2981Base)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // @notice permite definir os royalties do contrato
    // @dev Esta função em um contrato real deve ser protegida com um modificador onlyOwner (ou equivalente)
    // @param destinatário o destinatário dos royalties
    // @param value valor dos royalties (entre 0 e 10000)
    function setRoyalties(address recipient, uint256 value) public {
        _setRoyalties(recipient, value);
    }





       
    // recebe um endereço de carteira e uma url com os metados do token 
    function mintNFT(address recipient, string memory tokenURI) public returns (uint256){

        _tokenIds.increment();  // incrementa contador

        uint256 newItemId = _tokenIds.current(); // newItemId recebe valor corrente 

        _mint (recipient, newItemId);  // mint ERC721 para mintar realmente o token

        _setTokenURI(newItemId, tokenURI); //  para apontar ID novo NFT com URL de metadados
        
        //price = 1 ether / 10;  // precifica o token

         tokenPrice = 10 ether;

        
       // owner seta  o endereço do contrato para receber a comissão sobre as vendas do NFT
       // 1000 seta a comissão fixa de 10%
        _setRoyalties(owner, 1000);

        return newItemId;

        




    }
    

    
}
