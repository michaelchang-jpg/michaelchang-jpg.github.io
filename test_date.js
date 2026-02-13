const dA = new Date('2026.02.13'.replace(/\./g, '-'));
const dB = new Date('2026.02.10'.replace(/\./g, '-'));
console.log('dA:', dA, dA.getTime());
console.log('dB:', dB, dB.getTime());
console.log('dB - dA:', dB.getTime() - dA.getTime());
