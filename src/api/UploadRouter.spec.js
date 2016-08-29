import chai from "chai";
import restify from "restify";
import Server from "./Server";
import FileUtility from "../util/FileUtility";
import UploadRouter from "./UploadRouter";
import FormData from "form-data";
import fs from "fs";

/** @test {api/Server} **/
describe("api/UploadRouter.js", () => {

    let client;
    before(() => {
        let server = new Server("test server", 3002);
        server.routeUpload("data/files", "files",{
            appRootPath: FileUtility.getAppHome()
        });
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
        let expectedFileName = "testfile.txt";
        client.post("/files", [expectedFileName] , (err, req, res, data) => {
            chai.assert.equal(data.length, 1);
            chai.assert.equal(data[0].filename, expectedFileName);
            done();
        });
    })

    it("upload", (done) => {
        client.get("/files/__detail", (err, req, res, data) => {
            let fileAbsoulePath = "data/files/upload.txt";
            if(err) {
                chai.assert.isOk(false, "Failed on server side ! Reason : " + err);
                done();
                return;
            }

            let formData = new FormData();
            formData.append('files', fs.createReadStream(data.appRootPath + fileAbsoulePath));
            client.put("/files", formData, (err, req, res, data) => {
                console.log(data);
                done();
            });
        });
    });
});