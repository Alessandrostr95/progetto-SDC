// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import './RolesManager.sol';
import './Certification.sol';
import './Region.sol';
import './Activity.sol';

/**
 * @title GreenPassCertification contract
 * @author Alessandro Straziota, Michele Cirillo
 * @notice Contratto che offre strumenti utili per la verifica della validità dei green pass rispetto a determinate attività.
 * @dev Contratto che offre strumenti utili per la verifica della validità dei green pass rispetto a determinate attività.
 */
contract GreenPassCertification is RolesManager, Certification, Region, Activity {

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

  /// *********

  /**
   * @dev Funzione che assegna il colore `color` alla regione `region`.
   * Solo un indirizzo con ruolo `ADMIN_ROLE` può invocare questa funzione.
   */
  function setRegionColor(Regions region, Colors color) public onlyRole(ADMIN_ROLE) {
    colors[region] = color;
  }

  /// *********
  /// RULES
  using EnumerableSet for EnumerableSet.Bytes32Set;
  
  /**
   * @dev struct che definisce una regola `Rule`.
   * Per regola si intende un insieme composto da:
   *  - un tipo di certificato `certificationType:CertificationType`
   *  - un colore di regione `colro:Colors`
   *  - un'attività `activity:Activities`
   * Se una regola `R` è presente nell'insieme delle regole valide, allora un utente
   * avente il green pass di tipo `R.certificationType` potrà svolgere l'attività `R.activity`
   * in una regione colorata del colore `R.color`.
   */
  struct Rule {
    CertificationType certificationType;
    Colors color;
    Activities activity;
  }

  /**
   * Se una regola `R` è presente nell'insieme delle regole valide, allora un utente
   * avente il green pass di tipo `R.certificationType` potrà svolgere l'attività `R.activity`
   * in una regione colorata del colore `R.color`.
   */
  mapping (bytes32 => Rule) private _rules;
  EnumerableSet.Bytes32Set private _rulesSet;

  /**
   * @dev funzione che aggiunge una nuova regola all'insieme di regole valide.
   * Solo un indirizzo con ruolo `ADMIN_ROLE` può invocare questa funzione.
   * @param certificationType il tipo della certificazione.
   * @param color il colore della regione.
   * @param activity l'attività in questione.
   */
  function addRole(CertificationType certificationType, Colors color, Activities activity) public onlyRole(ADMIN_ROLE) {
    Rule memory role = Rule(certificationType, color, activity);
    bytes32 key = keccak256( abi.encodePacked(role.certificationType, role.color, role.activity) );
    _rules[key] = role;
    EnumerableSet.add(_rulesSet, key);
  }

  /**
   * @dev funzione che rimuove una regola all'insieme di regole valide.
   * Solo un indirizzo con ruolo `ADMIN_ROLE` può invocare questa funzione.
   * @param certificationType il tipo della certificazione.
   * @param color il colore della regione.
   * @param activity l'attività in questione.
   */
  function removeRole(CertificationType certificationType, Colors color, Activities activity) public onlyRole(ADMIN_ROLE) {
    Rule memory role = Rule(certificationType, color, activity);
    bytes32 key = keccak256( abi.encodePacked(role.certificationType, role.color, role.activity) );
    if( EnumerableSet.remove(_rulesSet, key) ) {
      delete _rules[key];
    }
  }

  /// *********
  /// QUERY

  /**
   * @dev funzione che dato un codice QR relativo a un greenpass ritorna `true` se è consentito
   * effettuare una data attività `activity` in una data regione `region`.
   * @param qrcode il qrcode di un greenpass.
   * @param activity l'attività che si desidera svolgare.
   * @param region la regione in cui si desidera svolgere l'attività.
   * @return `true` se è consentito svolgere tale attività, `false` altrimenti.
   */
  function canDo(string memory qrcode, Activities activity, Regions region) public view returns (bool) {
    GreenPass memory greenPass = certificates[qrcode]; // verificare che succede se non esiste il green pass in questione.
    if (isExpired(qrcode) || greenPass.invalidated) {
      return false;
    }
    
    Colors regionColors = colors[region];
    Rule memory role = Rule(greenPass.certificationType, regionColors, activity);
    bytes32 key = keccak256( abi.encodePacked(role.certificationType, role.color, role.activity) );
    
    if ( EnumerableSet.contains(_rulesSet, key) ) return true;
    else return false; 
  }

}