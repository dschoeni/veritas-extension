// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var spinner;

var startSpinner = function(){
  var context=document.createElement('canvas').getContext('2d');
  var start = new Date();
  var lines = 16,
  cW = 40,
  cH = 40;

  spinner = setInterval(function() {
    var rotation = parseInt(((new Date() - start) / 1000) * lines) / lines;
    context.save();
    context.clearRect(0, 0, cW, cH);
    context.translate(cW / 2, cH / 2);
    context.rotate(Math.PI * 2 * rotation);
    for (var i = 0; i < lines; i++) {
      context.beginPath();
      context.rotate(Math.PI * 2 / lines);
      context.moveTo(cW / 10, 0);
      context.lineTo(cW / 4, 0);
      context.lineWidth = cW / 30;
      context.strokeStyle = 'rgba(0, 0, 0,' + i / lines + ')';
      context.stroke();
    }

  var imageData = context.getImageData(10, 10, 19, 19);
    chrome.browserAction.setIcon({
      imageData: imageData
    });

  context.restore();
  }, 1000 / 30);
}

var stopSpinner = function(){
  clearInterval(spinner);
}

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
});

chrome.browserAction.onClicked.addListener(function(tab) { 

  startSpinner();

  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url ="https://shrill-dream-fbae.proofy.workers.dev/?url=" + encodeURIComponent(tabs[0].url);
    fetch(url)
    .then(
      function(response) {
        stopSpinner();
        chrome.browserAction.setIcon({path: 'icons/icon128.png'});
        console.log('response', response);
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
  
        // Examine the text in the response
        response.json().then(function(data) {
          console.log(data);
          alert(data.hash);


          let docContent = JSON.stringify(data); /* your content */;
          let doc = URL.createObjectURL( new Blob([docContent], {type: 'application/octet-binary'}) );
          chrome.downloads.download({ url: doc, filename: 'proof.json', conflictAction: 'overwrite', saveAs: true });
        });
      }
    )
    .catch(function(err) {
      stopSpinner();
      console.log('Fetch Error :-S', err);
    });
});


});


