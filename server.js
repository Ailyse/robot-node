//*************************************************************IMPORTS_ET_ATTRIBUTS**************************************************************************************************************************
var serviceAdd = require("./ajout-bdd-mongo/services/service.js");

//--------------------------GET_TODAY--------------------------------------
const ts = Date.now();

console.log(ts);

const yesterdayTimeStamp = ts - ((24*60*60*1000)*2);

let date_ob = new Date(yesterdayTimeStamp);
let year = date_ob.getFullYear();
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let day = ("0" + date_ob.getDate()).slice(-2);
let dateToImport = year + "-" + month + "-" + day;

console.log("j-2="+dateToImport);

let dateTest = "2017";


//--------------------------URLS_OPENAGENDA--------------------------------
var url_OA_updated =
  "https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-cibul&q=&rows=100&refine.updated_at="+dateToImport;

var url_test = 
   "https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-cibul&q=&rows=10000&refine.updated_at="+dateTest;


//*************************************************************ADD_IN_BDD**************************************************************************************************************************
//serviceAdd.reinit();
//serviceAdd.addInBDD(url_test);

async function letsAdd(){
  for (i=0; i<5;i++){
    let mois = serviceAdd.addLeadingZeros(i+1, 2);
    let dateTest = "2022-"+mois;
    let url_add = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-cibul&q=&rows=10000&refine.updated_at="+dateTest;
    console.log (url_add);
    var ajout = await serviceAdd.addInBDD(url_add);
  }
}

letsAdd();

