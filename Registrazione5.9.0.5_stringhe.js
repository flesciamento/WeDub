const strAttesa = new Array("Ricordati di consentire l'utilizzo del microfono quando richiesto dal browser.",
						    "Il filmato da doppiare si sta caricando, una volta caricato potrai scegliere il punto che ti interessa e cominciare a registrare da lì",
						    "Una volta che hai registrato, puoi riascoltarti quante volte vuoi per decidere se rifare o tenere.",
						    "Cliccando sulla clip registrata aprirai la finestra con tutte le opzioni: potrai spostarla, cambiare il volume, ascoltarla in singolo, ecc.",
						    "Se ci sta mettendo troppo a caricarsi, prova a ricaricare la pagina (premendo [F5])<br />Attenzione: se il problema persiste il filmato potrebbe essere stato rimosso dalla piattaforma!"
);

const strAttesaAndroid = new Array("Per una migliore esperienza utente <b>premi su <span class='fa fa-ellipsis-v'></span> e seleziona: 'Aggiungi a schermata Home'</b>. Avrai la comodità dell'app senza dovere installare nulla, né occupare spazio nella memoria del tuo dispositivo!",
                                   "Ricordati di consentire l'utilizzo del microfono quando richiesto dal browser.",
                                   "Il filmato da doppiare si sta caricando, una volta caricato potrai scegliere il punto che ti interessa e cominciare a registrare da lì",
                                   "Premendo sulla clip registrata aprirai la finestra con tutte le opzioni: potrai spostarla, cambiare il volume, ascoltarla in singolo, ecc.",
                                   "Se ci sta mettendo troppo a caricarsi, prova a ricaricare la pagina (premendo su <span class='fa fa-repeat'></span>)<br />Attenzione: se il problema persiste il filmato potrebbe essere stato rimosso dalla piattaforma!"
);

const strAttesaOspite = new Array("We Dub sta caricando il filmato e le clip audio registrate dai doppiatori.",
                                  "We Dub consente di visualizzare i progetti di doppiaggio una volta completati, anche a coloro che non fanno parte del progetto.",
                                  "Per qualunque feedback o se vuoi rimanere aggiornato iscriviti alla <a href='https://www.facebook.com/WeDubCommunity/' target='_blank'>pagina Facebook</a> o al <a href='https://t.me/WeDubCommunity' target='_blank'>Canale Telegram: '<b>WeDubCommunity</b>'</a>",
                                  "We Dub è libero e gratuito, <a href='https://wedub.altervista.org' target='_blank'>iscriviti anche tu</a> per gestire i tuoi progetti di doppiaggio!",
                                  "Se ci sta mettendo troppo a caricarsi, prova a ricaricare la pagina (premendo [F5])<br />Attenzione: se il problema persiste il filmato potrebbe essere stato rimosso dalla piattaforma!"
);

const strAttesaStreaming = new Array("We Dub sta caricando il filmato e le clip audio registrate dai doppiatori.",
                                     "We Dub genera automaticamente il filmato con le voci dei doppiatori e lo rende pubblico una volta che il doppiaggio è completato!",
                                     "Per qualunque feedback o se vuoi rimanere aggiornato iscriviti alla <a href='https://www.facebook.com/WeDubCommunity/' target='_blank'>pagina Facebook</a> o al <a href='https://t.me/WeDubCommunity' target='_blank'>Canale Telegram: '<b>WeDubCommunity</b>'</a>",
                                     "Con We Dub puoi registrare in sync con il filmato, vedere e ascoltare immediatamente il tuo doppiaggio, seguire e dirigere i doppiatori nel tuo progetto in tempo reale e tanto altro!",
                                     "We Dub è libero e gratuito, <a href='https://wedub.altervista.org' target='_blank'>iscriviti anche tu</a> per gestire i tuoi progetti di doppiaggio!"
);

const strConsiglio = "Consiglio";
const strWebAudioAPINonSupportata = "Web Audio API non supportata! Non sei in grado di usare questo editor con questo browser. Si consiglia una versione aggiornata di Firefox o Chrome.";
const strVisualizzaASchermoIntero = "Visualizza a schermo intero";
const strSalvataggioInCorso = "È in corso il salvataggio...";
const strSalvataggioCompletato = "Salvataggio completato!";
const strTuaRegistrazione = "Tua registrazione";
const strClipDi = "Clip di ";
const strCreazioneCompletata = "Creazione completata!";
const strScaricaQuiAudio = "Scarica qui il file audio";
const strElaborazioneFileInCorso = "Elaborazione del file in corso...";
const strVolumeFilmato = "Volume del filmato:";
const strVolumeInternazionale = "Volume internazionale:";
const strDisattivaColonnaInternazionale = "Colonna internazionale attivata";
const strAttivaColonnaInternazionale = "Attiva colonna internazionale";
const strBattute = "Battute";
const strRegistrazioneAnnullata = "Registrazione annullata.";
const strCreazioneZipInCorso = "Creazione del file zip con tutte le battute in corso...";
const strCreazioneZipCompletata = "Creazione del file zip completata!";
const strScaricaQuiZip = "Scarica qui tutte le battute della traccia";
const strCancellaClip = "Cancella questa clip (rimarrà nel cestino per 2 giorni)";
const strRipristinaClip = "Ripristina questa clip audio dal cestino";
const strDuplicaClip = "Duplica questa clip";
const strDuplicaClip_lblPulsante = " Duplica";
const strDuplicazioneClip = "Duplicazione della clip...";
const strClipDuplicata = "Clip duplicata!";
const strDividiClip = "Dividi clip";
const strDivisioneClip = "Divisione della clip...";
const strClipDivisa = "Clip divisa in due parti!";
const strAggiornamento = "Aggiornamento...";
const strCaricamento = "Caricamento...";
const strCaricamentoPrimeClip = "Caricamento clip dei doppiatori in corso...";
const strCaricamentoCompletato = "Caricamento completato!";
const strAttendereFineCaricamento = "Attendere la fine del caricamento - ancora qualche secondo...";
const strBrowserNonAdatto = "Caricamento interrotto. Usa uno dei browser consigliati.";
const strModalitaVisualizzazione = "Modalità visualizzazione";
const strNonHaiNessunRuolo = "Non hai nessun ruolo in questo doppiaggio.";
const strPuoiSoloVisualizzare = "Puoi solo visualizzare l'andamento del progetto.";
const strPoteriCreatoreProgetto = "In quanto creatore dell'attuale progetto puoi gestire tutte le tracce!";
const strInElaborazione = "in elaborazione...";
const strOpzioniTraccia = "Opzioni clip audio";
const strMinuti = "Minuti";
const strSecondi = "Secondi";
const strPosizione = "Posizione:";
const strVolume = "Volume:";
const strTaglioIniziale = "Inizia da:";
const strTaglioFinale = "Termina a:";
const strApplicaUnEffetto = "Applica un effetto:";
const strEffettoRadio = "Effetto radio";
const strEffettoOvattato = "Effetto ovattato";
const strEffettoEco = "Eco";
const strEffettoRiverbero = "Riverbero";
const strAscoltaClip = "Ascolta la clip";
const strSoloTaglio = "Solo la parte tagliata";
const strDaInizioAFine = "Dall'inizio alla fine";
const strInterrompiAscolto = "Interrompi";
const strScaricaRegistrazione = "Scarica registrazione";
const strLasciaCommentoAlDoppiatore = "Lascia un commento al doppiatore...";
const strLasciaCommentoAlCreatoreProgetto = "Lascia un commento al creatore del progetto...";
const strAnnullalemodifiche = "Annulla le modifiche";
const strSalva = "SALVA";
const strInvioInCorso = "Invio in corso...";
const strInviato = "Inviato.";
const strHaiPremuto = "Hai premuto";
const strSpiegazioneTastoZoom = "muovi la rotellina del mouse per cambiare lo zoom";
const strSpiegazioneTastoSeleziona = "stai utilizzando lo strumento di default 'Seleziona' col quale puoi selezionare le clip per agire sulle proprietà o spostarle a piacimento.";
const strSpiegazioneTastoDividiClip = "hai selezionato lo strumento 'Dividi clip'! Posiziona il mouse su una clip e clicca per dividerla in due parti nel punto desiderato. Per tornare allo strumento di default premi S.";
const strSpiegazioneTastoEscludiClip = "hai selezionato lo strumento 'Silenzia clip'! Clicca sulle clip che vuoi temporaneamente mettere in muto. Riclicca per togliere il muto. Utile per scegliere tra più clip sovrapposte. Per tornare allo strumento di default premi S.";
const strSpiegazioneTastoRegistra = "hai avviato la registrazione.<br />Per annullare premi <a class='btn btn-default'>CANC</a> o <img src='images/x-rossa.png' height='30' /><br />Per salvare premi <a class='btn btn-default'>SPAZIO</a> o <img src='images/red-stop-button-spigoloso.png' height='30' />.";
const strSpiegazioneTastoRegistraMessaggioIstantaneo = "tieni premuto per mandare un vocale istantaneo a tutti gli utenti che sono attualmente collegati insieme a te! Rilascia quando hai terminato.";
const strScaricaClipOriginale = "Scarica il file della registrazione originale";
const strScaricaClipConversione = "Crea un file audio con gli effetti attualmente applicati";
const strTuMessaggioVocale = "Tu";
const strParlaCon = "Parla con ";
const strMessaggioVocaleVariUtentiOnline = "Vari utenti sono attualmente in questo progetto";
const strMessaggioVocaleSingoloUtenteOnline = " è attualmente online!";
const strPulMessaggioVocaleDefault = "Parla coi doppiatori online";
const strPulMessaggioVocaleNessuno = "Nessun doppiatore online";
const strSelMessaggioVocaleTutti = "Tutti gli utenti online";
const strMessaggioVocaleRiprodottoDopoRegistrazione = " ti ha inviato un messaggio vocale. Verrà riprodotto dopo il doppiaggio.";
const strElencoCandidatiDaAssegnare = "Elenco candidati per i ruoli da assegnare:";
const strNessunCandidato = "Ancora nessun candidato si è proposto per questi ruoli.";
const strNuoveClip = "Nuove clip";
const strIndicaRuoliDaAssegnare = "Indica i personaggi rimasti liberi che devi ancora assegnare: ";
const strStaiAggiungendoUtente = "Stai aggiungendo l'utente ";
const strNelCast = "nel cast";
const strNuoveClipDa = "nuove clip da ";
const strCandidat = "candidat";
const strDescriviPersonaggiDoppiatiDa = "Descrivi i personaggi doppiati da ";
const strVoglioEliminareRuoliDaAssegnare = ' Ho trovato chi cercavo, si può eliminare la traccia "Ruoli da assegnare"';
const strVoglioMantenereRuoliDaAssegnare = ' Sto ancora cercando altri personaggi, mantieni la traccia "Ruoli da assegnare"';
const strProcedi = "PROCEDI";
const strErroreMic = "Riscontrato errore con il microfono: ";
const strModalitaLightAttiva = "Modalità Light";
const strModalitaUltraLightAttiva = "Modalità Ultra-Light";

const Sugg_OpzioniClip_TrascinamentoClip = "Se vuoi puoi spostare la clip manualmente trascinandola col mouse";
const Sugg_OpzioniClip_SpostamentoMinSec = "Puoi anche spostare la clip con maggiore precisione<br />modificando minuti e secondi";
const Sugg_OpzioniClip_SpiegaPossibilita = "Inoltre, da questa finestra puoi modificare volume, taglio iniziale e finale, aggiungere effetti, e tanto altro.";
const Sugg_OpzioniClip_ComeCestinareClip = "Se vuoi eliminare la clip, puoi cliccare su questo pulsante.<br />La clip rimarrà nel cestino per 2 giorni.<br />In questo periodo può essere eventualmente recuperata.";
const Sugg_OpzioniClip_SalvareOAnnullare = "Puoi fare tutte le prove che vuoi, quando hai finito puoi scegliere se <b>Salvare</b> oppure <b>Annullare le modifiche</b>.";

const Sugg_CestinaClip_DoveSonoLeClip = "Le clip cestinate non vengono immediatamente eliminate, ma finiscono, appunto, in questo cestino.";
const Sugg_CestinaClip_VisualizzaClip = "Clicca sul cestino per visualizzare tutte le clip cestinate. Si disporranno al loro posto sulla timeline, le noterai perché sono semitrasparenti.";
const Sugg_CestinaClip_RimettiCestino = "Puoi selezionare una clip cestinata e, dalla finestrella delle opzioni, eventualmente scegliere di ripristinarla premendo <a class='btn btn-info fa fa-undo'></a>.<br />Riclicca sul pulsante del cestino per rimettere le clip nel cestino e pulire la timeline.";
const Sugg_CestinaClip_GiorniEliminaz = "Le clip rimarranno nel cestino per 2 giorni prima di essere definitivamente eliminate.";

const suffissoMaschilePlurale = "i", suffissoMaschileSingolare = "o";