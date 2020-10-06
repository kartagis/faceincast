$(".loader-container > p").text("Duyurular alınıyor, lütfen bekleyin.")
$(".loader-container").show();
$.ajax({
    url: 'http://www.rejicast.com/services/user/token.json',
    type: 'post',
    dataType: 'json',
    success: function(token) {
        $.ajax({
            url: 'http://www.rejicast.com/services/system/connect.json',
            type: 'post',
            dataType: 'json',
            beforeSend: function(r) {
                r.setRequestHeader("X-CSRF-Token", token.token)
            },
            success: function(connect) {
                $("#loginHolder").text(connect.user.name);
                $.ajax({
                    url: 'http://www.rejicast.com/duyurular.json',
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        $(".loader-container").fadeOut(500);
                        $.each(data.nodes, function (key,value) {
                            var announcement = $('<div class="generalNotification ' + value.node.field_ozel_duyuru +' '+ value.node.field_kime +'"><h3>' + value.node.title + '</h3><p>' + value.node.field_icerik + '</div>');
                            $('#contentHolder.notifications').append(announcement);
                        });
                        $('.evet:not(.'+connect.user.uid+')').remove();
                    }
                });
            }
        });
    }
});

$('#genNot').addClass('notificationActive');

$('#selfNot').click(function() {
    $('.hayir').hide();
    $('#genNot').removeClass('notificationActive');
    $('#selfNot').addClass('notificationActive');
});
$('#genNot').click(function() {
    $('.hayir').show();
    $('#genNot').addClass('notificationActive');
    $('#selfNot').removeClass('notificationActive');
});
