const DatiCopione = [];

function AggiornaTestoGuida() {
    clearTimeout(AggiornaTestoGuida.tmr);
    AggiornaTestoGuida.tmr = setTimeout(() => {
        const MinutaggioAttuale = VideoGuidaMinutaggioCorrente();
        var Testo = "";
        for (let M = MinutaggioAttuale - 30; (M < (+MinutaggioAttuale + 30)) && (BT = DatiCopione.find(el => el.minutaggio < M)); M++) {
            Testo += BT.testo;
        }
        TestoGuida.innerText = Testo;
    }, 1000);
}
AggiornaTestoGuida.tmr = false;