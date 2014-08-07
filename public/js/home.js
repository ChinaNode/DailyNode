$(function () {

    function getUrlVars () {
        var vars = {}, hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    // set search keyword to search box and pagination link if have one 
    var query = getUrlVars();
    if (query.keyword) {
        $('[name="keyword"]').val(query.keyword);
        $('.pagination a').each(function () {
            var $this = $(this)
            $this.attr('href', $this.attr('href') + '&keyword=' + query.keyword)
        })
    }

})