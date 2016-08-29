import chai from "chai";
import path from "path";
import Server from "./Server";

/** @test {api/Server} **/
describe("api/Server.js", () => {
    /** @test {JsServer#constructors} */
    it("constructors", () => {
        console.log(Server);
    });
    it("routeJSON", () => {
        let server = new Server("test server", 4736);
        server.routeJSON("../../data/data.json", "api/");
        server.start();
    });
    it("routeUpload", () => {
        let server = new Server("test server", 4737);
        path.resolve(__dirname, "../../")
        server.routeUpload("../../data/data.json", "api/");
        server.start();
    });

    it("start", () => {
        let server = new Server("test server", 4738);
        server.routeJSON("../../data/data.json", "api/");
        server.start();
    })
});