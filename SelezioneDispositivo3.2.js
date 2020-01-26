var SelezioneMicrofono = document.getElementById('SorgenteAudio');
var SelezioneWebcam = document.getElementById('SorgenteVideo');
var selectors = [SelezioneMicrofono, SelezioneWebcam];

function AcquisisciDispositivi(deviceInfos) {
  var values = selectors.map(function(select) {
    return select.value;
  });
  selectors.forEach(function(select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  }); 
  
  CreaElemento('option', 'NessunaWebCam', 'SorgenteVideo', 'Disattivata');
  
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    if (!deviceInfo.label) {window.setTimeout(AggiornaElencoDispositivi, 500);}
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || 'microfono ' + (SelezioneMicrofono.length + 1);
      SelezioneMicrofono.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'camera ' + (SelezioneWebcam.length + 1);
      SelezioneWebcam.appendChild(option);
    } /* else {
      console.log('Altri dispositivi: ', deviceInfo);
    } */
  }
  
  selectors.forEach(function(select, selectorIndex) {
    if (Array.prototype.slice.call(select.childNodes).some(function(n) {
      return n.value === values[selectorIndex];
    })) {
      select.value = values[selectorIndex];
    }
  });

 }

SelezioneMicrofono.onchange = AggiornaDispositivi;
SelezioneWebcam.onchange = AggiornaDispositivi;
