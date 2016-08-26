import chai from "chai";
import restify from "restify";
import Server from "./Server";
import UploadRouter from "./UploadRouter";

/** @test {api/Server} **/
describe("api/UploadRouter.js", () => {

    let client;
    before(() => {
        let server = new Server("test server", 3002);
        server.routeUpload("../../data/files", "/files");
        server.start();
        client = restify.createJsonClient({
            url: 'http://127.0.0.1:3002'
        });
    });

    /** @test {JsServer#constructors} */
    it("constructors", () => {
        console.log(Server);
    });
    it("info", (done) => {
        client.post("/files", ["testfile.txt"] , (err, req, res, data) => {
            console.log(err);
            console.log(data);
            done();
        });
    })
});