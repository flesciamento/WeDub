var worker, running = false, isWorkerLoaded = false, Comando = "", T, log_ffmpeg = "", FileGenerati = 0, ffmpeg_TotaleProcessi = 0, ffmpeg_Processi = [], ffmpeg_FunzioneAlTermineProcessi, Registrazione, OndaSonora, MemoriaAllocataWorker = Math.pow(6 * 2048, 2);

function isReady() {
	return !running && isWorkerLoaded;
}

function startRunning() {
	running = true;
}
function stopRunning() {
	running = false;
}

function parseArguments(text) {
  text = text.replace(/\s+/g, ' ');
  var args = [];
  // Allow double quotes to not split args.
  text.split('"').forEach(function(t, i) {
    t = t.trim();
    if ((i % 2) === 1) {
      args.push(t);
    } else {
      args = args.concat(t.split(" "));
    }
  });
  return args;
}


function runCommand(text) {
  if (isReady()) {
    startRunning();
    Comando = text; // Memorizza il comando in caso di errori (v. funzione Riprova)
    var args = parseArguments(text);
    log_ffmpeg += "\n" + args;

    DatiFiles = []; DatiFiles[0] = [];
    DatiFiles[0].name = "clip1";
    DatiFiles[0].data = sampleAudioData;
	
    log_ffmpeg += "\n" + DatiFiles;
    
    worker.postMessage({
			type: "command",
			arguments: args,
			files: DatiFiles,
			MemoriaAllocataWorker: MemoriaAllocataWorker
	});
		
  } else {
	  log_ffmpeg += "\nNon ancora pronto, riprovo.";
	  setTimeout(function () {runCommand(text);}, 2000);
  }
}

function getDownloadLink(fileData, fileName) {
    var a = document.createElement('a');
    a.download = fileName;
    var blob = new Blob([fileData]);
    var src = window.URL.createObjectURL(blob);
    a.href = src;
    a.textContent = strCliccaDownloadFile;
    a.className = "btn btn-success";
    return a;
}

function initWorker() {
    worker = new Worker("./RenderingAudio/wasm-build/build_all_codecs/wasm/worker-wasm.js");
    worker.onmessage = function (event) {
        var message = event.data;
        switch(message.type) {
            case "ready":
                isWorkerLoaded = true;
                break;

            case "start": 
                log_ffmpeg += "\nWorker ha ricevuto il comando";
                Messaggio(strElaborazioneInCorso);
                break;
            
            case "stdout":
                log_ffmpeg += "\n" + message.data;

                if ((message.data.indexOf('Input #')) > -1) {
                    ComparsaBarraCaricamento();
                    BC.style.transition = "all 1s";
                    VisualizzaProgressoBarraCaricamento(BC, 0.8 + (0.1 * FileGenerati));
                }

                if (message.data.indexOf('Output #0') > -1) {
                    if (++FileGenerati == ffmpeg_TotaleProcessi) {Messaggio(strElaborazioneCompletata, "OK"); VisualizzaProgressoBarraCaricamento(BC, 1);}
                }

                if (message.data.indexOf('Cannot enlarge memory arrays') > -1) {
                    Riprova();
                }
                break;

            case "done":
                var buffers = message.data;
                if (!buffers.length) {
                    Messaggio(strErroreElaborazione, "A");
                }
                
                buffers.forEach(function(file) {
                    log_ffmpeg += "\n" + file.name;

                    var blob = new Blob([file.data]);
                    var reader = new FileReader();
                    
                    reader.onloadend = function () {
                        if (file.name.slice(-4) == ".gif") {
                            OndaSonora = this.result;
                            ControllaTermineProcesso();
                        } else {
                            Registrazione = this.result;
                            ControllaTermineProcesso();
                        }
                    }
                    
                    reader.error = function (e) {
                        log_ffmpeg += "\nerrore reader: " + e;
                    }

                    reader.readAsDataURL(blob);                    
                });
                
                stopRunning();
        }
    };

    worker.onerror = function (e) {
        log_ffmpeg += "\nIntercettato errore worker: " + e;
        Riprova();
    };

    function Riprova() {
        if (typeof initWorker.IncrementoMemoria == 'undefined') {initWorker.IncrementoMemoria = 6;} initWorker.IncrementoMemoria += 6;
        Messaggio(strErroreRisolvibile, "A"); running = false; worker.terminate(); initWorker();
        
        MemoriaAllocataWorker = Math.pow(initWorker.IncrementoMemoria * 2048, 2);
        runCommand(Comando);
        T = setTimeout(function () {Messaggio(strAttimoPazienza);}, 15000);
        log_ffmpeg += "\nNuovo tentativo in corso: " + MemoriaAllocataWorker;
    }
}

function ControllaTermineProcesso() {
    if (FileGenerati == ffmpeg_TotaleProcessi) {
        ffmpeg_FunzioneAlTermineProcessi(Registrazione, OndaSonora);
        FileGenerati = 0; sampleAudioData = []; Registrazione = ""; OndaSonora = "";
    }
}