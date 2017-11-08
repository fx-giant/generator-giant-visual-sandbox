require('dotenv').config();
var env = process.env;
var request = require("request");
var fs = require("fs");
var dateTime = require("node-datetime");
var archiver = require("archiver");

const defaultBackupDirectory = "__backup__";
var targets = {
    SIT: "http://172.16.53.228/WebSites/Analytics/api/VisualPack/Upload",
}

var zipName = env.ZIP_NAME || "nameless-visual-pack";
var sourceDirectory = env.SOURCE_DIRECTORY || zipName;
var zipFile = zipName + ".zip";
var cookie = env.COOKIE;
var target = env.TARGET;
var targetUrl = env.TARGET_URL;
var backup = env.BACKUP == "true";
var backupDirectory = env.BACKUP_DIRECTORY || defaultBackupDirectory;
var uploadUrl = targetUrl || targets[target];
var now = dateTime.create().format("Y-m-d_H-M-S");

start();

function start() {
    zipTheVisualPack();
}

function zipTheVisualPack() {
    var archive = archiver("zip", {
        zlib: {
            level: 9
        }
    })
    var output = fs.createWriteStream(zipFile);
    output.on("close", function () {
        console.log("Files zipped to " + zipFile);
        uploadFile();
    });

    fs.readdirSync(sourceDirectory).forEach(function (file) {
        var read = fs.createReadStream(sourceDirectory + "/" + file);
        archive.append(read, {
            name: file
        });
    })
    archive.pipe(output);
    archive.finalize();

}

function uploadFile() {
    console.log("Upload File: ", zipFile);
    console.log("Uploading to ", uploadUrl)
    var requestObj = {
        method: "post",
        uri: uploadUrl,
        headers: {
            "Cookie": cookie
        },
        formData: {
            attachments: [fs.createReadStream(zipFile)]
        }
    };

    var req = request(requestObj, function (err, resp, body) {
        if (err) {
            console.log('Error!', err);
        } else {
            finisher();
        }
    });
}

function finisher() {
    if (backup) {
        backupName = zipName + "__" + now + ".zip";
        var backupTarget = backupDirectory + "/" + backupName;
        console.log("Backing up to " + backupTarget);
        moveFile(zipFile, backupTarget);
    } else {
        fs.unlink(zipFile, function () {});
    }
}

function moveFile(from, to, callback) {
    var is = fs.createReadStream(from);
    var os = fs.createWriteStream(to);

    is.pipe(os);
    is.on('end', function () {
        fs.unlink(from);
        (callback || function () {})();
    });
}