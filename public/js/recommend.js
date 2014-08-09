$(function () {
    
    //
    $('.cateSelect').change(function (e) {
        e.preventDefault();
        var $this = $(this)
        var id = $this.data('id');

        $.ajax({
            url: '/post/setcate/' + id,
            dataType: 'JSON',
            type: 'PUT',
            data: {category: $this.val()},
            success: function (data) {
                if (data.code != 0) {
                    alert(data.message);
                }
            },
            error: function (err) {
                alert(err.message);
            }
        });
    })

})