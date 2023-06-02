const DatiCopione = [];

function AggiornaTestoGuida() {
    clearTimeout(AggiornaTestoGuida.tmr);
    AggiornaTestoGuida.tmr = setTimeout(() => {
        const MinutaggioAttuale = VideoGuidaMinutaggioCorrente();
        while(BT = DatiCopione.find(el => (((MinutaggioAttuale - 30) < el.minutaggio) && (el.minutaggio < (MinutaggioAttuale + 30))))) {
            Testo += BT.testo;
        }
        TestoGuida.innerText = Testo;
    }, 1000);
}
AggiornaTestoGuida.tmr = false;