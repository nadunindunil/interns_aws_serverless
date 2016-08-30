
var DOC = require('dynamodb-doc');
var docClient = new DOC.DynamoDB();
var AWS = require("aws-sdk");
var table = "interns";

module.exports.postUser = function(event, context) {
  console.log(JSON.stringify(event, null, ' '));
  var docClient = new AWS.DynamoDB.DocumentClient();

  var datetime = new Date().getTime().toString();
  var params = {};
  params.TableName = "interns";
  params.Item = {
                  "id"  : event.id,
                  "firstname" : event.firstname ,
                  "lastname" : event.lastname ,
                  "fullname" : event.fullname,
                  "NIC" : event.NIC,
                  "password" : event.password,
                  "email" : event.email,
                  "mobile" : event.mobile,
                  "tel" : event.tel,
                  "address" : event.address,
                  "goals" : event.goals,
                  "social" : event.social,
                  "techs" : event.techs
                };

  var pfunc = function(err, data) {
    if (err) {
      console.log(err, err.stack);
      context.fail('ERROR: ' + err);
    } else {
      context.succeed('It worked!');
    }
  }

  docClient.putItem(params, pfunc);
};
////////////////////////////////////////////////////////////////////////////////
module.exports.updateUser = function(event, context) {
  var docClient = new AWS.DynamoDB.DocumentClient()

  console.log(JSON.stringify(event, null, ' '));


  var params = {
      TableName:"interns",
      Key:{"id"  : event.id},
      UpdateExpression: "set firstname = :f, lastname= :l, fullname= :fn, nic= :nic, email= :e, mobile= :m, tel= :tel, address= :a, goals= :g, social= :s, techs= :t ",
      ExpressionAttributeValues:{
          ":f" : event.firstname,
          ":l" : event.lastname,
          ":fn" : event.fullname,
          ":nic" : event.NIC,
          ":e" : event.email,
          ":m" : event.mobile,
          ":tel" : event.tel,
          ":a" : event.address,
          ":g" : event.goals,
          ":s" : event.social,
          ":t" : event.techs

      },
      ReturnValues:"UPDATED_NEW"

  };

  console.log("Updating the item...");


  var pf = function(err, data) {
      if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
          context.fail('ERROR: ' + err);
      } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          context.succeed('It worked!');
      }
  };

  docClient.update(params,pf);

};
///////////////////////////////////////////////////////////////////////////////////
module.exports.getUsers = function(event, context) {

  docClient.scan({
    TableName: "interns",
    Limit : 50
    },
    function(err, data) {
      if (err) {
        console.log(err, err.stack);
        context.fail('ERROR: ' + err);
      } else {
        var response = {};
        response.records = [];
        for (var i in data.Items) {
          console.log(data.Items[i]);
          response.records.push(data.Items[i]);
        }
        console.log(response);
        context.succeed(response);
      }
    }
  );
};
////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.getUser = function(event, context) {

  console.log(event.id);
  var params = {
      "TableName": "interns",
      "Key":{
          "id": event.id,
      }
  };

  docClient.getItem(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          context.succeed(err);
      } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
          console.log(data);
          context.succeed(data);
          //context.succeed(JSON.stringify(data, null, 2));
      }
  });

};
