//*************************************************************IMPORTS_ET_ATTRIBUTS**************************************************************************************************************************
var mongoose = require("mongoose");
var sallesConfigMongo = require("../config_mongo/config-mongo");
var genericPromiseMongoose = require("./generic-promise-mongoose");

var myDBsalles = sallesConfigMongo.myDBsalles;

var ThisPersistentModel;

//*************************************************************CREATTION_SCHEMA_SALLES**************************************************************************************************************************
function initMongoose() {
  mongoose.Connection = myDBsalles;
  const sallesSchema = new mongoose.Schema(
  {
    _id: { type: String, alias: "department" },
    listTags: [
      {
        _id: { type: String, alias: "tagP" },
        listSalles: [
          {
            _id: { type: String, alias: "uid" },
            region: String,
            tagsS: String,
            placename: String,
            timetable: String,
            city: String,
            address: String,
            date_start: String,
            date_end: String,
            city_district: String,
            description: String,
            pricing_info: String,
            title: String,
            free_text: String,
            latlon: []
          },
        ],
      },
    ],
  }
  );

  sallesSchema.set("id", false);
  sallesSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret._v;
    },
  });
  ThisPersistentModel = mongoose.model("Salle", sallesSchema);
}

initMongoose();

//*************************************************************SUPPRESS_+_JEU_DE_DONNEES**************************************************************************************************************************
function reinit_db() {
  return new Promise((resolve, reject) => {
    //suppression des élements de la bdd
    const deleteAllFilter = {};
    ThisPersistentModel.deleteMany(deleteAllFilter, function (err) {
      if (err) {
        console.log(JSON.stringify(err));
        reject(err);
      }

      let myListSalles = [];
      myListSalles.push(
        {
          uid: "999999999",
          region: "Elise",
          tags: "Elise",
          placename: "Elise",
          timetable: "Elise",
          city: "Elise",
          date_start: "Elise",
          date_end: "Elise",
          city_district: "Elise",
        },
        {
          uid: "888888888",
          region: "Elisebis",
          tags: "Elisebis",
          placename: "Elisebis",
          timetable: "Elisebis",
          city: "Elisebis",
          date_start: "Elisebis",
          date_end: "Elisebis",
          city_district: "Elisebis",
        }
      );

      let myListSallesVides = [];

      let myListTags =[];
      myListTags.push(
        {
          tagP : "Concert",
          listSalles : myListSallesVides
        },
        {
          tagP : "Danse",
          listSalles : myListSallesVides
        },
        {
          tagP : "JeunePublic",
          listSalles : myListSallesVides
        },
        {
          tagP : "Théâtre",
          listSalles : myListSallesVides
        },
        {
          tagP : "Exposition",
          listSalles : myListSallesVides
        },
        {
          tagP : "Cirque",
          listSalles : myListSallesVides
        },
        {
          tagP : "Festival",
          listSalles : myListSallesVides
        },
      )

      //insertion jeu de données après suppression
      new ThisPersistentModel({
        department: "EliseDepartment",
        listTags: myListTags,
      }).save();
      resolve({ action: "salles collections re-initialized" });
    });
  });
}

//*************************************************************DAO**************************************************************************************************************************
function findById(id) {
  return genericPromiseMongoose.findByIdWithModel(id, ThisPersistentModel);
}

function findByCriteria(criteria) {
  return genericPromiseMongoose.findByCriteriaWithModel(criteria,ThisPersistentModel);
}

function findFirstDocument() {
  return genericPromiseMongoose.findFirstDocumentWithModel(ThisPersistentModel);
}

function save(entity) {
  return genericPromiseMongoose.saveWithModel(entity, ThisPersistentModel);
}

function updateOne(newValueOfEntityToUpdate) {
  return genericPromiseMongoose.updateOneWithModel(
    newValueOfEntityToUpdate,
    newValueOfEntityToUpdate.department,
    ThisPersistentModel
  );
}

function deleteOne(idOfEntityToDelete) {
  return genericPromiseMongoose.deleteOneWithModel(
    idOfEntityToDelete,
    ThisPersistentModel
  );
}

//*************************************************************EXPORTS**************************************************************************************************************************
module.exports.ThisPersistentModel = ThisPersistentModel;
module.exports.reinit_db = reinit_db;
module.exports.findById = findById;
module.exports.findByCriteria = findByCriteria;
module.exports.findFirstDocument = findFirstDocument;
module.exports.save = save;
module.exports.updateOne = updateOne;
module.exports.deleteOne = deleteOne;
