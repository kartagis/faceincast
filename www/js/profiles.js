$("#search").on("click", function() {
    $(".loader-container > p").text("Lütfen bekleyin, liste yükleniyor");
    $(".loader-container").show();
    $.ajax({
        url: 'http://www.rejicast.com/oyuncular.json',
        type: 'get',
        dataType: 'json',
        data: {
            "field_yasadigi_sehir_value": $("#city").val(),
            "field_cinsiyet_value": $("#gender").val(),
            "field_boy_value": $("#height").val(),
            "field_goz_rengi_value": $("#eyecolour").val(),
            "field_ten_rengi_value": $("#skincolour").val(),
            "field_kilo_value": $("#weight").val(),
            "field_kategorisi_value": $("#category").val()
        },
        success: function (data) {
            if (data.nodes.length === 0) {
                $(".container").fadeOut(50);
                $(".loader-container").hide();
                navigator.notification.alert("Oyuncu bulunamadı", function() {return;}, "Hata", "Tamam");
            }
            $(".loader-container").fadeOut(500);
            $.each(data.nodes, function (key, value) {
                profile = $('<div class="profile"><img class="profileImage" data-nid="' + value.node.nid + '" src="' + value.node.field_oyuncu_fotografi.src + '"><div class="profileName">' + value.node.field_gosterilecek_ad + '</div></div>');
                $("#profiles").append(profile);
                window.scrollTo(0,401);
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
                        nid: nid
                    },
                    success: function(data) {
                        var pd = $("<div>");
                        pd.attr("id", "profile");
                        pd.insertAfter($("#profiles"));
                        var stand_hostesi = data.nodes[0].node.field_kategorisi.indexOf("Stand hostesi") != -1;
                        $(".loader-container").hide();
                        var share = $('<div id="shareViaEmail"><img id="email" src="img/email.png"/></div><div id="shareViaWhatsApp"><img id="whatsapp" src="img/whatsapp.png"/></div>');
                        var profile = $('<img class="singleProfileImage" src="' + data.nodes[0].node.field_oyuncu_fotografi.src + '"><div class="singleProfileName">' + data.nodes[0].node.field_gosterilecek_ad + '</div><div class="singleHolder"><div class="singleProfileLabel">Cinsiyet:</div><div class="singleProfileContent">' + data.nodes[0].node.field_cinsiyet + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Doğum tarihi:</div><div class="singleProfileContent">' + data.nodes[0].node.field_dogum_tarihi + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Şehir:</div><div class="singleProfileContent">' + data.nodes[0].node.field_yasadigi_sehir + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Kategorisi:</div><div class="singleProfileContent">' + data.nodes[0].node.field_kategorisi + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Eğitim düzeyi:</div><div class="singleProfileContent">' + data.nodes[0].node.field_egitim_duzeyi + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Diller:</div><div class="singleProfileContent">' + data.nodes[0].node.field_diller + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Kişisel:</div><div class="singleProfileContent">' + data.nodes[0].node.field_kisisel + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Boy:</div><div class="singleProfileContent">' + data.nodes[0].node.field_boy + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Kilo:</div><div class="singleProfileContent">' + data.nodes[0].node.field_kilo + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Ten Rengi:</div><div class="singleProfileContent">' + data.nodes[0].node.field_ten_rengi + '</div>');
                        $("#profile").append(profile);
                        window.location.href = "#profile";
                        if (stand_hostesi) {
                            $("#profile").append('</div></div><div class="singleHolder"><div class="singleProfileLabel">Göğüs:</div><div class="singleProfileContent">' + data.nodes[0].node.field_gogus + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Bel:</div><div class="singleProfileContent">' + data.nodes[0].node.field_bel + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Kalça:</div><div class="singleProfileContent">' + data.nodes[0].node.field_kalca);
                        }
                        $("#profile").append('</div><div class="singleHolder"><div class="singleProfileLabel">Ayak no:</div><div class="singleProfileContent">' + data.nodes[0].node.field_ayak_no + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Göz rengi:</div><div class="singleProfileContent">' + data.nodes[0].node.field_goz_rengi + '</div></div><div class="singleHolder"><div class="singleProfileLabel">Beceriler:</div><div class="singleProfileContent">' + data.nodes[0].node.field_beceriler + '</div></div>');
                        if (data.nodes[0].node.field_fotograflar.src !== undefined) {
                            $("#profile").append('<img class="singleProfileOtherPics" src="' + data.nodes[0].node.field_fotograflar.src + '"/>'); 
                        } else {
                            $.each(data.nodes[0].node.field_fotograflar, function () {
                                $("#profile").append('<img class="singleProfileOtherPics" src="' + this.src + '"/>');
                            });
                        }
                        if (data.nodes[0].node.field_videolar) {
                            $("#profile").append('Videolar');
                            $.each(data.nodes, function() {
                                $("#profile").append('<a href='+this.node.field_videolar+'><img class="videotn" src='+this.node.field_videolar_thumbnail_path+'/>');
                            });
                        }
                        $("#profile").append(share);
                        $("#shareViaEmail").on("click", function() {
                            window.plugins.socialsharing.shareViaEmail('http://www.rejicast.com/node/'+nid);
                        });
                        $("#shareViaWhatsApp").on("click", function() {
                            window.plugins.socialsharing.shareViaWhatsApp('http://www.rejicast.com/node/'+nid);
                        });
                    }
                });
            });
        }
    });
});
