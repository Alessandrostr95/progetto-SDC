// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @dev contratto utile a gestire i ruoli dei diversi indirizzi
 */
contract RolesManager is AccessControl {
  // ROLES
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant CERTIFICATION_MINTER_ROLE = keccak256("CERTIFICATION_MINTER_ROLE");
  bytes32 public constant PUBLIC_ADMINISTRATION_ROLE = keccak256("PUBLIC_ADMINISTRATION_ROLE");

  constructor () {
    _setupRole(ADMIN_ROLE, msg.sender);
  }

  /**
   * @dev funzione che assegna il ruolo `CERTIFICATION_MINTER_ROLE` che consente ad un indirizzo di generare nuovi certificati.
   * Questo metodo può essere invocato solamente dagli indirizzi con il ruolo `ADMIN_ROLE`.
   * @param to indirizzo a cui assegnare ruolo `CERTIFICATION_MINTER_ROLE`.
   */
  function grantCertificationMinterRole(address to) public onlyRole(ADMIN_ROLE) {
    _grantRole(CERTIFICATION_MINTER_ROLE, to);
  }

  /**
   * @dev funzione che revoca il ruolo `CERTIFICATION_MINTER_ROLE` ad un indirizzo.
   * Questo metodo può essere invocato solamente dagli indirizzi con il ruolo `ADMIN_ROLE`.
   * See {grantCertificationMinterRole}.
   * @param to indirizzo a cui assegnare ruolo `CERTIFICATION_MINTER_ROLE`.
   */
  function revokeCertificationMinterRole(address to) public onlyRole(ADMIN_ROLE) {
    _revokeRole(CERTIFICATION_MINTER_ROLE, to);
  }

  /**
   * @dev funzione che assegna il ruolo `PUBLIC_ADMINISTRATION_ROLE` che consente di gestire le regole e i colori delle regioni.
   * Questo metodo può essere invocato solamente dagli indirizzi con il ruolo `ADMIN_ROLE`.
   * @param to indirizzo a cui assegnare ruolo `PUBLIC_ADMINISTRATION_ROLE`.
   */
  function grantPublicAdministrationRole(address to) public onlyRole(ADMIN_ROLE) {
    _grantRole(PUBLIC_ADMINISTRATION_ROLE, to);
  }

  /**
   * @dev funzione che revoca il ruolo `PUBLIC_ADMINISTRATION_ROLE` ad un indirizzo.
   * Questo metodo può essere invocato solamente dagli indirizzi con il ruolo `ADMIN_ROLE`.
   * See {grantCertificationMinterRole}.
   * @param to indirizzo a cui assegnare ruolo `PUBLIC_ADMINISTRATION_ROLE`.
   */
  function revokePublicAdministrationRole(address to) public onlyRole(ADMIN_ROLE) {
    _revokeRole(PUBLIC_ADMINISTRATION_ROLE, to);
  }
}
