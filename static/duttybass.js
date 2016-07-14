const context = new AudioContext();

// gain
// const gainNode = context.createGain();
// gainNode.gain.value = 0.5;
// gainNode.connect(context.destination);

// filter
const filterNode = context.createBiquadFilter();
filterNode.type = 'lowpass';
filterNode.frequency.value = 5000;
filterNode.connect(context.destination);

// setup oscillator
const oscillator = context.createOscillator();
oscillator.type = 'square';
oscillator.frequency.value = 100;
//oscillator.connect(gainNode);
oscillator.connect(filterNode);
oscillator.start(context.currentTime);

// // temp inputs //
// const gain = document.getElementById('gainValue');
// const frequency = document.getElementById('frequencyValue');

// gain.addEventListener('input', function(event) {
// 	setIntensity(event.target.value);
// })

// frequency.addEventListener('input', function(event) {
// 	setFrequency(event.target.value);
// })

function setIntensity(intensity) {
	// gainNode.gain.value = intensity;
	// turn intensity into frequency
	filterNode.frequency.value = intensity;
}

function setFrequency(intensity) {
	// turn intensity into frequency
	const frequency = intensity;
	oscillator.frequency.value = frequency;
}