import mime from "mime";
import Class from "../class/Class";

class FileUtility extends Class {

    getInformation(path){
        var nOffset = Math.max(0, Math.max(path.lastIndexOf("\\"), path.lastIndexOf("/")));
        var eOffset = path.lastIndexOf(".");
        if (eOffset < 0) {
            eOffset = path.length;
        }
        const mimeType = mime.lookup(path);

        return {
            destination: path.substring(0, nOffset),
            encoding: null,
            fieldname: null,
            mimetype: mimeType,
            extension: mime.extension(mimeType),
            charsets: mime.charsets.lookup(mimeType),
            filename: path.substring(nOffset > 0 ? nOffset + 1 : nOffset, eOffset),
            originalname: null,
            path: path,
            size: 0
        };
    }
}

export default new FileUtility();