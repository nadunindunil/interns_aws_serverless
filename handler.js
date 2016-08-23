
var DOC = require('dynamodb-doc');
var docClient = new DOC.DynamoDB();
var table = "interns";

module.exports.postUser = function(event, context) {
  console.log(JSON.stringify(event, null, ' '));

  var datetime = new Date().getTime().toString();
  var params = {};
  params.TableName = "interns";
  params.Item = {
                  "id"  : event.id,
                  "username" : event.username
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

module.exports.getUser = function(event, context) {

  //var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "interns";
  var id = event.id;
  console.log(id);
  var params = {
      TableName: table,
      Key:{
          "id": id,
      }
  };
  docClient.getItem(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
          console.log(data);
          context.succeed(data);
      }
  });

};
