const message = 'Hello World!';

const encoded = btoa(message);
console.log(encoded);

const decoded = atob(encoded);
console.log(decoded)
