import Class from "../class/Class";

class JsonRouter extends Class{
    get(request: Object, response: Object){
        response.send("Get a random book");
    }
    post(request: Object, response: Object){
        response.send("Add a book");
    }
    put(request: Object, response: Object){
        response.send();
    }
    delete(request: Object, response: Object){
        response.send("Update the book");
    }
}