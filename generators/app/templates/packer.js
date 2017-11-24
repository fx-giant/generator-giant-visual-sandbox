var request = require("request");
var fs = require("fs");
var dateTime = require("node-datetime");
var archiver = require("archiver");
var argv = process.argv;



var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var processType = argv[2] || "upload";

const defaultSaveDirectory = "packs";

var targets = {
	SIT: "http://172.16.53.228/WebSites/Analytics/api/VisualPack/Upload",
}

var zipName = "<%= visualName %>";
var sourceDirectory = config.sourceFolder || "source";
var zipFile = zipName + ".zip";
var cookie = config.cookie;
var target = config.target;
var targetUrl = config.targetUrl;
var saveDirectory = config.saveDirectory || defaultSaveDirectory;
var uploadUrl = targetUrl || targets[target];
var now = dateTime.create().format("Y-m-d_H-M-S");


if (processType == "upload")
	startUpload();
else
if (processType == "save")
	startSave();

function startUpload() {
	zipTheVisualPack(uploadFile);
}

function startSave() {
	zipTheVisualPack(savePack);
}

function zipTheVisualPack(callback) {
	var archive = archiver("zip", {
		zlib: {
			level: 9
		}
	})
	var output = fs.createWriteStream(zipFile);
	output.on("close", function () {
		console.log("Files zipped to " + zipFile);
		callback();
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
	if (!cookie)
		throw "Null cookie";
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
		try {
			JSON.parse(body);
			console.log("Upload Success");
		} catch (ex) {
			console.log("FAILED TO UPLOAD!");
		}
		finisher();
	});
}

function finisher() {
	fs.unlink(zipFile, function () {});
}

function savePack() {
	backupName = zipName + "__" + now + ".zip";
	var backupTarget = saveDirectory + "/" + backupName;
	console.log("Saving to " + backupTarget);
	moveFile(zipFile, backupTarget);
}

function moveFile(from, to, callback) {
	var is = fs.createReadStream(from);
	var os = fs.createWriteStream(to);

	is.pipe(os);
	is.on('end', function () {
		fs.unlink(from, function () {});
		(callback || function () {})();
	});
}
