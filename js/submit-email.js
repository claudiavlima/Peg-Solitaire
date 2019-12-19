// Function to put the parts of an email including: address, subject and body
var sendEmail = function() {
  var subj = document.getElementById('name').value
  var msg = document.getElementById('msg').value
  window.open('mailto:limaclaudiav@gmail.com?subject=' + subj + '&body='+msg)
}

//Open Email Client
var init = function() {
  document.getElementById('button-submit').onclick = sendEmail
}

window.onload = init