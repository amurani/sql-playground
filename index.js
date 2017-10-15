const db = require('./modules/db');

let renderDatabase = (database) => {
    document.querySelector('input[type=submit]').disabled = false;

    document.getElementById('databaseName').innerHTML = database.name;
    document.getElementById('databaseTables').innerHTML = '';

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
};

let loginHandler = (e) => {
    e.preventDefault();
    document.querySelector('input[type=submit]').disabled = true;

    let formData = new FormData(loginForm),
        dbConfig = {
            user     : formData.get('userName') || 'root',
            password : formData.get('password') || '',
            database : formData.get('database') || ''
        };
    db.getDatabaseDetails(dbConfig)
        .then(renderDatabase)
        .catch((err) => {
            throw err;
            document.querySelector('input[type=submit]').disabled = false;
        });
};

let loginForm = document.querySelector('form');
loginForm.addEventListener('submit', loginHandler);

