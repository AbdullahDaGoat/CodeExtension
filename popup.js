// Keep track of the last time the Ctrl key was pressed
let lastCtrlPress = 0;

// Function to open the iframe
function openIframe() {
  const iframe = document.getElementById('website-iframe');

  if (!iframe) {
    // Create a new iframe element
    const newIframe = document.createElement('iframe');
    newIframe.id = 'website-iframe';
    newIframe.style.width = '100%';
    newIframe.style.height = '500px'; // Adjust the height as needed

    // Append the iframe to the body of the document
    document.body.appendChild(newIframe);

    // Load the website in the new iframe
    loadWebsiteInIframe('https://poe.com/GPT-4o', newIframe);
  } else {
    // Load the website in the existing iframe
    loadWebsiteInIframe('https://poe.com/GPT-4o', iframe);
  }
}

// Function to cache and load the website in the provided iframe
function loadWebsiteInIframe(url, iframe) {
  getResource(url, (cachedContent) => {
    if (cachedContent) {
      iframe.srcdoc = cachedContent;
    } else {
      fetchResource(url, (resource) => {
        if (resource) {
          cacheResource(url, resource);
          iframe.srcdoc = resource;
        } else {
          iframe.src = url; // Fallback if fetching resource fails
        }
      });
    }
  });
}

// Function to cache a resource
function cacheResource(key, value) {
  chrome.storage.local.set({ [key]: value }, () => {
    console.log(`Cached resource for key: ${key}`);
  });
}

// Function to get a cached resource
function getResource(key, callback) {
  chrome.storage.local.get(key, (items) => {
    if (items[key]) {
      callback(items[key]);
    } else {
      callback(null);
    }
  });
}

// Function to fetch a resource
function fetchResource(url, callback) {
  fetch(url, { mode: 'no-cors' })
    .then((response) => response.text())
    .then((content) => callback(content))
    .catch((error) => {
      console.error('Error fetching resource:', error);
      callback(null);
    });
}

// Listen for the 'keydown' event on the document
document.addEventListener('keydown', function(event) {
  // Check if the pressed key is the Ctrl key
  if (event.key === 'Control') {
    const currentTime = Date.now();
    // If the Ctrl key was pressed within 500ms (adjust as needed) of the last press
    if (currentTime - lastCtrlPress < 500) {
      // Open the iframe
      openIframe();
    }
    lastCtrlPress = currentTime;
  }
});

// Listen for the extension icon click event
chrome.action.onClicked.addListener(() => {
  openIframe();
});