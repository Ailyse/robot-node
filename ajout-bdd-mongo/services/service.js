//*************************************************************IMPORTS_ET_ATTRIBUTS**************************************************************************************************************************
var express = require("express");
const axios = require("axios");

var sallesDao = require("../dao/salles-dao-mongo");

//*************************************************************FONCTION_ADD-IN-BDD**************************************************************************************************************************

async function addInBDD(url_OA_updated){
    try {
        const response = await axios.get(url_OA_updated);
  
        if (response.status == 200) {
          let allResponse = response.data;
          let recordsObjects = allResponse.records;
  
          var numSalle = 0;
          var nombreInsertions = 0;
  
          for (salle in recordsObjects) {
            //--------------------Récupération_et_Reconstruction_Objet_JSON--------------------------------------
            numSalle++;
            console.log("----------------------------------------------------index " +numSalle +"----------------------------------------------------------------------------------------------");
            console.log("*************init nouvelle salle dont les tags sont= " +recordsObjects[salle].fields.tags);
            let salleJSON = recordsObjects[salle];
            let department = salleJSON.fields.department;
            let uid = salleJSON.fields.uid;
            let region = salleJSON.fields.region;
            let tagsS = salleJSON.fields.tags;
            let placename = salleJSON.fields.placename;
            let timetable = salleJSON.fields.timetable;
            let city = salleJSON.fields.city;
            let address = salleJSON.fields.address;
            let date_start = salleJSON.fields.date_start;
            let date_end = salleJSON.fields.date_end;
            let city_district = salleJSON.fields.city_district;
            let description = salleJSON.fields.description;
            let pricing_info = salleJSON.fields.pricing_info;
            let title = salleJSON.fields.title;
            let free_text = salleJSON.fields.free_text;
            let latlon = salleJSON.fields.latlon;
            
  
            //!!!!!!!!!!!!!!!!!!Récupération_Variables!!!!!!!!!!!!!!!!!!!!!!!!
            var exempleObj = await sallesDao.findFirstDocument();
            var departmenttoFind = department;
            console.log("*********************************va faire la recherche : " +departmenttoFind);
            nombreInsertions++;
            //------------------------------Find_all_Ids-TagsP_to_push_salles-----------------------------------------------------
            var tagsCheckIncludes = tagsS;
            var tagPtoFind = [];
            if (tagsS != undefined) {
              if (
                tagsCheckIncludes.toLowerCase().includes("concert")
              ) {
                console.log("push Concert");
                tagPtoFind.push("Concert");
              } if (
                tagsCheckIncludes.toLowerCase().includes("danse")
              ) {
                console.log("push Danse");
                tagPtoFind.push("Danse");
              } if (
                tagsCheckIncludes.toLowerCase().includes("famille") ||
                tagsCheckIncludes.toLowerCase().includes("enfant") ||
                tagsCheckIncludes.toLowerCase().includes("jeune")
              ) {
                console.log("push Jeune Public");
                tagPtoFind.push("JeunePublic");
              } if (
                tagsCheckIncludes.toLowerCase().includes("théâtre") ||
                tagsCheckIncludes.toLowerCase().includes("theatre")
              ) {
                console.log("push Théatre");
                tagPtoFind.push("Théâtre");
              } if (
                tagsCheckIncludes.toLowerCase().includes("exposition") ||
                tagsCheckIncludes.toLowerCase().includes("musée")
              ) {
                console.log("push Expo");
                tagPtoFind.push("Exposition");
              } if (
                tagsCheckIncludes.toLowerCase().includes("cirque")
              ) {
                console.log("push Cirque");
                tagPtoFind.push("Cirque");
              } if (
                tagsCheckIncludes.toLowerCase().includes("festival")
                ) {
                console.log("push Festival");
                tagPtoFind.push("Festival");
              }
  
              var indexTagsP = [];
              console.log("---------------Nombre tags = "+tagPtoFind.length);
              for (let tag of tagPtoFind){
                console.log("Tag :"+tag);
                let indexToAdd = exempleObj.listTags.findIndex((data) => data.tagP === tag);
                console.log(indexToAdd);
                indexTagsP.push(indexToAdd);
              }
  
              //--------------------Vérification_Department_Exists--------------------------------------------------
              if ((departmenttoFind != undefined)
              &&((region=="Île-de-France")
              ||(region=="Nouvelle-Aquitaine")
              ||(region=="Auvergne-Rhône-Alpes")
              ||(region=="Occitanie")
              ||(region=="Provence-Alpes-Côte d'Azur")
              ||(region=="Hauts-de-France")
              ||(region=="Grand Est")
              ||(region=="Centre-Val de Loire")
              ||(region=="Pays de la Loire")
              ||(region=="Normandie")
              ||(region=="Bretagne")
              ||(region=="Bourgogne-Franche-Comté")
              ||(region=="Aquitaine-Limousin-Poitou-Charentes")
              ||(region=="Alsace-Champagne-Ardenne-Lorraine")
              ||(region=="Languedoc-Roussillon-Midi-Pyrénées")
              ||(region=="Nord-Pas-de-Calais-Picardie")
              ||(region=="Ile-de-France")
              ||(region=="Corse")
              ||(region=="La Réunion")
              ||(region=="Guadeloupe")
              ||(region=="La Réunion")
              ||(region=="Martinique")
              ||(region=="Guyane")
              )) {
                try {
                  var departementfound = await sallesDao.findById(departmenttoFind);
  
                //--------------------Department_Exists_:_MAJ_List_Ajout_SalleJSON------------------------------------
                  console.log("********************TRY département à chercher = " +departmenttoFind);
                  console.log("********************departement trouvé objet = " +departementfound);
  
                  for (let index of indexTagsP){
                    departementfound.listTags[index].listSalles.push({
                      uid,
                      region,
                      tagsS,
                      placename,
                      timetable,
                      city,
                      address,
                      date_start,
                      date_end,
                      city_district,
                      description,
                      pricing_info,
                      title,
                      free_text,
                      latlon
                    });
                  }
  
                  let modifListAjoutSalle = await sallesDao.updateOne(departementfound);
                  console.log("***************Update effectué");
  
  
                //--------------------Department_Doesn'tExist_:_Nouveau_Department_+_Ajout_List_+_SalleJSON--------------
                } catch {
                  console.log("********************CATCH département à chercher non trouvé = " +departmenttoFind);
                  console.log("*************departement non trouvé = " +JSON.stringify(departmenttoFind));
                  
                  let myListSallesVides = []; //si_idTagP_absent_des_tags
  
                  var myListSalleWithTag = [];
                  myListSalleWithTag.push({
                    uid,
                    region,
                    tagsS,
                    placename,
                    timetable,
                    city,
                    address,
                    date_start,
                    date_end,
                    city_district,
                    description,
                    pricing_info,
                    title,
                    free_text,
                    latlon
                  });
                  
                  let myListTags = [];
                  myListTags.push(
                    {
                      tagP: "Concert",
                      listSalles: myListSallesVides,
                    },
                    {
                      tagP: "Danse",
                      listSalles: myListSallesVides,
                    },
                    {
                      tagP: "JeunePublic",
                      listSalles: myListSallesVides,
                    },
                    {
                      tagP: "Théâtre",
                      listSalles: myListSallesVides,
                    },
                    {
                      tagP: "Exposition",
                      listSalles: myListSallesVides,
                    },
                    {
                      tagP: "Cirque",
                      listSalles: myListSallesVides,
                    },
                    {
                      tagP: "Festival",
                      listSalles: myListSallesVides,
                    }
                  );
  
                  console.log("---------------Nombre indexs = "+indexTagsP.length);
                  for (let i of indexTagsP){
                    console.log("*****index dans inexTags ="+i);
                    console.log("********* myListTags[index]"+JSON.stringify(myListTags[i]));
                    myListTags[i].listSalles = myListSalleWithTag;
                  }
  
                  var newSalle = new sallesDao.ThisPersistentModel({
                    department: departmenttoFind,
                    listTags: myListTags,
                  });
                  let ajoutSalle = await sallesDao.save(newSalle);
                  console.log(
                    "************************document inséré ok : " +JSON.stringify(newSalle));
                }
                console.log(nombreInsertions);
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
        console.log(err+": error - " + error );
      }
}

//*************************************************************FONCTION_REINIT**************************************************************************************************************************

async function reinit(){
  try {
    let reinit = await sallesDao.reinit_db();
  } catch (error) {
    console.error(error);
  }
}

function addLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, '0');
}

module.exports.addInBDD = addInBDD;
module.exports.reinit = reinit;
module.exports.addLeadingZeros = addLeadingZeros;