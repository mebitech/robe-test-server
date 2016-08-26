import Class from "../class/Class"
import restify from "restify"
import JSONRouter from "./JSONRouter"
import {decodeQueryParams} from "../util/middlewares"

/**
 * Provide ordering to the result set..
 */
export default class Server extends Class {

    __server;
    __port;
    __routes;

    constructor(name, port) {
        super();
        this.__server = restify.createServer({
            name: name
        });
        this.__server.use(decodeQueryParams);
        this.__server.use(restify.bodyParser());
        this.__port = port;
        this.__routes = {};
    }

    routeJSON(dbPath, requestPath, idField) {
        new JSONRouter(this.__server, dbPath, requestPath, idField).routeJSON();
    }

    upload() {

    }

    start() {
        let that = this;
        this.__server.listen(this.__port, function () {
            console.log(`${that.__server.name} listening at ${that.__server.url}`);
        });
    }
}
