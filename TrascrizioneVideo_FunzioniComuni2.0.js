const DatiCopione = [];

function AggiornaTestoGuida() {
    clearTimeout(AggiornaTestoGuida.tmr);
    AggiornaTestoGuida.tmr = setTimeout(() => {
        const MinutaggioAttuale = VideoGuidaMinutaggioCorrente(), MinutiRange = 15;
        var Testo = "";
        DatiCopione.sort((a, b) => {return a.minutaggio - b.minutaggio});
        const MappaRange = DatiCopione.map( el => (((MinutaggioAttuale - MinutiRange) < el.minutaggio) && (el.minutaggio < (+MinutaggioAttuale + MinutiRange))) );
        const PrimoElemento = MappaRange.indexOf(true), UltimoElemento = MappaRange.lastIndexOf(true);
        for (let I = PrimoElemento; I <= UltimoElemento; I++) {
            Testo += "\n" + DatiCopione[I].testo;
        }
        TestoGuida.innerText = Testo.trim();
    }, 1000);
}
AggiornaTestoGuida.tmr = false;