import Class from "../class/Class"
import restify from "restify"
import morgan from "morgan"
import JSONRouter from "./JSONRouter"
import {decodeQueryParams} from "../util/middlewares"

/**
 * Provide ordering to the result set..
 */
export default class Server extends Class {

    __server;
    __port;
    __JSONRouter;

    constructor(name, port) {
        super();
        this.__server = restify.createServer({
            name: name
        });
        this.__server.use(decodeQueryParams);
        this.__server.use(morgan("dev"));
        this.__server.use(restify.bodyParser());
        this.__port = port;
        this.__JSONRouter = new JSONRouter(this.__server);
    }

    routeJSON(dbPath, requestPath, idField) {
        this.__JSONRouter.routeJSON(dbPath, requestPath, idField);
        return this;
    }

    upload(targetDir) {
        this.__JSONRouter.upload(targetDir);
        return this;
    }

    start() {
        let that = this;
        this.__server.listen(this.__port, function () {
            console.log(`${that.__server.name} listening at ${that.__server.url}`);
        });
    }
}
