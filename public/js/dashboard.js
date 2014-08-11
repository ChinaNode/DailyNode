$(function () {
    
    //
    $('.delete').click(function (e) {
        e.preventDefault();
        var $this = $(this)
        var id = $this.data('id');

        $.ajax({
            url: '/post/del/' + id,
            dataType: 'JSON',
            type: 'DELETE',
            success: function (data) {
                if(data.code == 0) {
                    $this.parents('tr').remove()
                }
            },
            error: function (err) {
                alert(err.message)
            }
        })
    })

    $('.recommend').click(function (e) {
        e.preventDefault();
        var $this = $(this)
        var id = $this.data('id');
        $.ajax({
            url: '/post/recommend/' + id,
            dataType: 'JSON',
            type: 'PUT',
            success: function (data) {
                if(data.code == 0) {
                    $this.hide();
                }
            },
            error: function (err) {
                alert(err.message)
            }
        })
    })

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