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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
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

  mintCertification: function (qrcode) {
    // web3.eth.getAccounts(function (error, accounts) {
    const accounts = web3.eth.accounts;
    if (accounts == undefined) {
      alert(error);
      return false;
    }
    var account = accounts[0];
    
    App.contracts.GreenPassCertification.deployed().then(function (instance) {
      console.log("entro");
      const contractInstance = instance;
      // return contractInstance.emitCertification(App.contracts.Certification.enums.CertificationType[qrcode.tipo_certificazione], JSON.stringify(qrcode), { from: account });
      // return contractInstance.emitCertification(1, JSON.stringify(qrcode), { from: account });
      return contractInstance.emitCertification(parseInt(qrcode.tipo_certificazione), JSON.stringify(qrcode), { from: account });
    }).then(function(result){
      alert(result);
      return true;
    }).catch(function (err) {
      alert(err.message);
    });
    // });
    return JSON.stringify(qrcode);
    // });
  }

};


window.onload = function () {
  App.initWeb3();
};

export default App.mintCertification;

// export function mintCertification(qrcode) {
//   // qrcode.tipo_certificazione = 1; //Provvisorio, perché le stringhe non le vuole

//   // web3.eth.getAccounts(function (error, accounts) {
//   // const accounts = window.web3.eth.accounts;
//   // if (accounts == undefined) {
//   //   console.log("Errore con il collegamento alla blockchain");
//   //   return -1;
//   // }
//   web3.eth.getAccounts(function (error, accounts) {
//     if(error){
//       alert(error);
//       return false;
//     }
//     var account = accounts[0];

//     App.contracts.GreenPassCertification.deployed().then(function (instance) {
//       // const instance = await App.contracts.GreenPassCertification.deployed();
//       console.log("entro");
//       const contractInstance = instance;
//       // App.contracts.Certification.deployed().then(function (certificationInstance) {
//       // contractInstance.emitCertification(App.contracts.Certification[qrcode.tipo_certificazione], JSON.stringify(qrcode), { from: account });
//       // return true;
//       // });
//       // App.contracts.Certification.enums.CertificationType[qrcode.tipo_certificazione]
//       contractInstance.emitCertification(App.contracts.Certification.enums.CertificationType[qrcode.tipo_certificazione], JSON.stringify(qrcode), { from: account }).then(e => alert(e));
//       return true;
//     }).catch(function (err) {
//       console.log(err.message);
//     });
//   });
//   return false;
//   // });
// }