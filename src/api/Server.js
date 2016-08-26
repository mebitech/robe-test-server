import Class from "../class/Class"
import restify from "restify"
import morgan from "morgan"
import JSONRouter from "./JSONRouter"
import UploadRouter from "./UploadRouter"
import {decodeQueryParams} from "../util/middlewares"
import FileUtility from "../util/FileUtility";
import bodyParser from "body-parser";
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
        this.__server.use(morgan("dev"));
        this.__server.use(bodyParser.urlencoded());
        this.__server.use(bodyParser.json());
        this.__port = port;
        this.__routes = {};
    }

    routeJSON(dbPath, requestPath, idField) {
        new JSONRouter(this.__server, dbPath, requestPath, idField).route()
        return this;
    }

    routeUpload(tempPath, requestPath, extra) {
       new UploadRouter(this.__server, tempPath, requestPath, extra).route();
       return this;
    }

    start() {
        let that = this;
        this.__server.listen(this.__port, function () {
            console.log(`${that.__server.name} listening at ${that.__server.url}`);
        });
    }
}
