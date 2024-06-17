chrome.commands.onCommand.addListener(function(command) {
    if (command === 'open-extension') {
      chrome.windows.create({
        url: chrome.runtime.getURL('popup.html'),
        type: 'popup',
        width: 428,
        height: 1000
      });
    }
  });