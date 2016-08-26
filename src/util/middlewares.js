module.exports = {
    decodeQueryParams: (req, res, next) => {
        req.parsedQuery = decodeURI(req.getUrl().query);
        next();
    }
}