$(function () {
    /*
    function getUrlVars () {
        var vars = {}, hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars[hash[0]] = hash[1];
        }
        return vars;
    }*/

    $('.likeBtn').click(function (e) {
        e.preventDefault()
        var $this = $(this)
        var url = $this.data('href')
        $.get(url, function (result) {
            if (result.code == 1) {
                window.location.href = '/login'
            } else if (result.code == 2) {
                var $m = $this.find('span.message')
                $m.show()
                setTimeout(function () {$m.hide()}, 1000)
            } else {
                var on = parseInt($this.find('span.num').text())
                $this.find('span.num').text(on+1)
            }
        }, 'JSON')
    })

})
