//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    var url = "http://veritas.viser.ch?url=" + encodeURIComponent(tabs[0].url);
    chrome.tabs.create({ url: url });
  });
});