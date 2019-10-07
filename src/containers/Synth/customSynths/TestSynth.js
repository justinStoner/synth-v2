import Tone from 'tone';


class TestSynth extends Tone.Monophonic {

  static defaults = {
    harmonicity: 3,
    modulationIndex: 10,
    detune: 0,
    carriers: [
      {
        oscillator: {
          type: 'sine',
        },
        envelope: {
          attack: 0.01,
          decay: 0.01,
          sustain: 1,
          release: 0.5,
        },
      },
      {
        oscillator: {
          type: 'square',
        },
        envelope: {
          attack: 0.01,
          decay: 0.01,
          sustain: 1,
          release: 0.5,
        },
      },
    ],
    modulation: {
      type: 'square',
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0.0,
      sustain: 1,
      release: 0.5,
    },
  };

  constructor(options) {
    options = Tone.defaultArg(options, TestSynth.defaults);
    super(options);

    this.carriers = [];

    options.carriers.forEach(c => {
      const carrier = new Tone.Synth(c);
      this.carriers.push({
        carrier,
        oscillator: carrier.oscillator,
        envelope: carrier.envelope.set(options.envelope),
      })
      carrier.volume.value = -10;
    });
    /**
	 *  The modulator voice.
	 *  @type {Tone.Synth}
	 *  @private
	 */
    this.modulator = new Tone.Synth(options.modulator);
    this.modulator.volume.value = -10;

    /**
	 *  The modulator's oscillator which is applied
	 *  to the amplitude of the oscillator
	 *  @type {Tone.Oscillator}
	 */
    this.modulation = this.modulator.oscillator.set(options.modulation);

    /**
	 *  The modulator's envelope
	 *  @type {Tone.Oscillator}
	 */
    this.modulationEnvelope = this.modulator.envelope.set(options.modulationEnvelope);

    /**
	 *  The frequency control.
	 *  @type {Frequency}
	 *  @signal
	 */
    this.frequency = new Tone.Signal(440, Tone.Type.Frequency);

    /**
	 *  The detune in cents
	 *  @type {Cents}
	 *  @signal
	 */
    this.detune = new Tone.Signal(options.detune, Tone.Type.Cents);

    /**
	 *  Harmonicity is the ratio between the two voices. A harmonicity of
	 *  1 is no change. Harmonicity = 2 means a change of an octave.
	 *  @type {Positive}
	 *  @signal
	 *  @example
	 * //pitch voice1 an octave below voice0
	 * synth.harmonicity.value = 0.5;
	 */
    this.harmonicity = new Tone.Multiply(options.harmonicity);
    this.harmonicity.units = Tone.Type.Positive;

    /**
	 *  The modulation index which essentially the depth or amount of the modulation. It is the
	 *  ratio of the frequency of the modulating signal (mf) to the amplitude of the
	 *  modulating signal (ma) -- as in ma/mf.
	 *	@type {Positive}
	 *	@signal
	 */
    this.modulationIndex = new Tone.Multiply(options.modulationIndex);
    this.modulationIndex.units = Tone.Type.Positive;

    this.modulationNode = new Tone.Gain(0);

    //control the two voices frequency
    this.frequency.fan(...this.carriers.map(c => c.carrier.frequency));
    this.frequency.chain(this.harmonicity, this.modulator.frequency);
    this.frequency.chain(this.modulationIndex, this.modulationNode);
    this.detune.fan(...this.carriers.map(c => c.carrier.frequency), this.modulator.detune);
    this.modulator.connect(this.modulationNode.gain);
    this.modulationNode.fan(...this.carriers.map(c => c.carrier.frequency));
    this.carriers.forEach(c => c.carrier.connect(this.output));
    this._readOnly(['frequency', 'harmonicity', 'modulationIndex', 'oscillator', 'envelope', 'modulation', 'modulationEnvelope', 'detune']);
  }

  _triggerEnvelopeAttack (time, velocity) {
    time = this.toSeconds(time);
    //the envelopes
    this.carriers.forEach(c => c.carrier._triggerEnvelopeAttack(time, velocity));
    this.modulator._triggerEnvelopeAttack(time);
    return this;
  }

  _triggerEnvelopeRelease (time){
    time = this.toSeconds(time);
    this.carriers.forEach(c => c.carrier._triggerEnvelopeRelease(time));
    this.modulator._triggerEnvelopeRelease(time);
    return this;
  }

  triggerAttack (note, time, velocity){
    this.log('triggerAttack', note, time, velocity);
    time = this.toSeconds(time);
    this._triggerEnvelopeAttack(time, velocity);
    this.setNote(note, time);
    return this;
  }

  triggerRelease (time){
    this.log('triggerRelease', time);
    time = this.toSeconds(time);
    this._triggerEnvelopeRelease(time);
    return this;
  }

  setNote = (note, time) => {
    time = this.toSeconds(time);
    if (this.portamento > 0 && this.getLevelAtTime(time) > 0.05){
      const portTime = this.toSeconds(this.portamento);
      this.frequency.exponentialRampTo(note, portTime, time);
    } else {
      this.frequency.setValueAtTime(note, time);
    }
    return this;
  }

  getLevelAtTime = (time, c) => {
    time = this.toSeconds(time)
    return c ? c.envelope.getValueAtTime(time) : this.carriers[0].envelope.getValueAtTime(time);
  }

  dispose () {
    super.dispose();
    this._writable(['frequency', 'harmonicity', 'modulationIndex', 'oscillator', 'envelope', 'modulation', 'modulationEnvelope', 'detune']);
    this.carriers.forEach(c => {c.dispose(); c = null});
    this.carrier = null;
    this.modulator.dispose();
    this.modulator = null;
    this.frequency.dispose();
    this.frequency = null;
    this.detune.dispose();
    this.detune = null;
    this.modulationIndex.dispose();
    this.modulationIndex = null;
    this.harmonicity.dispose();
    this.harmonicity = null;
    this.modulationNode.dispose();
    this.modulationNode = null;
    this.oscillatorA = null;
    this.envelope = null;
    this.modulationEnvelope = null;
    this.modulation = null;
    return this;
  }
}

export default TestSynth;