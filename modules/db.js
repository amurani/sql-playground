const mysql = require('mysql');

let connection,
    databaseConfig = {
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : ''
    };

let getDatabaseDetails = (config) => {
    return new Promise((resolve, reject) => {
        let _databaseConfig = Object.assign({}, databaseConfig, config);
        connection = mysql.createConnection(_databaseConfig);
        
        let database = {
                name: _databaseConfig.database,
                tables : {}
            },
            tableNames = [],
            showTables = (err, rows) => {
                if (err) { reject(err); }
                tableNames = rows.map(row => row[`Tables_in_${database.name}`]);
                let sqlQueries = tableNames.map(tableName => `DESCRIBE ${tableName};`);
                sqlQueries.forEach(describeTable);
            },
            describeTable = (sqlQuery, tableIndex) => {
                connection.query(sqlQuery, (err, rows) => {
                    if (err) { reject(err); }
                    let tableName = tableNames[tableIndex],
                        tableFields = [];
                        rows.forEach((row, index) => { tableFields.push(row); });
                        database.tables[tableName] = tableFields;
                    
                    if (tableIndex === (tableNames.length -1)) {
                        resolve(database);
                        connection.end();
                    }
                });
            };

        connection.connect();
        connection.query('SHOW TABLES', showTables);
    });
};

module.exports = { getDatabaseDetails };
