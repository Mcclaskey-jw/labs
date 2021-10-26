const express = require('express');
const service = express();
service.use(express);
const port = 5000;
service.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});

const fs = require('fs');
const mysql = require('mysql');


const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);


service.post('/humans', (request, response) => {
    if (request.body.username && request.body.screenname) {
        const parms = [request.body.username, request.body.screenname];
        const query = 'INSERT INTO human(username, screenname) VALUES (?, ?)';
        connection.query(query, parms, (error, result) => {
          if (error) {
            response.status(500);
            response.json({
              ok: false,
              results: error.message,
            });
          } else {
            response.json({
              ok: true,
              results: result.insertId,
            });
          }
        });
    } else {
        response.status(400);
        response.json({
            ok: false,
            results: 'Incomplete memory.',
            });
    }
});

service.post('/follow/:followee/:follower', (request, response) => {
    if (request.parms.followee && request.params.follower){
        const params = [request.parms.followee, request.params.follower];
        const query = 'INSERT INTO follwers(followee, follower) VALUES (?,?)';
        connection.query(query, parms, (error, result) => {
            if(error){
                response.status(500);
            } else {
                response.status(204);
            }
        });

    } else {
        response.status(400);
    }

});


service.get('/humans/:id', (request, response) => {
      const id = request.params.id;
      const query = "SELECT id FROM human WHERE id='" + id + "'";
      connection.query(query, (error, result) => {
        if (error) {
            response.status(500);
            response.json({
              ok: false,
              results: error.message,
            });
          } else {
            response.json({
              ok: true,
              results: result.selectId, // ??
            });
          }

      });
});

function rowToId(row) {
        return 
          row.id;
};

service.get('/follow/:followee', (request, response) => {
    const followee = request.params.followee;
    const query = "SELECT * FROM follow WHERE followee='" + followee + "'";
    connection.query(query, (error, rows) => {
        if (error) {
            response.status(500);
            response.json({
              ok: false,
              results: error.message,
            });
          } else {
            response.json({
              ok: true,
              results: rows.map(rowToId)// ??
            });
          } 
    })
    
});

service.delete('/humans/:id', (request, response) => {
    const parms = request.params.id;
    const query = "DELETE FROM humans WHERE id=" + id;
    connection.query(query, (error) => {
        if(error) {
            response.status(500);
            response.json({
                ok: false,
                results: error.message,
            });
        } else {
            response.status(204);
        }
    });
});

service.delete('/follow/:followee/:follower', (request, response) => {
    const followee = request.params.followee;
    const follower = request.params.follower;
    const query = "DELETE FROM follow WHERE followee='" + followee + "' AND follower='" + follower + "'";
    connection.query(query, (error) => {
        if (error) {
            response.status(500);
            response.json({
              ok: false,
              results: error.message,
            });
          } else {
              response.status(204);
            response.json({
              ok: true,
            });
          }
    });
});