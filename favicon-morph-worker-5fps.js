// Background ticks may be throttled or suspended by the browser.
let timer = null;
self.onmessage = (event) => {
    if (event.data === 'start' && timer === null) {
        self.postMessage('tick');
        timer = setInterval(() => self.postMessage('tick'), 200);
    } else if (event.data === 'stop' && timer !== null) {
        clearInterval(timer);
        timer = null;
    }
};
