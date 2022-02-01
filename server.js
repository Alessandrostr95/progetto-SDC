require("dotenv").config();

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(`http://${process.env.HOST}:${process.env.PORT}`));
global.web3 = web3;
const Contracts = require('./src/models/contract');

const express = require('express');
const app = express();
app.use(express.json());

/**
 * @app Query allo smart contract.
 * Dato un `greenpass`, un'attività `activity` ( @see /api/v1/certification/enum/activities )
 * e una regione `region` ( @see /api/v1/certification/enum/regions ),
 * ritorna una risposta positiva se il possessore del greenpass è autorizzato
 * a svolgere l'attività in questione in quella regione secondo le norme vigenti.
 */
app.post('/api/v1/certification/canDo', async (req, res) => {
    try {
        const certification = req.body;
        const greenpass = certification.greenpass;
        const activity = certification.activity;
        const region = certification.region;

        const contract = await Contracts.GreenPassCertification.deployed();
        const canDo = await contract.canDo(
            greenpass,
            Contracts.Activity.enums.Activities[activity],
            Contracts.Region.enums.Regions[region]
            );
        
        res.status(200).json({
            status: true,
            data: {greenpass, activity, region, canDo}
            });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Query allo smart contract per ottenere la lista di tutte le attività.
 * Ritorna una risposta positiva con un array di stringhe che rappresentano le attività.
 */
app.get('/api/v1/certification/enum/activities', async (_, res) => {
    try {
        res.status(200).json({
            status: true,
            data: Object.keys(Contracts.Activity.enums.Activities)
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
}); 

/**
 * @app Query allo smart contract per ottenere la lista di tutte le regioni.
 * Ritorna una risposta positiva con un array di stringhe che rappresentano le regioni.
 */
app.get('/api/v1/certification/enum/regions', async (_, res) => {
    try {
        res.status(200).json({
            status: true,
            data: Object.keys(Contracts.Region.enums.Regions)
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Query allo smart contract per ottenere la lista di tutti i colori delle regioni.
 * Ritorna una risposta positiva con un array di stringhe che rappresentano i colori.
 */
app.get('/api/v1/certification/enum/colors', async (_, res) => {
    try {
        res.status(200).json({
            status: true,
            data: Object.keys(Contracts.Region.enums.Colors)
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Query allo smart contract per ottenere la lista di tutte le tipologie di greenpass.
 * Ritorna una risposta positiva con un array di stringhe che rappresentano le tipologie.
 */
app.get('/api/v1/certification/enum/certification_types', async (_, res) => {
    try {
        res.status(200).json({
            status: true,
            data: Object.keys(Contracts.Certification.enums.CertificationType)
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Api che consente di registrare un greenpass nella blockchain.
 * Chi chiama l'api deve fornire un greenpass, una tipologia di greenpass e una chiave privata di un address della blockchain.
 * Se la chiave privata è associata ad un address autorizzato alla registrazione di greenpass,
 * la richiesta viene accettata e il greenpass viene registrato.
 * Altrimenti, la richiesta viene rifiutata e l'utente riceverà un messaggio di errore.
 */
app.post('/api/v1/certification/emit', async (req, res) => {
    try {
        const data = req.body;
        const greenpass = data.greenpass;
        const certificationType = data.certificationType;
        const privateKey = data.privateKey;

        const pubKey = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contract = await Contracts.GreenPassCertification.deployed();
        const transaction = await contract.emitCertificate(certificationType, greenpass, {from: pubKey});
        res.status(200).json({
            status: true, 
            data: {transaction, greenpass, certificationType, privateKey, pubKey}
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Api che consente di assegnare il ruolo di `CERTIFICATION_MINTER_ROLE` ad un address.
 * Tele ruolo permetterà all'address di emettere greenpass.
 * Chi chiama l'api deve fornire una chiave privata di un address della blockchain.
 * Se la chiave privata è associata ad un address autorizzato all'assegnazione del ruolo,
 * la richiesta viene accettata e l'address indicato nella richiesta riceverà il ruolo.
 * Altrimenti, la richiesta viene rifiutata e l'utente riceverà un messaggio di errore.
 */
app.post('/api/v1/privileges/grat/certification_minter_role', async (req, res) => {
    try {
        const data = req.body;
        const to = data.to;
        const privateKey = data.privateKey;

        const pubKey = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contract = await Contracts.GreenPassCertification.deployed();
        const transaction = await contract.grantCertificationMinterRole(to, {from: pubKey});
        res.status(200).json({
            status: true,
            data: {
                transaction,
                role: "CERTIFICATION_MINTER_ROLE",
                to, 
                privateKey, 
                pubKey
            }
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Api che consente di revocare il ruolo di `CERTIFICATION_MINTER_ROLE` ad un address.
 * Chi chiama l'api deve fornire una chiave privata di un address della blockchain.
 * Se la chiave privata è associata ad un address autorizzato alla revoca del ruolo,
 * la richiesta viene accettata.
 * Altrimenti, la richiesta viene rifiutata e l'utente riceverà un messaggio di errore.
 */
app.post('/api/v1/privileges/revoke/certification_minter_role', async (req, res) => {
    try {
        const data = req.body;
        const to = data.to;
        const privateKey = data.privateKey;

        const pubKey = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contract = await Contracts.GreenPassCertification.deployed();
        const transaction = await contract.revokeCertificationMinterRole(to, {from: pubKey});
        res.status(200).json({
            status: true,
            data: {
                transaction,
                role: "CERTIFICATION_MINTER_ROLE",
                to,
                privateKey,
                pubKey
            }
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Api che consente di assegnare il ruolo di `PUBLIC_ADMINISTRATION_ROLE` ad un address.
 * Tele ruolo permetterà all'address di effettuare compiti della pubblica amministrazione,
 * come per esempio la gestione dei colori della regioni, la definizione delle nuove regole, ecc.
 * Chi chiama l'api deve fornire una chiave privata di un address della blockchain.
 * Se la chiave privata è associata ad un address autorizzato all'assegnazione del ruolo,
 * la richiesta viene accettata e l'address indicato nella richiesta riceverà il ruolo.
 * Altrimenti, la richiesta viene rifiutata e l'utente riceverà un messaggio di errore.
 */
app.post('/api/v1/privileges/grat/public_administration_role', async (req, res) => {
    try {
        const data = req.body;
        const to = data.to;
        const privateKey = data.privateKey;

        const pubKey = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contract = await Contracts.GreenPassCertification.deployed();
        const transaction = await contract.grantPublicAdministrationRole(to, {from: pubKey});
        res.status(200).json({
            status: true,
            data: {
                transaction,
                role: "PUBLIC_ADMINISTRATION_ROLE",
                to,
                privateKey,
                pubKey
            }
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Api che consente di revocare il ruolo di `PUBLIC_ADMINISTRATION_ROLE` ad un address.
 * Chi chiama l'api deve fornire una chiave privata di un address della blockchain.
 * Se la chiave privata è associata ad un address autorizzato alla revoca del ruolo,
 * la richiesta viene accettata.
 * Altrimenti, la richiesta viene rifiutata e l'utente riceverà un messaggio di errore.
 */
app.post('/api/v1/privileges/revoke/public_administration_role', async (req, res) => {
    try {
        const data = req.body;
        const to = data.to;
        const privateKey = data.privateKey;

        const pubKey = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contract = await Contracts.GreenPassCertification.deployed();
        const transaction = await contract.revokePublicAdministrationRole(to, {from: pubKey});
        res.status(200).json({
            status: true,
            data: {transaction, role, privateKey, pubKey}
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Api che consente di modificare il colore di una regione.
 * Chi chiama l'api deve fornire una chiave privata di un address della blockchain.
 * Se la chiave privata è associata ad un address autorizzato alla modifica del colore,
 * la richiesta viene accettata.
 * Altrimenti, la richiesta viene rifiutata e l'utente riceverà un messaggio di errore.
 */
app.post('/api/v1/administration/region/set_color', async (req, res) => {
    try {
        const data = req.body;
        const region = data.region;
        const color = data.color;
        const privateKey = data.privateKey;

        const pubKey = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contract = await Contracts.GreenPassCertification.deployed();
        const transaction = await contract.setRegionColor(region, color, {from: pubKey});
        res.status(200).json({
            status: true,
            data: {
                transaction,
                region,
                color,
                privateKey,
                pubKey
            }
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Api che consente di aggiungere una nuova regola.
 * Chi chiama l'api deve fornire una chiave privata di un address della blockchain.
 * Se la chiave privata è associata ad un address autorizzato all'aggiunta di una nuova regola,
 * la richiesta viene accettata.
 * Altrimenti, la richiesta viene rifiutata e l'utente riceverà un messaggio di errore.
 */
app.post('/api/v1/administration/rules/add', async (req, res) => {
    try {
        const data = req.body;
        const certificationType = data.certificationType;
        const activity = data.activity;
        const color = data.color;
        const privateKey = data.privateKey;

        const pubKey = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contract = await Contracts.GreenPassCertification.deployed();
        const transaction = await contract.addRule(certificationType, activity, color, {from: pubKey});
        res.status(200).json({
            status: true,
            data: {
                transaction,
                certificationType,
                activity,
                color,
                privateKey,
                pubKey
            }
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Api che consente di rimuovere una regola.
 * Chi chiama l'api deve fornire una chiave privata di un address della blockchain.
 * Se la chiave privata è associata ad un address autorizzato alla rimozione di una regola,
 * la richiesta viene accettata.
 * Altrimenti, la richiesta viene rifiutata e l'utente riceverà un messaggio di errore.
 */
app.post('/api/v1/administration/rules/remove', async (req, res) => {
    try {
        const data = req.body;
        const certificationType = data.certificationType;
        const activity = data.activity;
        const privateKey = data.privateKey;

        const pubKey = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contract = await Contracts.GreenPassCertification.deployed();
        const transaction = await contract.removeRule(certificationType, activity, {from: pubKey});
        res.status(200).json({
            status: true,
            data: {
                transaction,
                certificationType,
                activity,
                privateKey,
                pubKey
            }
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.listen(process.env.LISTEN_PORT, () => { console.log(`Hi! I'm listening on port ${process.env.LISTEN_PORT}`) });