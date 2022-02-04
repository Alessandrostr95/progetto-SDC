let App = {
  web3Provider: null,
  contracts: {},

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      // Per farlo funzionare su Ganache
      // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      // Per farlo funzionare su Ropsten
      App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/3841cc85508742478a4f85603583fc05');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('GreenPassCertification.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var GreenPassCertificationArtifact = data;
      App.contracts.GreenPassCertification = TruffleContract(GreenPassCertificationArtifact);

      // Set the provider for our contract
      App.contracts.GreenPassCertification.setProvider(App.web3Provider);
    });

    $.getJSON('Certification.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var CertificationArtifact = data;
      App.contracts.Certification = TruffleContract(CertificationArtifact);

      // Set the provider for our contract
      App.contracts.Certification.setProvider(App.web3Provider);
    });
  },

  mintCertification: async function (qrcode) {
    // web3.eth.getAccounts(function (error, accounts) {
    const accounts = web3.eth.accounts;
    if (accounts == undefined) {
      alert(error);
      return false;
    }
    var account = accounts[0];
    const qrcodeString = JSON.stringify(qrcode).trim();
    App.contracts.GreenPassCertification.deployed().then(function (instance) {
      // const contractInstance = await App.contracts.GreenPassCertification.deployed();
      const contractInstance = instance;
      if (!App.contracts.GreenPassCertification.isDeployed()) 
        alert("Non è stato fatto il deploy del contratto");
      // DECOMMENTA QUESTO CODICE SE METAMASK CRASHA
      
      // const data = {
      //   "greenpass": qrcodeString,
      //   "certificationType": qrcode.tipo_certificazione,
      //   "pubKey": account
      // }
      // fetch("http://localhost:30303/api/v1/certification/emitPublic", {
      //   method: "POST",
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // }).then(res => {
      //   console.log("Request complete! response:", JSON.stringify(res));
      // });
      //   alert("Non deployed");
      // }

      // LE ENUMS NON FUNZIONANO(!)

      // contractInstance.emitCertification(App.contracts.Certification.enums.CertificationType[qrcode.tipo_certificazione], JSON.stringify(qrcode), { from: account }).then(e => alert(e));
      return contractInstance.emitCertification(parseInt(qrcode.tipo_certificazione), qrcodeString, { from: account });
    }).then(function (result) {
      alert("Aggiunto correttamente il green pass: " + result);
      return qrcodeString;
    }).catch(function (err) {
      alert(err.message);
    });
  }
};


window.onload = function () {
  App.initWeb3();
};

export default App.mintCertification;