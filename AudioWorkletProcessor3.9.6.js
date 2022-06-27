/* Thanks to flpvsk for his example: https://gist.github.com/flpvsk/047140b31c968001dc563998f7440cc1 */

class RecorderWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._bufferSize = 2048;
    this.numCanale = 0;
    this._buffer = new Float32Array(this._bufferSize);
    this._initBuffer();
    this.FunzioneProcesso = this.Monitora;
    this.Registrazione = [];

    this.port.onmessage = (e) => {
        this.numCanale = e.data.numCanale;

        switch (e.data.modalita) {
            case "Monitoraggio":
                this._bufferSize = e.data.bufferSize;
                this._buffer = new Float32Array(this._bufferSize);
                this._initBuffer();
                this.FunzioneProcesso = this.Monitora;
                break;

            case "Registrazione":
                this.FunzioneProcesso = this.Registra;
                break;

            case "AcquisisciRegistrazione":
                this.FunzioneProcesso = function () {return true};
                this.port.postMessage({audioRegistrato: this.Registrazione});
                this.Registrazione = [];
                break;

            case "Scollega":
                this.FunzioneProcesso = this.Scollega;
                break;
        }
    };
  }

  _initBuffer() {
    this._bytesWritten = 0;
  }

  _isBufferEmpty() {
    return this._bytesWritten === 0;
  }

  _isBufferFull() {
    return this._bytesWritten >= this._bufferSize;
  }

  _appendToBuffer(value) {
    this._buffer[this._bytesWritten++] = value;
  }

  _flush() {
    this.port.postMessage({audioBuffer: this._buffer});

    this._initBuffer();
  }

  Monitora(inputCanale) {
    const totInputCanale = inputCanale.length;
    for (let i = 0; i < totInputCanale; i++) {
        this._appendToBuffer(inputCanale[i]);
    }

    if (this._isBufferFull()) {this._flush();}
    
    return true;
  }

  Registra(inputCanale) {
    this.Registrazione.push(inputCanale.slice());
    return true;
  }

  Scollega(inputCanale) {
    return false;
  }

  process(inputs, outputs, parameters) {
    return this.FunzioneProcesso(inputs[0][this.numCanale] || []);
  }

}

registerProcessor('recorder-worklet', RecorderWorkletProcessor);