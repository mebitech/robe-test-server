const restify = require("restify");
const Server = require("./lib/api/Server").default;
const UploadRouter = require("./lib/api/UploadRouter").default;

const server = new Server("test server", 3002);
server.routeUpload("../../data/files", "/files");
server.start();
const client = restify.createJsonClient({
    url: 'http://127.0.0.1:3002'
});

client.post("/files", ["testfile.txt"] , (err, req, res, data) => {
    console.log(err);
    console.log(data);
});

console.log("Something...");