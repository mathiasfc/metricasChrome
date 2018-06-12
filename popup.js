function clickHandler(e) {
  chrome.runtime.sendMessage({directive: "gerar-click"}, function(response) {
      this.close(); // close the popup when the background finishes processing request
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('capturar-metricas').addEventListener('click', clickHandler);
})