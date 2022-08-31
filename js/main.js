


var popup_href_original=[]


$(document).ready(function() {

  // urlParams Para mma get ung mga nasa params
  var urlParams = parseURLParams(location.search);
  var share_type ='';
  
  console.log(urlParams)
  // if url params is empty
  if(urlParams != undefined && urlParams.hasOwnProperty('share')){ 
    share_type = urlParams.share[0]
    console.log(share_type)
  }

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
 
    var current_page = 1;
    var max_page = 0;
    var page_main_tittles = [];
    var page_sub_tittles = [];
    var sub_tittles_colors = [];
    var banners = [];

    // updatePaging(current_page,max_page,page_main_tittles,page_sub_tittles)

    $('.btn-next').click(function() { 
        current_page ++;
        updatePaging(current_page,max_page,page_main_tittles,page_sub_tittles,sub_tittles_colors,banners)
    })
    $('.btn-prev').click(function() { 
        current_page --;
        updatePaging(current_page,max_page,page_main_tittles,page_sub_tittles,sub_tittles_colors,banners)
    })


  var unique = + new Date();
  // console.log(unique);

  fetch("js/views.json?ver="+unique)
    .then(response => {
      return response.json();
    })
    .then(function(data) {  
      var count_page=  1;
      // console.log(data.today);

      data.jsonData.forEach(setTables);
      // data.yesterday.forEach(setViewsYesteday); 
 

      function setTables(item, index) { 

        // Param For subtittle
        if(share_type == item.subTittle)
          current_page = count_page;

        // Pagination setup
        max_page++;
        page_main_tittles.push(item.tittle);
        page_sub_tittles.push((item.subTittleType == 'icon' ? "<a href='#' class='me-4 text-reset'>  <i class='fab fa-"+item.subTittle+"'></i> </a>" : item.subTittle ));
        sub_tittles_colors.push(item.subTittleColor);
        banners.push(item.banner)

        // Setup Table content for views per page
        // var total = 0;
        // var tittle = item.tittle;
        $('.append_pages').append(""+ 
        '<table name="'+item.tittle+'" class="table table-striped table-hover table-paging table-page-'+count_page+'">'+
        '    <thead>'+
        '      <tr > '+
        '        <th  class="lokals-item d-flex justify-content-between align-items-center bg-dark"> '+
        '          <div class="p-2 bd-highlight link-dark post-title " style="color:'+item.first_header_color+'">'+item.first_header_title+'</div> '+ 
        '        </th> '+
        '      </tr>'+
        '    </thead>'+
        '    <tbody class="append_table-'+count_page+'">  '+
        '  </tbody>'+
        '</table>'+
        "")


        let str_popups = '';
        // var page = item.page;
        var arr_hrefs = [];
         
        
        if(item.allow_popup_option){
          item.popup_option.forEach(setPopupOptions);

          $('.append-popup-options').html(str_popups);
        }

        function setPopupOptions(item, index) { 

          arr_hrefs.push(item.page+'?mediaId='+(index+1))

          str_popups += '' +
         ' <a href="'+item.page+'?mediaId='+(index+1)+'" class="me-4 text-reset text-danger  popup-choice'+current_page+'">  '+
         '   <i class="fab fa-'+item.subTittleIcon+' center " style=" font-size: 13rem; color:'+item.subTittleColor+' "></i> '+
         '   <p class="h1 text-center bg-white">'+item.subTittle+'</p>'+
         ' </a>'+
         ' <br></br>';

        }
        
        popup_href_original.push({ arr: arr_hrefs } )
        



         
        var page = item.page;
        var redirectPage = item.redirectPage;
        var allow_popup_option = item.allow_popup_option;
        item.viewData.forEach(setLokals);
        function setLokals(item, index) { 
          // total += item.views; 

          
            // Setup Lokal content and views for each page
            
            
            
          if(item.divider){
              $('.append_table-'+count_page).append(""+
                '<tr style=" background-color:'+item.bg+'; "> '+
            '        <th  class="lokals-item d-flex justify-content-between align-items-center border-bottom border-dark"> '+
            '          <div class="p-2 bd-highlight link-dark post-title " style="color:'+item.color+';">'+item.divider_title+'</div> '+ 
            '        </th> '+
            '  </tr>  '+
            "")
          }else{
 

            let popup_trigger = '';
            if(allow_popup_option){
              popup_trigger = ' data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-lokal="&pageId='+count_page+'&lokal='+item.lokal+'" data-bs-page="'+current_page+'"';
  
              // pageId=2&lokal=Benguet
            }

            $('.append_table-'+count_page).append(""+
            '<tr class="search-lokal " data-search="' + (item.lokal.toLowerCase())+ '"> '+
            '    <td > '+
            '        <a href="'+(redirectPage == true && allow_popup_option == false ? page+'?pageId='+count_page+'&lokal='+item.lokal : '#' )+'" class="lokals-item d-flex justify-content-between align-items-center" '+popup_trigger+' id="lokal_'+item.lokal+'">'+
            '          <div class="p-2 link-dark post-title">'+item.lokal+'</div> '+ 
            '        </a>'+
            '    </td>  '+
            '  </tr>  '+
            "")
          }

        }

        
        // Just for empty space
        $('.append_table-'+count_page).append(""+
        '<tr> '+ 
        '  <td >        '+
        '    <div class="lokals-item lokals-footer d-flex justify-content-between align-items-center">'+
        '      <h3 class="p-2 link-dark post-title text-danger"></h3> '+
        '      <h3 class="p-2 link-dark view-counter text-danger "></h3>'+
        '    </div> '+
        '  </td>  '+
        '</tr>'+
          "")
 
          // Get total at the end of every page
        // $('.append_table-'+count_page).append(""+
        // '<tr> '+
        // '  <td >        '+
        // '    <div class="lokals-item lokals-footer d-flex justify-content-between align-items-center">'+
        // '      <h3 class="p-2 link-dark post-title text-danger">Total</h3> '+
        // '      <h3 class="p-2 link-dark view-counter text-danger total_view">'+total+'</h3>'+
        // '    </div> '+
        // '  </td>  '+
        // '</tr>'+
        //   "")

        count_page++;
      }
         
      updatePaging(current_page,max_page,page_main_tittles,page_sub_tittles,sub_tittles_colors,banners)

    }).catch(function(error) {
            console.log(error);
    });
    
  fetch("js/settings.json")
    .then(response => {
      return response.json();
    })
    .then(function(data) {  

      $('.copyRights').text(data.copyrigth)
      $('.copyRightsSite').text(data.copyRightSite) 
      $(".copyRightsSite").attr("href", data.copyRightLink)
      
      data.social.forEach(setSocial); 
      function setSocial(item, index) { 

        $(".append-social").append("" +
      '<a href="'+item.link+'" class="me-4 text-reset">'+
      '  <i class="fab fa-'+item.icon+'"></i>'+
      '</a>'+
      '')

      }
      
    }).catch(function(error) {
            console.log(error);
    });
  
    function updatePaging(current_page,max_page,page_main_tittles,page_sub_tittles,sub_tittles_colors,banners){
        // console.log(page_sub_tittles[0])
        $('.table-paging').hide()
        
        $('.table-page-'+current_page).show()
      

        $('.page-main-tittle').text(page_main_tittles[current_page-1])
        $('.page-tittle').html(''+page_sub_tittles[current_page-1])
        $('.page-tittle').css("color",sub_tittles_colors[current_page-1]);
        $(".banner-pic").attr("background-image","img/"+banners[current_page-1]);
        // $('.banner-pic').attr('src',"img/"+banners[current_page-1]).load(function(){
        //     this.width;   // Note: $(this).width() will not work for in memory images
        
        // });
        $('.banner-pic').css('background-image',"url(img/"+banners[current_page-1]+")");
        
        if(current_page <= 1){
            $('.btn-prev').hide()
        }else{ 
            $('.btn-prev').show()
        }

        if(current_page == max_page){
            $('.btn-next').hide()
        }else{ 
            $('.btn-next').show()
        }
    }
    
}) 


var exampleModal = document.getElementById('exampleModal')
exampleModal.addEventListener('show.bs.modal', function (event) {

  // Button that triggered the modal
  var button = event.relatedTarget
  // Extract info from data-bs-* attributes
  var lokal = button.getAttribute('data-bs-lokal')
  var pageId = button.getAttribute('data-bs-page')
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //

 
  
  $( ".popup-choice"+pageId ).each(function( index ) {
    
    // console.log(popup_href_original[pageId-1].arr[index] )
    // let popup_href =    $( this ).attr('href')  ;
    $( this ).attr('href',popup_href_original[pageId-1].arr[index]  +lokal)  ;
    
  });
  
})

$('#search_lokal').on('keyup', function() {
  // $('.result-Australia East').hide()
  if (event.which == 13) {
    event.preventDefault();
  }

  search_keyword = $('#search_lokal').val()
  searchResults(search_keyword)
})


$('#search_lokal').on('change', function() {

  search_keyword = $('#search_lokal').val()
  searchResults(search_keyword)
  $('#search_lokal').trigger('keypress');
})

$('#search_lokal').on('keyup', function() {
  //code to be executed
}).on('keydown', function(e) {
  if (e.keyCode == 8)
    $('#search_lokal').trigger('keypress');
});

function searchResults(value) {

  if (value == '') {

    $(".search-lokal").show()
  } else {
    value = value.toLowerCase()

    $(".search-lokal").hide()
    
    // $( 'table[data-search]' ).filter(function(){
    //   return $(this).attr('data-search').toLowerCase()== value;
    // }).show()
    $("table").find("[data-search*='" + value + "']").show()
    console.log(value)
  }
}


$('.search-test').on('click', function() {
  //code to be executed
  search_keyword = $('#search_lokal').val()
  searchResults(search_keyword)
});