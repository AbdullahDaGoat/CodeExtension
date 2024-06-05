function cacheResource(key, value) {
    chrome.storage.local.set({ [key]: value }, () => {
      console.log(`Cached resource for key: ${key}`);
    });
  }
  
  function getResource(key, callback) {
    chrome.storage.local.get(key, (items) => {
      if (items[key]) {
        callback(items[key]);
      } else {
        callback(null);
      }
    });
  }
  
  function fetchResource(url, callback) {
    fetch(url, {mode: 'no-cors'})
      .then((response) => response.text())
      .then((content) => callback(content))
      .catch((error) => {
        console.error('Error fetching resource:', error);
        callback(null);
      });
  }
  
  function loadWebsiteInIframe(url) {
    const iframe = document.getElementById('website-iframe');
  
    getResource(url, (cachedContent) => {
      if (cachedContent) {
        iframe.srcdoc = cachedContent;
      } else {
        fetchResource(url, (resource) => {
          if (resource) {
            cacheResource(url, resource);
            iframe.srcdoc = resource;
          } else {
            iframe.src = url; //Fallback if fetching resource fails
          }
        });
      }
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadWebsiteInIframe('https://poe.com/GPT-4o');
  });