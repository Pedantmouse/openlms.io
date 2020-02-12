// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
exports.email = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript
exports.wildTest = function(wildcard, str) {
    const re = new RegExp(`^${wildcard.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
    return re.test(str); // remove last 'i' above to have case sensitive
  }
