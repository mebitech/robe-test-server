import Class from "../class/Class"
import {_extend as extend} from "util"

export default class JSONRouter extends Class {

    __server;
    __routes;

    constructor(server) {
        super();
        this.__server = server;
        this.__routes = {};
    }

    routeJSON(dbPath, requestPath, idField) {
        requestPath = requestPath.replace(/\//g, '');
        let route = {
            dbPath: dbPath,
            requestPath: requestPath,
            idField: !idField ? "id" : idField,
            db: extend(require(dbPath), {})
        };

        this.__routes[requestPath] = route;
        this.__server.use(this.__requestValidatior);

        this.__server.get("/:endpointRoot/:entity", this.__getAll);
        this.__server.get("/:endpointRoot/:entity/:id", this.__get);
        this.__server.post("/:endpointRoot/:entity", this.__post);
        this.__server.put("/:endpointRoot/:entity/:id", this.__put);
        this.__server.del("/:endpointRoot/:entity/:id", this.__del);
        this.__server.get("/:endpointRoot/res/et/:entity/", this.__reset);
        return this;
    }


    upload(targetDir) {
        //TODO
        return this;
    }

    __requestValidatior(req, res, next) {
        let endpointRoot = req.params.endpointRoot;
        if (!this.__isRouteExist(endpointRoot)) {
            return res.send(400, `invalid request path. path name: ${endpointRoot}`);
        }

        let entityName = req.params.entity;
        let db = this.__routes[endpointRoot].db;
        if (!this.__isEntityExist(db, entityName)) {
            return res.send(400, `no such entity found. entity name: ${entityName}`);
        }
        req.db = db;
        req.idField = this.__routes[endpointRoot].idField;
        req.dbPath = this.__routes[endpointRoot].dbPath;
        next();
    }

    __getAll(req, res) {
        return res.send(req.db[req.params.entity]);
    }

    __get(req, res) {
        let entities = req.db[req.params.entity];
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity[req.idField].toString() === req.params.id) {
                return res.send(entity);
            }
        }
        return res.send(`entity not found. entity name: ${req.params.entity} ${req.idField}: ${req.params.id}`);
    }

    __post(req, res) {
        req.db[req.params.entity].push(req.body);
        return res.send(`entity added to ${req.params.entity}`);
    }

    __put(req, res) {
        let entityName = req.params.entity;
        let entities = req.db[entityName];
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity[req.idField].toString() === req.params.id) {
                req.db[entityName][i] = req.body;
                return res.send(`entity updated. entity name ${entityName}`);
            }
        }
        return res.send(`entity not found. entity name: ${entityName} ${req.idField}: ${req.params.id}`);
    }

    __del(req, res) {
        let entityName = req.params.entity;
        let entities = req.db[entityName];
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity[req.idField].toString() === req.params.id) {
                req.db[entityName].splice(i, 1);
                return res.send(`entity deleted. entity name: ${entityName} ${req.idField}: ${req.params.id} `);
            }
        }
        return res.send(`entity not found. entity name: ${entityName} ${req.idField}: ${req.params.id}`);
    }

    __reset(req, res) {
        let actualDB = extend(require(req.dbPath), {});
        req.db[req.params.entity] = actualDB[req.params.entity];
        return res.send(`${req.params.entity} has been reset`);
    }


    __isRouteExist(endpointRoot) {
        return this.__routes.hasOwnProperty(endpointRoot);
    }

    __isEntityExist(db, entityName) {
        return db.hasOwnProperty(entityName);
    }

}