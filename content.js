'use strict';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'extractText') {
        var videoElement = document.querySelector('video');

        if (videoElement) {
            var playerContainer = document.getElementById('player-container');

            var playerWidth = playerContainer.offsetWidth;
            var playerHeight = playerContainer.offsetHeight;

            var desiredWidth = 1080;
            var desiredHeight = 720;

            var scale = Math.min(desiredWidth / playerWidth, desiredHeight / playerHeight);

            var canvasWidth = Math.round(playerWidth * scale);
            var canvasHeight = Math.round(playerHeight * scale);

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            context.scale(scale, scale);

            context.drawImage(videoElement, 0, 0, playerWidth, playerHeight);

            var img = new Image();
            img.src = canvas.toDataURL();

            console.log(img.src)

            var script = document.createElement('script');
            script.src = chrome.runtime.getURL('lib/tesseract.min.js');
            console.log(script.src)
            script.onload = function() {
                console.log('Tesseract loaded');
                Tesseract.recognize(
                    img.src,
                    'eng',
                    { logger: m => console.log(m) }
                ).then(({ data: { text } }) => {
                    sendResponse({ text: text });
                }).catch(error => {
                    console.error('Error al extraer texto:', error);
                    sendResponse({ text: 'Error al extraer texto del video.' });
                });
            };
            document.body.appendChild(script);
            script.onerror = function() {
                console.error('Error al cargar Tesseract');
                sendResponse({ text: 'Error al cargar Tesseract' });
            };
        } else {
            sendResponse({ text: 'No se encontró ningún video' });
        }
    } else {
        sendResponse({ text: 'No se encontró ningún video' });
    }
});