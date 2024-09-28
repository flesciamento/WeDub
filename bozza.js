var Attacco = true, attacchi = [], lunghezzaBuffer = b.length, SogliaAttacco = 0.1, LimiteSecondiSogliaAttacco = 0.4 * SampleRate, LimiteSecondiSogliaTermine = 0.5 * SampleRate;
for (let I = 0; I < lunghezzaBuffer; I++) {
    const sogliasuperata = ((Math.abs(b[I]) > SogliaAttacco) || (Math.abs(b[(+I) + (+LimiteSecondiSogliaAttacco)]) > SogliaAttacco));
    contSogliaNonRaggiunta = ++contSogliaNonRaggiunta * !sogliasuperata;
    const condizioneraggiunta = ((sogliasuperata) || (contSogliaNonRaggiunta < LimiteSecondiSogliaTermine));
    if (condizioneraggiunta) {if (Attacco) {Attacco = false; attacchi.push(I);}} else {if (!Attacco) {Attacco = true; attacchi.push(I);}}
}