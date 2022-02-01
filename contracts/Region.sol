// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Region {
    enum Regions {
        ABRUZZO,
        BASILICATA,
        CALABRIA,
        CAMPANIA,
        EMILIA_ROMAGNA,
        FRIULI_VENEZIA_GIULIA,
        LAZIO,
        LIGURIA,
        LOMBARDIA,
        MARCHE,
        MOLISE,
        PIEMONTE,
        PUGLIA,
        SARDEGNA,
        SICILIA,
        TOSCANA,
        TRENTINO_ALTO_ADIGE,
        UMBRIA,
        VALLE_DAOSTA,
        VENETO
    }

    enum Colors {WHITE, YELLOW, ORANGE, RED}

    mapping (Regions => Colors) public colors;

    constructor() {
        colors[Regions.ABRUZZO] = Colors.ORANGE;
        colors[Regions.BASILICATA] = Colors.WHITE;
        colors[Regions.CALABRIA] = Colors.YELLOW;
        colors[Regions.CAMPANIA] = Colors.YELLOW;
        colors[Regions.EMILIA_ROMAGNA] = Colors.YELLOW;
        colors[Regions.FRIULI_VENEZIA_GIULIA] = Colors.ORANGE;
        colors[Regions.LAZIO] = Colors.YELLOW;
        colors[Regions.LIGURIA] = Colors.YELLOW;
        colors[Regions.LOMBARDIA] = Colors.YELLOW;
        colors[Regions.MARCHE] = Colors.YELLOW;
        colors[Regions.MOLISE] = Colors.WHITE;
        colors[Regions.PIEMONTE] = Colors.ORANGE;
        colors[Regions.PUGLIA] = Colors.YELLOW;
        colors[Regions.SARDEGNA] = Colors.YELLOW;
        colors[Regions.SICILIA] = Colors.ORANGE;
        colors[Regions.TOSCANA] = Colors.YELLOW;
        colors[Regions.TRENTINO_ALTO_ADIGE] = Colors.YELLOW;
        colors[Regions.UMBRIA] = Colors.WHITE;
        colors[Regions.VALLE_DAOSTA] = Colors.ORANGE;
        colors[Regions.VENETO] = Colors.YELLOW;
    }
}