
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      console.log('clicked on the browserAction');
    }
  }
)
