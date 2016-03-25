var update = function(details) {
  
  if(!details) return;

  var id = details.id; 
    if(!id) return;
  var index = details.index; 
    if(!index) return;
  var title = details.title; 
    //if(!title) return;
  
  // hax
  if (title && title.indexOf('. ') == 1) {
    title = title.substr(3);
  }

  // title = (index + 1) + '. ' + title;
  if (index < 8) {
    title = (index + 1) + '. ' + title;
  } 
  /*else {
    // nothing...
  }*/

  try {
    chrome.tabs.get(id, function (tab){
      
      var proto = (function getProtocol(url){
        var endProto = tab.url.indexOf(":") ;
        return tab.url.substr(0, endProto);
      })(tab.url);
      
      var allowedProtos = ["http", "https"];
      
      if(allowedProtos.indexOf(proto)!=-1){
        chrome.tabs.executeScript(
          id,
          {
            code : "document.title = '" + title + "';"
          }
        );
      }
    })
    
    //console.log("executed: " + id);
  } catch(e) {
    // It might be a chrome:// URL
    console.log(e.message);
  }

};


function updateAll() {
  chrome.tabs.query({}, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      update(tab);
    }
  });
}

chrome.tabs.onMoved.addListener(function(id) {
  updateAll();
});

chrome.tabs.onRemoved.addListener(function(id) {
  updateAll();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  update(tab);
});

updateAll();
