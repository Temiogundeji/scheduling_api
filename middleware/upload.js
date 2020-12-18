const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname)
    }
})

const uploadImage = (req, res, next) => {
    const upload = multer({ storage: storage }).single('profileImage')
    upload(req, res, function(err){
        if(err){
            return res.send(err)
        }
        res.json(req.file)
    })
}

module.exports = uploadImage;