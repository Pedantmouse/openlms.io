// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
exports.email = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
exports.isAlphaNumericWithUnderscore = function(str) {
    // var regExp = /^[A-Za-z0-9]+$/;
    var re = /^[a-zA-Z0-9_]+$/;
    return re.test(str);
}

// https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript
exports.wildTest = function(wildcard, str) {
    const re = new RegExp(`^${wildcard.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
    return re.test(str); // remove last 'i' above to have case sensitive
  }
