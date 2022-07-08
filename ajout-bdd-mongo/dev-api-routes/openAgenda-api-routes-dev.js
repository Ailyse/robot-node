//*************************************************************IMPORTS_ET_ATTRIBUTS**************************************************************************************************************************
var express = require("express");
var app = express();
const apiRouter = express.Router();
const axios = require("axios");

var sallesDao = require("../dao/salles-dao-mongo");

//support parsing of JSON post data
var jsonParser = express.json({ extended: true });
app.use(jsonParser);

//--------------------------URLS_OPENAGENDA--------------------------------
var url_OA_updated =
  "https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-cibul&q=&rows=100&refine.updated_at=2022-04-28";

//*************************************************************REINIT_BDD**************************************************************************************************************************
//http://localhost:8282/salles-mongo/public/reinit
apiRouter
  .route("/salles-mongo/public/reinit")
  .get(async function (req, res, next) {
    try {
      let reinit = await sallesDao.reinit_db();
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send({ err: "error - " + error });
    }
  });

//*************************************************************SAVE_SALLES_OPENAGENDA**************************************************************************************************************************
//http://localhost:8282/salles-mongo/public/saveOpenAgenda
apiRouter
  .route("/salles-mongo/public/saveOpenAgenda")
  .get(async function (req, res, next) {
    try {
      const response = await axios.get(url_OA_updated);
      if (response.status == 200) {
        let allResponse = response.data;
        let recordsObjects = allResponse.records;
        for (salle in recordsObjects) {
          console.log("**********************début du for");
          let salleJSON = recordsObjects[salle];
          console.log(JSON.stringify(salleJSON));
          let uid = salleJSON.fields.uid;
          let region = salleJSON.fields.region;
          let tags = salleJSON.fields.tags;
          let placename = salleJSON.fields.placename;
          let timetable = salleJSON.fields.timetable;
          let city = salleJSON.fields.city;
          let department = salleJSON.fields.department;
          let date_start = salleJSON.fields.date_start;
          let date_end = salleJSON.fields.date_end;
          let city_district = salleJSON.fields.city_district;
          var newSalle = new sallesDao.ThisPersistentModel({
            uid,
            region,
            tags,
            placename,
            timetable,
            city,
            department,
            date_start,
            date_end,
            city_district,
            newSalle,
          });
          console.log("**********************l'objet json = " + JSON.stringify(newSalle));
          let ajoutSalle = await sallesDao.save(newSalle);
        }
        res.send(recordsObjects);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ err: "error - " + error });
    }
  });

//*************************************************************SAVE_ORGANIZED_SALLES_OPENAGENDA**************************************************************************************************************************
//http://localhost:8282/salles-mongo/public/saveOrganizedOpenAgenda
apiRouter
  .route("/salles-mongo/public/saveOrganizedOpenAgenda")
  .get(async function (req, res, next) {
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
          let tags = salleJSON.fields.tags;
          let placename = salleJSON.fields.placename;
          let timetable = salleJSON.fields.timetable;
          let city = salleJSON.fields.city;
          let date_start = salleJSON.fields.date_start;
          let date_end = salleJSON.fields.date_end;
          let city_district = salleJSON.fields.city_district;

          //!!!!!!!!!!!!!!!!!!Récupération_Variables!!!!!!!!!!!!!!!!!!!!!!!!
          var exempleObj = await sallesDao.findFirstDocument();
          var departmenttoFind = department;
          console.log("*********************************va faire la recherche : " +departmenttoFind);
          nombreInsertions++;
          //------------------------------Find_all_Ids-TagsP_to_push_salles-----------------------------------------------------
          var tagsCheckIncludes = tags;
          var tagPtoFind = [];
          if (tags != undefined) {
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
            if (departmenttoFind != undefined) {
              try {
                var departementfound = await sallesDao.findById(departmenttoFind);

              //--------------------Department_Exists_:_MAJ_List_Ajout_SalleJSON------------------------------------
                console.log("********************TRY département à chercher = " +departmenttoFind);
                console.log("********************departement trouvé objet = " +departementfound);

                for (let index of indexTagsP){
                  departementfound.listTags[index].listSalles.push({
                    uid,
                    region,
                    tags,
                    placename,
                    timetable,
                    city,
                    date_start,
                    date_end,
                    city_district,
                    newSalle,
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
                  tags,
                  placename,
                  timetable,
                  city,
                  date_start,
                  date_end,
                  city_district,
                  newSalle,
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
          res.send();
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ err: "error - " + error });
    }
  });

exports.apiRouter = apiRouter;
