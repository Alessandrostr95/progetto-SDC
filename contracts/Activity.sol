// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * @notice Le attività in questione prendono spunto dalla seguente <a href="https://www.governo.it/sites/governo.it/files/documenti/documenti/Notizie-allegati/tabella_attivita_consentite.pdf">tabella</a>
 */
contract Activity {
    enum Activities {
        MEZZI_PUBBLICI,
        LAVORO,
        NEGOZI_E_UFFICI,
        SCUOLE_E_UNIVERSITA,
        STRUTTURE_SANITARIE,
        BAR_E_RISTORANTI,
        ATTIVITA_SPORTIVE,
        EVENTI_SPORTIVI,
        EVENTI_CULTURALI,
        CERIMONIE,
        FESTE,
        CONVENGI_CONGRESSI_FIERE,
        ATTIVITA_LUDICHE_CREATIVE
    }
}