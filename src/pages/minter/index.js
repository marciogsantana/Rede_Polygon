import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Fox from "../../components/fox";
import "./style.css";
import { connectWallet, mintNFT } from "../../utils/interact";
import { pinIMAGEtoIPFS } from "../../utils/pinata";

// Import das funções utilitárias e de interação com o piñata

const FormData = require("form-data");

const Minter = () => {
  // Variáveis de Estado da aplicação, erros
  // e informações da carteira do usuário
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // Variáveis do Formulário
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
 // const [price, setPrice] = useState("");
 // const [conceituacao, setConceituacao] = useState("");
 // const [tipo_imovel, setTipoImovel] = useState("");
 // const [natureza, setNatureza] = useState("");
 // const [processo_principal, setProcessoPrincipal] = useState("");
 // const [tombo_arquivamento, setTomboArquivamento] = useState("");
 // const [memorial, setMemorial] = useState("");
 // const [area_total, setAreaTotal] = useState("");

  // Tipos aceitáveis de Arte do Projeto
  const types = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

  // Variável na qual iremos concentrar as informações do formulário
  let data = new FormData();

  // Função que é executada assim que o código é executado (ex: quando a página
  // é aberta no navegador)
  useEffect(async () => {

    // valindo se o usuário tem o Metamask instalado

    if (window.ethereum) {

      //alert("Tenho a Metamask");

      try {

        const accounts = await window.ethereum.request({

          method: "eth_accounts",

        });

        // Se o usuario tiver alguma conta conectada

        if (accounts.length) {

          setConnectedStatus(true);
          setWallet(accounts[0]);


        } else {

          throw Error;


        }


      } catch (err) {

        setConnectedStatus(false);
        setStatus("Por favor Conecte a sua carteira Metamask ");


      }


    } else {

      setStatus("Por favor instale a sua carteira Metamask no navegador");
    }



  }, []);

  // Função executada quando o usuário clica no botão "conectar carteira"
  // Essa função irá chamar outra função utilitária (connectWallet) e irá
  // definir o status e/ou endereço da carteira retornado (caso tudo ocorra bem)
  const connectWalletPressed = async () => {

    const walletResponse = await connectWallet();
    setConnectedStatus(walletResponse.connectedStatus);
    setStatus(walletAddress.status);
    if (isConnected) {

      setWallet(walletAddress.address);

    }
  };

  // Função para quando o usuário for realizar o Mint
  const onMintPressed = async () => {
    // Passando os parametros para a função utilitária mintNFT
    // e definindo o status da resposta
    const { status } = await mintNFT(
      name,
      image,
      description
      //price
      //conceituacao,
      //tipo_imovel,
      //natureza,
      //processo_principal,
      //memorial,
      //tombo_arquivamento,
      //area_total
      );
    setStatus(status);
  };

  // Função executada quando o usuário seleciona uma imagem no formulários
  const artworkHandleChange = async (e) => {

    let selecteFile = e.target.files[0];

    if (selecteFile) {

      if (types.includes(selecteFile.type)) {
        data.set("file", selecteFile);
        // chamando função utilitaria do pinata
        const pinataResponse = await pinIMAGEtoIPFS(data);
        // se der tudo certo
        if (pinataResponse.success) {

          setImage(pinataResponse.pinataUrl);
          setError("")

        }


      } else {

        setError("Tipo de arquivo não aceito");

      }
    }
  };

  return (
    <div id="minter">
      <Header />
      <br />
      <br />
      <br />
      <br />

      <div className="container-fluid">
        {/* TÍTULO  E SUBTITULO */}
        <div className="row mt-4">
          <div className="col-md-2 col-sm-0" />
          <div className="col-md-4 col-sm-12 text-md-start text-sm-center  mt-2">
            <span className="fw-bolder title">Use a sua criatividade</span>
            <span className="title"> E minte seus NFTS</span>
            <br />
            <span className="text-muted subtitle fw-light text-md-start text-sm-center">
              Gere o seu NFT! 
            </span>
          </div>

          {/* METAMASK FACE INTERATIVA */}
          <div className="col-md-2 col-sm-12 text-center mt-3 mt-md-0">
            <div id="metamask-face">
              {<Fox followMouse width={100} height={100} />}
            </div>
          </div>

          {/* BOTÃO CONECTAR CARTEIRA */}
          <div className="col-md-4 col-sm-12 text-md-start tex-sm-center connect-wallet-div mt-4 mt-md-auto mb-md-auto mb-4">
            <span onClick={connectWalletPressed}>
              {/* Botão de Conectar carteira
              obs: caso o usuário estiver conectado iremos mostrar o endereço da carteira
              caso contrário, a opção conectar carteira
              */}
              {isConnected ? (
                <span className="wallet-button-connected">
                  {"✅ Connected: " +
                    String(walletAddress).substring(0, 6) +
                    "..." +
                    String(walletAddress).substring(38)}
                </span>
              ) : (
                <span className="wallet-button">Conectar Carteira 👛</span>
              )}
            </span>
          </div>
          <div className="col-2" />
        </div>

        {/* ALERTAS */}
        {/* Alertas de Status */}

        {/* {status ? (
          <div className="row mb-4 mt-5 mt-md-4">
            <div className="col-12">
              <div className="alert alert-secondary" role="alert">
                <span className="status">{status}</span>
              </div>
            </div>
          </div>
        ) : null} */}

        {status ? (

          <div className="row mb-4 mt-5 mt-md-4">
            <div className="col-12">
              <div className="alert alert-secondary" role="alert">
                <span className="status">{status}</span>

              </div>
            </div>
          </div>


        ) : null}


        {/* Alertas de Erros */}

        {/* {error ? (
          <div className="row mb-4 mt-5 mt-md-4">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                <span className="status">{error}</span>
              </div>
            </div>
          </div>
        ) : null} */}

        {error ? (

          <div className="row mb-4 mt-5 mt-md-4">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                <span className="status">{error};</span>
              </div>
            </div>
          </div>


        ) : null}


        {/* CARD PRINCIPAL E FORMULÁRIO*/}
        <div className="row">
          <div className="col-1 col-md-2" />
          <div className="col-10 col-md-8 form-card">
            <div className="row text-center">
              <div className="col-12 text-center">
                <span className="text-muted card-title fw-light ">
                  Verifique todas as todas as informações
                  depois aperte em "Mintar seu NFT"
                </span>
              </div>
            </div>

            {/* Formulário */}
            <div className="row mt-5">
              <form className="text-start">
                {/* Upload Arte do Projeto */}
                <div className="row">
                  <div className="col-md-2 col-sm-1" />

                  <div className="col-md-8 col-sm-10">
                    <div className="mb-3">
                      <label htmlFor="image" className="form-title">
                        Imagem do NFT {image ? <span>✅</span> : null}
                      </label>

                      {/* Caso o upload da Arte do Projeto 
                      já tenha sido concluída, iremos renderizar 
                      um preview da imagem no card */}
                      {image ? (
                        <span>
                          <br />
                          <img className="image-preview" src={image} />
                        </span>
                      ) : null}

                      <br />
                      <span className="text-muted form-subtitle fw-light">
                        Suporta JPG, PNG e GIF. Tamanho máximo de arquivo: 10MB.
                      </span>
                      <br />

                      {/* Link do IPFS Hash gerado */}
                      {image ? (
                        <span className="text-muted form-url-subtitle fw-light">
                          {image}
                        </span>
                      ) : null}

                      {/* Input da Imagem
                      obs: ela é desativada quando o link do 
                      IPFS Hash é gerado */}
                      <input
                        required
                        className="form-control mt-1"
                        id="image"
                        onChange={artworkHandleChange}
                        type="file"
                        disabled={image ? true : false}
                      />
                    </div>
                  </div>

                  <div className="col-md-2 col-sm-1" />
                </div>


                {/* name */}
                <div className="row">
                  <div className="col-md-2 col-sm-1" />

                  <div className="col-md-8  col-sm-10">
                    <div className=" mb-3">
                      <label htmlFor="codigo_rip" className="form-title">
                        nome do NFT{" "}
                        {name ? <span>✅</span> : null}
                      </label>
                      <input
                        type="text"
                        required
                        onChange={(event) => setName(event.target.value)}
                        className="form-control form-control-lg"
                        id="name"
                        placeholder="Informe o nome do NFT"
                      />
                    </div>
                  </div>

                  <div className="col-md-2 col-sm-1" />
                </div>

                {/* descrição */}
                <div className="row">
                  <div className="col-md-2 col-sm-1" />

                  <div className="col-md-8 col-sm-10">
                    <div className=" mb-3">
                      <label htmlFor="descrição" className="form-title">
                        Descrição do NFT {description ? <span>✅</span> : null}
                      </label>
                      <input
                        type="text"
                        required
                        onChange={(event) => setDescription(event.target.value)}
                        className="form-control form-control-lg"
                        id="description"
                        placeholder="Informe a descrição"
                      />
                    </div>
                  </div>



                  <div className="col-md-2 col-sm-1" />
                </div>

                    
           
                {/* BOTÃO DE MINT */}
                <div className="row">
                  <div className="col-md-2 col-sm-1" />

                  <div className="col-md-8 col-sm-10">
                    {/* Caso todos os campos do formulário estiverem concluídos
                    (link do IPFS gerado e carteira conectada) o botão
                    será habilitado, caso contrário continua deshabilitado
                    por padrão */}
                    {isConnected && image && name && description ? (
                      <span onClick={onMintPressed} className="btn btn-sm">
                        Mintar NFT
                      </span>
                    ) : (
                      <button className="btn btn-sm" disabled>
                        Mintar NFT (carteira MetaMask não conectada)
                      </button>
                    )}
                  </div>

                  <div className="col-md-2 col-sm-1" />
                </div>
              </form>
            </div>
          </div>
          <div className="col-1 col-md-2" />
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Minter;
