import { checkUserAccess } from "./data/users.js";

export async function pageView(req, res, next) {
    if(req.method === 'GET') {
        // console.log(req.session)
        if (req.session && req.session.user) {
            if(req.session.user.role === 'admin' 
            || (await checkUserAccess(req.session.user._id, req.params.id))){
                return next();
            } else if(req.session.user.role === 'user'){
                return res.redirect('/');
            } else {
                throw "Error: Role set to invalid value.";
            }
        } else {
            next();
            return;
        }
    } else {
        next();
    }
}