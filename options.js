// Saves options to chrome.storage
function save_options() {
    var url = document.getElementById('url_in').value;
  }
  
  function restore_options() {
    document.getElementById('url_in').value = "https://powerschool.westportps.org";
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);