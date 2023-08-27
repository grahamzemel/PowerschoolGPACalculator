// Saves options to chrome.storage
function save(){
  var url = document.getElementById('url_in').value;

  document.getElementById("save").innerHTML = "Saved!";
  document.getElementById("save").style.backgroundColor = "rgb(0, 155, 0)";
}
  
  function restore_options() {
    document.getElementById('url_in').value = "https://powerschool.westportps.org";
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click', save);
     