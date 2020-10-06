$(".loader-container > p").text("Oyuncu listesi alınıyor");
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
            success: function(data) {
                $.ajax({
                    url: 'http://www.rejicast.com/oyuncularim.json',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        uid: data.user.uid
                    },
                    success: function (data) {
                        setTimeout(function() {
                            $(".loader-container").fadeOut(500);
                        });
                        $.each(data.nodes, function (key, value) {
                            var profile = $('<div class="profile"><img class="profileImage" data-nid="' + value.node.nid + '" src="' + value.node.field_oyuncu_fotografi.src + '"><div class="profileName">' + value.node.field_gosterilecek_ad+ '</div></div>');
                            $("#contentHolder.applications").append(profile);
                            window.scrollTo(0,0);
                        });
                        $(".profileImage").on("click", function(ev) {
                            $(".loader-container > p").text('Oyuncu bilgileri alınıyor');
                            $(".loader-container").show();
                            var nid=$(ev.target).attr("data-nid");
                            $.ajax({
                                url: 'http://www.rejicast.com/oyuncu.json',
                                type: 'get',
                                dataType: 'json',
                                data: {
                                    nid: nid,
                                },
                                success: function(data) {
                        var category = data.nodes[0].node.field_kategorisi.indexOf("Stand hostesi") != -1;
                                    $(".loader-container").hide();
                                    $("#contentHolder.applications > .profile").remove();
                                    var share = $('<div id="shareViaEmail"><img id="email" src="img/email.png"/></div><div id="shareViaWhatsApp"><img id="whatsapp" src="img/whatsapp.png"/></div>');
                                    var profile = $('<img class="singleProfileImage" src="' + data.nodes[0].node.field_oyuncu_fotografi.src + '"><div class="singleProfileName">' + data.nodes[0].node.field_gosterilecek_ad + '</div><div class="singleProfileLabel">Cinsiyet:</div><div class="singleProfileContent">' + data.nodes[0].node.field_cinsiyet + '</div><div class="singleProfileLabel">Doğum tarihi:</div><div class="singleProfileContent">' + data.nodes[0].node.field_dogum_tarihi + '</div><div class="singleProfileLabel">Şehir:</div><div class="singleProfileContent">' + data.nodes[0].node.field_yasadigi_sehir + '</div><div class="singleProfileLabel">Kategorisi:</div><div class="singleProfileContent">' + data.nodes[0].node.field_kategorisi + '</div><div class="singleProfileLabel">Eğitim düzeyi:</div><div class="singleProfileContent">' + data.nodes[0].node.field_egitim_duzeyi + '</div><div class="singleProfileLabel">Diller:</div><div class="singleProfileContent">' + data.nodes[0].node.field_diller + '</div><div class="singleProfileLabel">Kişisel:</div><div class="singleProfileContent">' + data.nodes[0].node.field_kisisel + '</div><div class="singleProfileLabel">Boy:</div><div class="singleProfileContent">' + data.nodes[0].node.field_boy + '</div><div class="singleProfileLabel">Kilo:</div><div class="singleProfileContent">' + data.nodes[0].node.field_kilo + '</div><div class="singleProfileLabel">Ten Rengi:</div><div class="singleProfileContent">' + data.nodes[0].node.field_ten_rengi + '</div>');
                                    $("#contentHolder.profiles").append(profile);
                                    if (category) {
                                        $("#contentHolder.profiles").append('</div><div class="singleProfileLabel">Göğüs:</div><div class="singleProfileContent">' + data.nodes[0].node.field_gogus + '</div><div class="singleProfileLabel">Bel:</div><div class="singleProfileContent">' + data.nodes[0].node.field_bel + '</div><div class="singleProfileLabel">Kalça:</div><div class="singleProfileContent">' + data.nodes[0].node.field_kalca);
                                    }
                                    $("#contentHolder.profiles").append('<div class="singleProfileLabel">Ayak no:</div><div class="singleProfileContent">' + data.nodes[0].node.field_ayak_no + '</div><div class="singleProfileLabel">Göz rengi:</div><div class="singleProfileContent">' + data.nodes[0].node.field_goz_rengi + '</div><div class="singleProfileLabel">Beceriler:</div><div class="singleProfileContent">' + data.nodes[0].node.field_beceriler + '</div>');
                                    window.scrollTo(0,0);
                                    if (data.nodes[0].node.field_fotograflar.src !== undefined) {
                                        $("#contentHolder.profiles").append('<img class="singleProfileOtherPics" src="' + data.nodes[0].node.field_fotograflar.src + '"/>'); 
                                    } else {
                                        $.each(data.nodes[0].node.field_fotograflar, function () {
                                            $("#contentHolder.profiles").append('<img class="singleProfileOtherPics" src="' + this.src + '"/>');
                                        });
                                    }
                                    if (data.nodes[0].node.field_videolar) {
                                        $("#contentHolder.profiles").append('Videolar');
                                        $.each(data.nodes, function() {
                                            $("#contentHolder.profiles").append('<a href='+this.node.field_videolar+'><img class="videotn" src='+this.node.field_videolar_thumbnail_path+'/>');
                                        });
                                    }
                                    $("#contentHolder.applications").append(share);
                                    $("#shareViaEmail").on("click", function() {
                                        window.plugins.socialsharing.shareViaEmail('http://www.rejicast.com/node/'+nid);
                                    });
                                    $("#shareViaWhatsApp").on("click", function() {
                                        window.plugins.socialsharing.shareViaWhatsApp('http://www.rejicast.com/node/'+nid);
                                    });
                                },
                            });
                        });
                    },
                });
            }
        });
    }
});
