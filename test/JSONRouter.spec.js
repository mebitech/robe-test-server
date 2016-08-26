import Server from "../src/index"
import restify from "restify"
import chai from "chai";

const expect = chai.expect;

describe("robe-test-server", (done) => {
    let client;
    let actors = require("../data/data.json").actors;

    before(() => {
        let server = new Server("test server", 4735);
        server.routeJSON("../../data/data.json", "api/");
        server.start();
        client = restify.createJsonClient({
            url: 'http://127.0.0.1:4735'
        });
    });

    it("should return all actors", (done) => {
        client.get("/api/actors", (err, req, res, data) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(data.length).to.be.equal(1);
            expect(data).to.be.deep.equal(actors);
            done();
        });
    });

    const newActor = { "id": "2", "name": "vahi", "surname": "öz", "films": ["çifte tabancalı damat"] };

    it("should insert a new actor", (done) => {
        client.post("/api/actors", newActor, (err, req, res, data) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            actors.push(newActor);
            done();
        });
    });

    it("should check if new actor has been added", (done) => {
        client.get("/api/actors", (err, req, res, data) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(data).to.be.deep.equal(actors);
            done();
        });
    });

    it("should return the actor by id", (done) => {
        client.get("/api/actors/2", (err, req, res, data) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(data).to.be.deep.equal(newActor);
            done();
        });
    });

    it("should update the actor", (done) => {
        newActor.films.push("diğer film");
        client.put("/api/actors/2", newActor, (err, req, res, data) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });

    it("should check if the actor has been updated", (done) => {
        client.get("/api/actors/2", (err, req, res, data) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(data).to.be.deep.equal(newActor);
            done();
        });
    });

    it("should reset actors database", (done) => {
        client.get("/api/res/et/actors", (err, req, res, data) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });

    it("should check if reset worked out ", (done) => {
        client.get("/api/actors", (err, req, res, data) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(data.length).to.be.equal(1);
            done();
        });
    });

    it("should delete the actor", (done) => {
        client.del("/api/actors/1", (err, req, res, data) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });

    it("should check if the actos is removed", (done) => {
        client.get("/api/actors", (err, req, res, data) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(data.length).to.be.empty;
            done();
        });
    });

});

