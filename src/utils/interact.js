import CeloContract from "../abis/CeloContract.json";
import { pinJSONToIPFS } from "./pinata.js";

require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);



// Função para iniciar o contrato de acordo com a ABI
export const loadContract = async () => {
  // Retornando os dados da rede pelo ID
  // const networkData = MetadevsContract.networks["5777"]; // Para um servidor ganache
  const networkData = CeloContract.networks["80001"]; // Para um servidor ganache

  const contractABI = CeloContract.abi; // Definindo dados da ABI
  const contractAddress = networkData.address; // Definindo endereço do contrato a partir das configs de rede da ABI

  if (contractABI && contractAddress) {
    // Caso tenhamos a ABI e o Endereço do contrato, instanciamos o contrato no navegador
    window.contract = new web3.eth.Contract(contractABI, contractAddress);

    return {
      success: true,
      contractAddress, // Retornando o endereço do contrato
    };
  } else {
    // Caso não tenhos as variáveis de ABI e o Endereço do contrato
    return {
      success: false,
    };
  }
};

// Função para abrir a opção de conectar carteira na Metamask
export const connectWallet = async () => {
  if (window.ethereum) {
    // Se a Metamask estiver instalada no navegador
    try {
      // Inicia o processo de habilitação de uma carteira da Metamask para a nossa aplicação
      const address = await window.ethereum.enable();
      const obj = {
        // Objeto contendo o endereço da carteira do usuário e os status da operação
        connectedStatus: true,
        status: "",
        address: address,
      };
      return obj;
    } catch (error) {
      // Caso haja algum erro
      return {
        connectedStatus: false,
        status:
          "🦊 Conecte sua carteira na Metamask no botão no topo à direita",
      };
    }
  } else {
    return {
      connectedStatus: false,
      status:
        "🦊  Por favor, instale a Metamask no seu navegador: https://metamask.io/download.html",
    };
  }
};

// Função para realizar o Mint de um NFTT a partir dos parâmetros
export const mintNFT = async (
  name,
  image,
  description, 
  price,
  attributes
  //conceituacao,
  //tipo_imovel,
  //natureza,
  //processo_principal,
  //memorial,
  //tombo_arquivamento,
  //area_total
  ) => {
  // Construindo os Metadados
  const metadata = {};
  metadata.image = image; // Arte do Projeto (link do IPFS da imagem)
  metadata.name = name; // Nome do Lançamento ou artista
  metadata.description = description; // descrição do NFT
  metadata.price = price; // preço NFT
 // metadata.conceituacao = conceituacao; // conceituacao
 // metadata.tipo_imovel = tipo_imovel; // tipo de imovel
 // metadata.natureza = natureza; // natureza
 // metadata.processo_principal = processo_principal; // processo principal
 // metadata.tombo_arquivamento = tombo_arquivamento; // tombo arquivamento
 // metadata.memorial = memorial; // valor imovel
 // metadata.area_total = area_total; // area total
  
  
  
  // Gerando o IPFS a partir de um objeto JSON
  const pinataResponse = await pinJSONToIPFS(metadata);

  if (!pinataResponse.success) {
    // Caso haja algum erro no processo, iremos retornar um ststus
    return {
      success: false,
      status: "😢 Algo deu errado ao realizar o upload do tokenURI.",
    };
  }

  const metadata1 = {};
  metadata1.image = image; // Arte do Projeto (link do IPFS da imagem)
  metadata1.name = name; // Nome do Lançamento ou artista
  metadata1.description = pinataResponse.pinataUrl;
  metadata1.price = price; // preço NFT
  

  const pinataResponse1 = await pinJSONToIPFS(metadata1);

  // Armazenando o tokenURI (url do ipfs do objeto JSON que contém os metadados do NFT)
  const tokenURI = pinataResponse1.pinataUrl;

  
  // Iniciando contrato e retornando qual o Endereço do Contrato
  const { contractAddress } = await loadContract();

  
  // Realizando transação no Ethereum e retornando os parâmetros da transação
  // obs: iremos utiliza-lo no passo seguinte para retornar a txHash
  const transactionParameters = {
    to: contractAddress, // Qual o endereço do contrato no qual está recebendo a interação
    from: window.ethereum.selectedAddress, // Quem está interagindo com o contrato
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI) // Chamando a função do nosso SmartContract
      .encodeABI(),
  };

  
  
 

  // Retornando a transação realizada via Metamask
  try {
    // Solicitando qual o hash (txHash) da transação que foi executada
    // no passo anterior
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      // Caso ocorra tudo bem retornamos o hash da transação
      success: true,
      status: "✅ NFT Mintado com sucesso! txHash: " + txHash,
    };
  } catch (error) {
    // Caso algo dê errado
    return {
      success: false,
      status: "😥 Algo deu errado: " + error.message,
    };
  }
};