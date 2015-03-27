BNBLink.utils.objectToHash = function(obj) {
    return _(_(_(obj).pairs()).map(function (e) {
            return _(e).join('=')
        })).join('&');
}