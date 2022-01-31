# Progetto-SDC
Progetto Sistemi Distribuiti Coperativi @TorVergata, A.A. 21/22, Alessandro Straziota e Michele Cirillo.

## Idea Progetto
Questo progetto vuole offrire delle utilities che consentano, tramite utilizzo di tecnologia blockchain-ethereum,
di verificare se una data certificazione verde (o greepass) è valida per il regolare svolgimento di un'attività.

Per esempio, secondo [questa tabella](https://www.governo.it/sites/governo.it/files/documenti/documenti/Notizie-allegati/tabella_attivita_consentite.pdf), se si volesse consumare una birra al bancone di un bar al chiuso in zona aranciano, si necessiterebbe di un **greepass rafforzato**.
Per via della confusione che potrebbe crearsi nell'interpretare tutti i casi possibili sarebbe utile uno strumento che consenta a chiunque, data una certificazione, un'attività e una zona, poter constatare l'effettiva possibilità di svolgere l'attività desiderata.
Tale strumento sarebbe utile anche ai gestori di attività per verificare se la certificazione di un cliente è valida per la propria attività, senza il rischio di cadere in incomprensioni o ambiguità.

Lo strumento in questione è sviluppato sottoforma di smart-contract ethereum, e in quanto tale garantice l'immutabilità delle informazioni.
Inoltre la creazione di nuove certificazioni è autorizzata dalle sole chiavi associate agli enti di competenza. garantendo così l'originalità dei greenpass.

Infine il proprietario dello smart-constract (lo stato), ha la possibilità di definire e modificare i colori delle regioni, e anche di potter aggiungere o rimuovere le chiavi che hanno il permesso rilasciare il greenpass.
