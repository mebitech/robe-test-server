import Class from "../class/Class"
const multer = require("multer");

export default class UploadRouter extends Class {

    __server;
    __tempPath;
    __requestPath;
    constructor(server, tempPath, requestPath) {
        super();
        this.__server = server;
        this.__dbPath = dbPath;
        this.__requestPath = !requestPath ? "/" : requestPath;
        this.__idField = !idField ? "id" : idField;
    }

    route() {
        this.__server.get(this.__requestPath + "/:entity", this.__getAll);
        this.__server.get(this.__requestPath + "/:entity/:id", this.__get);
        this.__server.post(this.__requestPath + "/:entity", this.__post);
        this.__server.put(this.__requestPath + "/:entity/:id", this.__put);
        this.__server.del(this.__requestPath + "/:entity/:id", this.__del);
        this.__server.get(this.__requestPath + "/res/et/:entity/", this.__reset);
        return this;
    }

    __getAll(req, res) {
        let entityName = req.params.entity;
        if (!this.__db[entityName]) {
            return res.status(400).send(`no such entity found. entity name: ${entityName}`);
        }
        return res.send(this.__db[entityName]);
    }

    __get(req, res) {
        let entityName = req.params.entity;
        if (!this.__db[entityName]) {
            return res.status(400).send(`no such entity found. entity name: ${entityName}`);
        }
        let entities = this.__db[entityName];
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity[this.__idField].toString() === req.params.id) {
                return res.send(entity);
            }
        }
        return res.status(400).send(`entity not found. entity name: ${entityName} ${this.__idField}: ${req.params.id}`);
    }

    __post(req, res) {
        let entityName = req.params.entity;
        if (!this.__db[entityName]) {
            return res.status(400).send(`no such entity found. entity name: ${entityName}`);
        }
        this.__db[entityName].push(req.body);
        return res.send(`entity added to ${entityName}`);
    }

    __put(req, res) {
        let entityName = req.params.entity;
        if (!this.__db[entityName]) {
            return res.send(`no such entity found. entity name: ${entityName}`);
        }
        let entities = this.__db[entityName];
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity[this.__idField].toString() === req.params.id) {
                this.__db[entityName][i] = req.body;
                return res.send(`entity updated. entity name ${entityName}`);
            }
        }
        return res.send(`entity not found. entity name: ${entityName} ${this.__idField}: ${req.params.id}`);
    }

    __del(req, res) {
        let entityName = req.params.entity,
            id = req.params.id;
        if (!this.__db[entityName]) {
            return res.send(`no such entity found. entity name: ${entityName}`);
        }
        let entities = this.__db[entityName];
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity[this.__idField].toString() === req.params.id) {
                this.__db[entityName].splice(i, 1);
                return res.send(`entity deleted. entity name: ${entityName} ${this.__idField}: ${req.params.id} `);
            }
        }
        return res.send(`entity not found. entity name: ${entityName} ${this.__idField}: ${req.params.id}`);
    }

    __reset(req, res) {
        let entityName = req.params.entity;
        if (!this.__db[entityName]) {
            return res.send(`no such entity found. entity name: ${entityName}`);
        }
        this.__db[entityName] = this.__dbClone[entityName];
        return res.send(`${entityName} has been reset`);
    }

}