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

    enum Colors {WHITE, YELLOW, ORANGE}

    mapping (Regions => Colors) public colors;

    constructor() {
        colors[Regions.ABRUZZO] = Colors.WHITE;
        colors[Regions.BASILICATA] = Colors.WHITE;
        colors[Regions.CALABRIA] = Colors.WHITE;
        colors[Regions.CAMPANIA] = Colors.WHITE;
        colors[Regions.EMILIA_ROMAGNA] = Colors.WHITE;
        colors[Regions.FRIULI_VENEZIA_GIULIA] = Colors.WHITE;
        colors[Regions.LAZIO] = Colors.WHITE;
        colors[Regions.LIGURIA] = Colors.WHITE;
        colors[Regions.LOMBARDIA] = Colors.WHITE;
        colors[Regions.MARCHE] = Colors.WHITE;
        colors[Regions.MOLISE] = Colors.WHITE;
        colors[Regions.PIEMONTE] = Colors.WHITE;
        colors[Regions.PUGLIA] = Colors.WHITE;
        colors[Regions.SARDEGNA] = Colors.WHITE;
        colors[Regions.SICILIA] = Colors.WHITE;
        colors[Regions.TOSCANA] = Colors.WHITE;
        colors[Regions.TRENTINO_ALTO_ADIGE] = Colors.WHITE;
        colors[Regions.UMBRIA] = Colors.WHITE;
        colors[Regions.VALLE_DAOSTA] = Colors.WHITE;
        colors[Regions.VENETO] = Colors.WHITE;
    }
}