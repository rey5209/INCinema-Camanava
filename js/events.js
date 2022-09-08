
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA35D1SwQdAPOAp-wxRYsezWQI7rvIPQAY",
  authDomain: "counting-system.firebaseapp.com",
  projectId: "counting-system",
  storageBucket: "counting-system.appspot.com",
  messagingSenderId: "726733968843",
  appId: "1:726733968843:web:d68da6c09a4a1aac7fd24e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {
  getDatabase,
  ref,
  onValue,
  get,
  set,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";

const db = getDatabase();

// get current date

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear(); 
today =yyyy +'-' + mm + '-' + dd  ;  
var date = today //data will be separated by day
 
// Reinitialize data
var arr =[
    "BAGBAGUIN"   ,
    "BALINTAWAK"   ,
    "CALOOCAN"   ,
    "CATMON"   ,
    "GEN. T. DE LEON"   ,
    "GRACEPARK"   ,
    "KALANDANG",
    "KARUHATAN"   ,
    "KAUNLARAN"   ,
    "KAUNLARAN 1"   ,
    "KAUNLARAN 3"   ,
    "KAWAL"   ,
    "LETRE"   ,
    "LINGUNAN"   ,
    "M.H. DEL PILAR"   ,
    "MALABON"   ,
    "MALINTA"   ,
    "MAPULANG LUPA"   ,
    "MAYSAN"   ,
    "NAVAL"   ,
    "NAVOTAS"   ,
    "NORTH DIVERSION"   ,
    "PANGHULO"   ,
    "PARADA"   ,
    "POLO"   ,
    "SANGANDAAN"   ,
    "SKYLINE"   ,
    "STA. QUITERIA"   ,
    "TANDANG SORA"   ,
    "TANGOS"   ,
    "TINAJEROS"   ,
    "VALENZUELA"  
    ]

    var arrNonValidPath = [
        {"type":".", "replace":"DOT"},
        {"type":"#", "replace":"HASH_SIGN"},
        {"type":"$", "replace":"DOLLAR_SIGN"},
        {"type":"[", "replace":"OPEN_BRACKET"},
        {"type":"]", "replace":"CLOSE_BRACKET"},
        {"type":" ", "replace":"_"} 
    ]

 


$(document).ready(function() {
  // var urlString = location.search;
  var urlParams = parseURLParams(location.search);
  var array_duration =[]

  var different_link = false;
  var different_img = false;

  var redirect_txt = '';

  var lokal_name = urlParams.lokal[0]
  var lokal_page_id = urlParams.pageId[0] 
  var link = '';

  console.log(lokal_name)
  console.log(lokal_page_id)

  document.title = lokal_name;
  

  var local = lokal_name.toUpperCase()

  
//   FOR edit view per lokal 
  var unique = + new Date();
  fetch("js/views.json?ver="+unique)
    .then(response => {
      return response.json();
    })
    .then(function(data) { 
      
      different_link = data.jsonData[lokal_page_id-1].different_link_per_data;
      different_img = data.jsonData[lokal_page_id-1].different_img_per_data;
      redirect_txt = data.jsonData[lokal_page_id-1].redirect_text;

      // SET LINK from json
      
      if(!different_link){ 
        link = data.jsonData[lokal_page_id-1].link;
        $('.main-event').append('<a  id="hidden-link" class="hidden-link" href="'+link+'" target="_blank"></a>'); 
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
          $('.lokal_view').text(Math.round(item.views)) 
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

     setTimeout(function()
    {   
        console.log('done')
        SelectData();
        $('.load-end').text('DONE ! Please wait your view to be update by Google Team ')
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
    
      $('.load-start').text(redirect_txt) 
    setTimeout(function()
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

  
  // ============================== FIREBASE FUNCTIONS =============================

  // SELECT DATA FUNCTION
        function SelectData(){
            const dbref = ref(db);

            
            let localInsert = checkValidArg(arrNonValidPath, local) 

            get(child(dbref,"Views/"+date+"/"+localInsert)).then( (snapshot) => { 
                if(snapshot.exists()){  
                    // alert(snapshot.val().count)
                    
                    UpdateData(snapshot.val().count, localInsert)
                }else{
                    // alert("No Data Found") 
                    checkDayData()
                }
            }).catch( (error) =>{
                alert("Unssuccessful, error "+error) 
            })
            
        }

        function checkDayData(){
            
            const dbref = ref(db);

            
            get(child(dbref,"Views/"+date)).then( (snapshot) => { 
                if(snapshot.exists()){  
                    // if its not a new day but local is not found 
                    
                    let localInsert = checkValidArg(arrNonValidPath, local)
                    InsertData(localInsert, 1)
                    
                    
                }else{
                    // if it is a new day, reinitialize data
                    reinitializeData()
                    SelectData()
                                        
                    // alert("No Data Found")
                }
            }).catch( (error) =>{
                alert("Unssuccessful, error "+error) 
            })

        }

        function reinitializeData(){

            arr.forEach((arrVal) => {
                // console.log(arrVal)

                 
                var arrVal = checkValidArg(arrNonValidPath, arrVal)
                InsertData(arrVal, 0) 
                // console.log(arrVal);
            })

        }

        
        // INSERT DATA FUNCTION

        function InsertData(localName, countval){
            set(ref(db, "Views/"+date+"/"+localName),{
                name: localName,
                count: countval
            })
            .then( ()=> {
                // alert("Data stored successfully")
            })
            .catch( (error) =>{
                alert("Unssuccessful, error "+error) 
            });
        }

        
        // UPDATE DATA FNCTION
        
        function UpdateData(val,localName){
            // const dbref = ref(db);

            
            update(ref(db,"Views/"+date+"/"+localName),{
                name: localName,
                count: val+1 
                 
            })
            .then( ()=> {
                // alert("Data updated successfully")
            })
            .catch( (error) =>{
                alert("Unssuccessful, error "+error) 
            });
        }

        // window.onload = SelectData;

        function checkValidArg(arrNonValidPath, arrVal){
            
            var result = arrNonValidPath.filter(x => arrVal.includes(x.type)  );
            if(result.length >0){   
                
                // console.log(arrVal); 
                result.forEach((x) => {
                    arrVal = fixPathArgs(x,arrVal); 
                })
                
            }

            return arrVal;
            
        }


        function fixPathArgs(arrResult, word){ 

            let type =arrResult.type ;
            // console.log(arrResult)
            const regex = new RegExp(`[\\${type}]`, "g");  
            word = word.replace(regex, arrResult.replace);

            return word;
 
        }
  
  
    
});

