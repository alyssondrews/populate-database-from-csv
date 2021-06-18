const csvtojson = require('csvtojson');
const mongodb = require('mongodb');

// Estabelecendo conexão com o banco de dados
var url = "mongodb://localhost:27017/ImportCsv";
var databaseConnection;
mongodb.MongoClient.connect(url, {
    useUnifiedTopology: true,
}).then((client) => {
    console.log('Banco de dados conectado!');
    databaseConnection = client.db();
}).catch(err => {
    console.log(`Erro ao se conectar: ${err.message}`);
});

// Nome do arquivo
const fileName = "products.csv";

var arrayToInsert = [];
csvtojson().fromFile(fileName).then(source => {
    // Buscando todos os dados do arquivo
    for (var i = 0; i < source.length; i++) {
        var oneRow = {
            produto: source[i]["name"],
            preco: source[i]["price"],
            quantidade: source[i]["quantity"],
        };
        arrayToInsert.push(oneRow);
    }

    //Populando a table 'products' no mongo
    var collectionName = 'products';
    var collection = databaseConnection.collection(collectionName);
    collection.insertMany(arrayToInsert, (err, result) => {
        if (err) console.log(err);
        if(result){
            console.log("CSV importado com sucesso!!");
        }
    });
});