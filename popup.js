document.addEventListener('DOMContentLoaded', function () {
    var extractButton = document.getElementById('extractButton');

    try{
        extractButton.addEventListener('click', function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'extractText' }, function (response) {
                    if (response && response.text) {
                        document.getElementById('result').innerText = response.text;
                    } else {
                        document.getElementById('result').innerText = "No se pudo extraer texto";
                    }
                });
            });
        });
    }catch(e){
        console.log(e);
    }
});
