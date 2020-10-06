document.addEventListener("deviceready", function() {
  if (window.location.pathname.split("/")[3] == "index.html") {
    checkStatus();
    checkNotifications();
  }
});

$("#navHolder #homeBtn").on("click", function() {
  window.location.href = "index.html";
});
$("#navHolder #notificationBtn").on("click", function() {
  window.location.href = "notifications.html";
});

function checkStatus() {
  $(".loader-container > p").text("Başlangıç kontrolleri yapılıyor, lütfen bekleyin");
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
          $(".loader-container").fadeOut(500);
          var duser = data.user;
          if (duser.uid === 0) {
            $("#loginBtn").css("display","block");
            $("#logoutBtn").css("display","none");
            $("a[href='applications.html']").css("display","none");
          } 
          else {
            $("#loginBtn").css("display","none");
            $("#logoutBtn").css("display","block");
            $("a[href='applications.html']").css("display","block");
            $("#loginHolder").text(data.user.name);
          }
        },
        error: function(xhr,status,message) {
          console.log(xhr);
          console.log(status);
          console.log(message);
        }
      });
    }
  });
}

function logout() {
  navigator.notification.confirm("Çıkış yapmak istiyor musunuz?", function(buttonIndex) {
    if (buttonIndex === 1) {
      $(".loader-container > p").text("Çıkış yapılıyor, lütfen bekleyin");
      $(".loader-container").show();
      setTimeout(function() {
        $(".loader-container").fadeOut(500);
      }, 1000);
      $.ajax({
        url: 'http://www.rejicast.com/services/user/token.json',
        type: 'post',
        dataType: 'json',
        success: function(token) {
          $.ajax({
            url: 'http://www.rejicast.com/services/user/logout.json',
            type: 'post',
            dataType: 'json',
            beforeSend: function(r) {
              r.setRequestHeader("X-CSRF-Token", token.token)
            },
            success: function() {
              window.localStorage.removeItem("name");
              $(".loader-container > p").text("Başarıyla çıkış yapıldı");
              $(".loader-container").show();
              setTimeout(function() {
                $(".loader-container").fadeOut(500);
              }, 1000);
              $("#loginBtn").css("display","block");
              $("#logoutBtn").css("display","none");
              $("a[href='applications.html']").css("display","none");
              $("#loginHolder").text("");
              $("#notification").text("");
              $("#notification").css("display","none");
            }
          });
        }
      });
    }
  }, 'Onay', ['Evet', 'Hayır']);
}
function checkNotifications() {
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
          $.ajax({
            url: 'http://www.rejicast.com/duyurular.json',
            type: 'get',
            dataType: 'json',
            success: function (data) {
              var num = data.nodes.reduce(function(currNum, node) { 
                if (node.node.field_kime.indexOf(connect.user.uid) !== -1) { 
                  currNum++;
                }
                return currNum;
              }, 0);
              if (connect.user.uid > 0) {
                $("#notification").text(num);
                if (num === 0) {
                  $("#notification").css("display","none");
                } else {
                  $("#notification").css("display","block");
                }
              }
            }
          });
        }
      });
    }
  });
}
