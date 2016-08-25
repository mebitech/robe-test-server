import Class from "../class/Class";

export default class Server extends Class {
    __port;
    __server;

    constructor(port) {
        super();
    }

    routeJson(RoutePath){
        return this;
    }

    upload(){
        return this;
    }

    start(){

    }
}