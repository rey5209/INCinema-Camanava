
$(document).ready(function() {
  // var urlString = location.search;
  var urlParams = parseURLParams(location.search);
  var array_duration =[]

  var different_link = false;
  var different_img = false;

  $redirect_txt = '';

  var lokal_name = urlParams.lokal[0]
  var lokal_page_id = urlParams.pageId[0] 
  var lokal_media_id = urlParams.mediaId[0] 
  var link = '';

  console.log(lokal_name)
  console.log(lokal_page_id)
  console.log(lokal_media_id)

  document.title = lokal_name;

  
//   FOR edit view per lokal 
  var unique = + new Date();
  fetch("js/views.json?ver="+unique)
    .then(response => {
      return response.json();
    })
    .then(function(data) { 
      
      // Local place valiation
      var gtag = ( data.jsonData[lokal_page_id-1].allow_popup_option ? data.jsonData[lokal_page_id-1].popup_option[lokal_media_id-1].gtag_id : data.jsonData[lokal_page_id-1].single_gtag_id   );

      var arrLocalData = data.jsonData[lokal_page_id-1].viewData
      var localTitleValidation = localValiation(lokal_name)


      
      // var gtag ="https://www.googletagmanager.com/gtag/js?id=G-0BQ9DP4YT3"
      // console.log(localTitleValidation)

      if(localTitleValidation.length == 0)
        document.location='index.html'
      else{ 
        $('html').append('<script async src="https://www.googletagmanager.com/gtag/js?id='+gtag+'" type="text/javascript"></script>')
        document.title = lokal_name;  
      }
      
      function localValiation(lokal_name) {
        return arrLocalData.filter(
            function(arrLocalData){ return arrLocalData.lokal == lokal_name }
        );
      }

      // End of validation

      // (data.allow_popup_option? data. )
      
      different_link = data.jsonData[lokal_page_id-1].different_link_per_data;
      different_img = data.jsonData[lokal_page_id-1].different_img_per_data;
      $redirect_txt = ( data.jsonData[lokal_page_id-1].allow_popup_option ? data.jsonData[lokal_page_id-1].popup_option[lokal_media_id-1].redirect_text : data.jsonData[lokal_page_id-1].redirect_text   );

      // console.log($redirect_txt )
      // mmedia id differnt : redirect_text , link

      

      // SET LINK from json
      
      if(!different_link){ 

        if(data.jsonData[lokal_page_id-1].allow_popup_option){ //if allow popup option, else back to default

          link = data.jsonData[lokal_page_id-1].popup_option[lokal_media_id-1].link;
          $('.main-event').append('<a  id="hidden-link" class="hidden-link" href="'+link+'" target="_blank"></a>'); 
        }else{ 
          link = data.jsonData[lokal_page_id-1].link;
          $('.main-event').append('<a  id="hidden-link" class="hidden-link" href="'+link+'" target="_blank"></a>'); 
        }
      } 

      if(!different_img){ 
        var image = data.jsonData[lokal_page_id-1].image;
        $(".append-image").append(''+
          '<img class="img-fluid mx-auto d-block shadow-lg p-3 mb-5 bg-body rounded"src="img/'+image+'" alt=""></img>'+
        '')
      }

      // minus 1 since the page starts fromm 1 and index of array starts from 0
      data.jsonData[lokal_page_id-1].viewData.forEach(setViews);  

      function setViews(item, index) {  
        if(lokal_name == item.lokal){ 
          $('.lokal_view').text(item.views).text(Math.round(item.views))
          $('.lokal_name').text(item.lokal) 
          array_duration = item.duration.split(":");
          if(different_link)
            $('.main-event').append('<a  id="hidden-link" class="hidden-link" href="'+item.link+'" target="_blank"></a>'); 
          if(different_img)
            $(".append-image").append(''+  '<img class="img-fluid mx-auto d-block shadow-lg p-3 mb-5 bg-body rounded"src="img/'+item.image+'" alt=""></img>'+ '')
        }
      }
          
    }).catch(function(error) {
            console.log(error);
    });
    

    $('.thanks-note').hide();
    $('.instruction-note').hide();

    $('.post-img').removeAttr('disabled');


    // var link ='https://youtu.be/My-lxET30Ro';
    // $('.main-event').append('<a  id="hidden-link" class="hidden-link" href="'+link+'" target="_blank"></a>'); 
     
$('.btn-report').click(function() {

  // href="https://lingayen.github.io/report/"
  window.open(
    'https://lingayen.github.io/report',
    '_blank' // <- This is what makes it open in a new window.
  );
})
$('.post-btn').click(function() {
  var sec = 0;
  // array_duration[0] - minutes
  // array_duration[1] - sec

  updateWaitingText(array_duration[0],array_duration[1])

  // compute secs (compress all into secs) - then *1000 for duration conversion
  sec = parseInt(array_duration[1]) + (parseInt(array_duration[0]) * 60);
  sec = sec*1000;
 

   loadingFunction(sec);
    
     // window.open("https://youtu.be/vkIqKiLgm6Y", "_blank"); 
    $('.main-event').hide(); 
    $('.instruction-note').show(); 
    
     $( "#hidden-link" ).trigger( "click" );
     document.getElementById('hidden-link').click();

    setInterval(function()
    {   
        $('.load-end').text("Your views will be monitored and will update later..")
        $.LoadingOverlay("hide", true); //remmove the loading overlay
        $('.instruction-note').hide();
        $('.thanks-note').show();
        // alert("Hello"); 

    }, sec); 
        // 1sec = 1000
        // 1min = 60000
        // 3 minutes = 180000
        // 4 minutes 200000
        // 5 minutes = 300000
        // 10 min = 600000
  });
  function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
function updateWaitingText(mins,secs){
  var str_timer = "";

  if(mins > 0)
    str_timer += mins+ " minutes "
  if(secs > 0)
    str_timer += secs+ " seconds"
   

  $('.txt-notes .timer').text(str_timer);

    // 
}

  function loadingFunction(sec){ 
//  Sending view from Youtube "Uploading data from Google Firebase ""DONE ! Please wait your view to be update by Team " 
 
   

    var customElement =  '<div class="cm-spinner"></div>'
    
    $.LoadingOverlay("show", {
        background: "rgb(203, 225, 245, 0.3)", 
        image: "",
        custom           : customElement,
        customAnimation  : "",
        customAutoResize : true,
        customResizeFactor: 2 
    }); 
    //  $('.load-start').text('Sending view')
      // $('.lokal_view').text(data.jsonData[lokal_page_id-1].redirect_text)
    
      $('.load-start').text($redirect_txt) 
    setInterval(function()
    { 
        
        $('.load-start').text('Uploading data from Google Firebase')
        // $.LoadingOverlay("show", {
        //     background: "rgb(203, 225, 245, 0.3)", 
        //     image: "",
        //     custom           : customElement,
        //     customAnimation  : "",
        //     customAutoResize : true,
        //     customResizeFactor: 2,
        //     customOrder: 2,
        //     text: "Uploading data from Google Firebase",
        //     textColor: "#202020",
        //     textOrder: 3,
        //     textResizeFactor: 0.3,
        //     textAutoResize: true,
        //     direction: "column"
        // });

    }, sec/2); 
        // 1sec = 1000
        // 1min = 60000
        // 3min = 180000
        // 5 minutes = 300000
        // 10 min = 600000  
  }
  
  
    
});

