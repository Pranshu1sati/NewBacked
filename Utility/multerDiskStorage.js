const fs = require('fs').promises
const multer = require("multer")


const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const data = req.fileData
        if (!data) return cb(new Error("no file data"))
        const fileExists = await fs.access(data.path).then(() => true).catch(() => false)
        if (!fileExists) await fs.mkdir(data.path, { recursive: true })
        const files = await fs.readdir(data.path);
        const fileCount = files.length
        if (fileCount >= 5) return cb(new Error(""))//add limit here
        cb(null, data.path)
    },
    filename: function (req, file, cb) {
        cb(null, `${req.fileData.fileName}__${Date.now()}_${file.originalname}`)
    }
})


exports.upload = multer({ storage })