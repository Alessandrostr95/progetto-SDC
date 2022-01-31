// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './RolesManager.sol';
import './Certification.sol';

/**
 * @title GreenPassCertification contract
 * @author Alessandro Straziota, Michele Cirillo
 * @notice Contratto che offre strumenti utili per la verifica della validità dei green pass rispetto a determinate attività.
 * @dev Contratto che offre strumenti utili per la verifica della validità dei green pass rispetto a determinate attività.
 */
contract GreenPassCertification is RolesManager, Certification {

  /**
   * @dev mappa `QRCODE` => `GreenPass`
   */
  mapping (string => GreenPass) private certificates;
  
  /**
   * @dev Funzione che genera un certificato di tipo `certificationType` e lo assoccia al suo identificatore `qrcode`.
   * La transazione va a buon fine solo se colui che invoca il metodo `msg.sender` ha il ruolo `CERTIFICATION_MINTER_ROLE`.
   * @param certificationType il tipo del certificato rilasciato
   * @param qrcode il codice qr del certificato
   */
  function emitCertification(CertificationType certificationType, string memory qrcode) public onlyRole(CERTIFICATION_MINTER_ROLE) {
    //require(hasRole(CERTIFICATION_MINTER_ROLE, msg.sender), "ONLY AUTHORIZED ENTITIES CAN CREATE A NEW CERTIFICATION");

    GreenPass memory certificate = GreenPass(
        qrcode,                       // qrcode
        msg.sender,                   // emitter
        certificationType,            // certificationType
        block.timestamp,              // creation
        durations[certificationType], // duration
        false                         // invalidated
    );
    certificates[qrcode] = certificate;
  }

  /**
   * @dev Funzione che dato il QR-code di un green pass ritorna `true` se è scaduto, `false` altrimenti.
   * @param qrcode il QR-code presente su un green pass
   * @return       isExpired
   */
  function isExpired(string memory qrcode) public view returns (bool) {
    GreenPass memory certificate = certificates[qrcode];
    return block.timestamp > certificate.creation + certificate.duration;
  }

  /**
   * @dev Funzione che dato il QR-code di un green pass lo invalida.
   * Solo un indirizzo con ruolo `CERTIFICATION_MINTER_ROLE` può invocare questa funzione.
   */
  function invalidateCertificate(string memory qrcode) public onlyRole(CERTIFICATION_MINTER_ROLE) {
    //require(hasRole(CERTIFICATION_MINTER_ROLE, msg.sender), "ONLY AUTHORIZED ENTITIES CAN INVALIDATE A CERTIFICATION");
    certificates[qrcode].invalidated = true;
  }

}