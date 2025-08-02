var validator=require('validator');
var validationFn={

    validateReview: function (req, res, next) {
    const { userid, rating, review } = req.body;

    // check if userid and rating are integers
    if (!userid || !validator.isInt(userid.toString())) {
        return res.status(500).json({ error: "Invalid userid. Must be a number." });
    }

    if (!rating || !validator.isInt(rating.toString(), { min: 1, max: 5 })) {
        return res.status(500).json({ error: "Invalid rating. Must be a number between 1 and 5." });
    }

    // review must be present and not empty
    if (!review || typeof review !== 'string' || validator.isEmpty(review.trim())) {
        return res.status(500).json({ error: "Review text cannot be empty." });
    }

    // optional sanitization to strip dangerous HTML
    req.body.review = validator.escape(review.trim());

    next();
    },

    validateUser: function (req, res, next) {
        let { username, email, contact, password, profile_pic_url } = req.body;

        if (!username || validator.isEmpty(username.trim())) {
            return res.status(400).json({ error: "Username is required" });
        }
        if (!email || !validator.isEmail(email.trim())) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        if (!contact || !validator.isMobilePhone(contact.trim(), 'any')) {
            return res.status(400).json({ error: "Invalid contact number" });
        }
        if (!password || validator.isEmpty(password.trim())) {
            return res.status(400).json({ error: "Password is required" });
        }

        // Sanitize the input
        req.body.username = validator.escape(username.trim());
        req.body.email = validator.normalizeEmail(email.trim());
        req.body.contact = validator.escape(contact.trim());
        req.body.password = validator.escape(password.trim());

        if (profile_pic_url)
            req.body.profile_pic_url = validator.escape(profile_pic_url.trim());
        else
            req.body.profile_pic_url = "";

        next();
    },


    sanitizeResult: function (result) {
        // sanitize each string field in DB result before sending
        if (!Array.isArray(result)) return result; //checks if result is not an array to avoid breaking the code

        return result.map(record => {
            const sanitizedRecord = {}; //create empty object
            for (let key in record) { //loops through each key in the record
                if (typeof record[key] === 'string') { //if value is a string, validator.escape() is used to sanitize it
                    sanitizedRecord[key] = validator.escape(record[key]);
                } else {
                    sanitizedRecord[key] = record[key]; //if not a string, it copies it unchanged

                }
            }
            return sanitizedRecord; //returns sanitized array
        });
    }

}
module.exports=validationFn;