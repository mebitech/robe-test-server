import multer from "multer";
import path from "path";
import escapeRegexp from "escape-string-regexp";
import Class from "../class/Class";
import Generator from "../util/Generator";
import bodyParser from "body-parser";
const fs = require("fs");
import FileUtility from "../util/FileUtility";

export default class UploadRouter extends Class {

    __server;
    __tempPath;
    __detail;
    __requestPath;
    __upload;
    constructor(server, tempPath,requestPath, __detail) {
        super();
        this.__server = server;
        this.__tempPath = path.resolve(FileUtility.getAppHome(), tempPath);
        this.__requestPath = !requestPath ? "/" : requestPath;
        this.__detail = __detail;
        const __this = this;
        const storage = multer.diskStorage({
            destination: this.__tempPath, // Specifies upload location...
            filename: function (req, file, cb) {
                /*
                 switch (file.mimetype) { // *Mimetype stores the file type, set extensions according to filetype
                 case "image/jpeg":
                 ext = ".jpeg";
                 break;
                 case "image/png":
                 ext = ".png";
                 break;
                 case "image/gif":
                 ext = ".gif";
                 break;
                 }
                 */
                console.log("File cammm");
                const id = Generator.guid();
                file.filename = id;
                fs.writeFileSync(path.normalize(path.join(__this.__tempPath) + "/" + id + ".json"), JSON.stringify(file), "utf8");
                cb(null, id);
            }
        });
        this.__upload = multer({ storage: storage });
    }

    route() {
        this.__server.get(path.join(this.__requestPath, "__detail") , this._getInformation);
        this.__server.put(this.__requestPath, this.__upload.array(),  this._upload);
        this.__server.post(this.__requestPath, this._info);
        this.__server.del(new RegExp(escapeRegexp(this.__requestPath) + ".*"), this._delete);
        return this;
    }

    _getInformation(request, response){
        response.send(this.__detail);
    }
    _info(request, response){
        let data;
        if (Object.prototype.toString.call(request.body) === "[object Array]") {
            data = [];
            for (let i = 0; i < request.body.length; i++) {
                console.log("Loaded file by " + request.body[i] + " file key");
                data.push(this.__loadFile(request.body[i]));
            }
        } else {
            let fileName = typeof  request.body === "string" ? request.body: request.body.filename;
            console.log("Loaded file by " + fileName + " file key");
            data = this.__loadFile(request.body.filename);
        }
        response.send(data);
    }

    __loadFile(key) {
        var file = fs.readFileSync(path.normalize(this.__tempPath + "/" + key + ".json"), "utf8");
        return JSON.parse(file);
    }

    _upload(request, response, next) {
        response.send(request.files);
    }

    _delete(request, res) {
        var body = "";
        request.on("data", (data) => {
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });

        request.on("end", () => {
            const file = JSON.parse(body);
            var filePath = path.normalize(file.path);
            fs.unlinkSync(filePath);
            fs.unlinkSync(filePath + ".json");
            res.status(200).send(file);
            // use post['blah'], etc.
        });
        // You can send any response to the user here
    }
}