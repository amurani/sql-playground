const mysql = require('mysql');

let loginHandler = (e) => {
    e.preventDefault();
    
    let formData = new FormData(loginForm);
    let databaseName = formData.get('database') || '';
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : formData.get('userName') || 'root',
        password : formData.get('password') || '',
        database : databaseName
    });
    
    connection.connect();
    
    connection.query('SHOW TABLES', (err, res) => {
        if (err) throw err;
        var database = {
            name: databaseName,
            tables : {}
        };
        var tables = res.map(r => r.Tables_in_world);
        var sqlQueries = tables.map(table => `DESCRIBE ${table};`);
        sqlQueries.forEach((sqlQuery, index) => {
            connection.query(sqlQuery, (err, res) => {
                if (err) throw err;
                
                let tableName = tables[index],
                    tableFields = [];
                res.forEach((r, index) => { tableFields.push(r); });
                database.tables[tableName] = tableFields;

                if (index === (tables.length - 1)) {
                    renderDatabase(database);
                    connection.end();
                }
            });
        });
    });
}

let renderDatabase = (database) => {
    var tablesNames = Object.keys(database.tables);
    for (var tableName in database.tables) {
        var tableFields = database.tables[tableName];
        var renderedFieldDetails = tableFields
            .map((tableField) => `<li>${tableField.Field} - ${tableField.Type}</li>`)
            .join('');

        document.getElementById('databaseTables').innerHTML += `
            <div class="table">
                <div class="table_details">
                   ${tableName} 
                </div>
                <div class="table__columns">
                    <ul>
                        ${renderedFieldDetails}
                    </ul>
                </div>
            </div>
        `;
    }

    document.getElementById('databaseName').innerHTML = database.name;
}

let loginForm = document.querySelector('form');
loginForm.addEventListener('submit', loginHandler);
