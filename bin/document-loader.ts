/// <reference path="../server/definitions/references.d.ts"/>
/// <reference path="../server/models/document.ts"/>
/// <reference path="../server/models/document-type.ts"/>
/// <reference path="../server/models/page.ts"/>
/// <reference path="../server/models/township.ts"/>


var mongoose = require('mongoose'),
fs = require('fs'),
crypto = require('crypto'),
exec = require('child_process').exec;


module Genovesa {
    export class DocumentLoader {
        /*
        * Simple NodeJS app that parse the folder of archived documents
        * and add them to MongoDB.
        * Expect the path to the root directory of archived documents as an argument.
        */

        public static loadDocuments(): void {
            // Connect to the MongoDB database
            mongoose.connect('mongodb://localhost/genovesa');
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'Connection error:'));

            db.once('open', () => {
                DocumentLoader.clearDatabase(() => {
                    DocumentLoader.populateDatabase(() => {
                        DocumentLoader.populateDocuments(() => {
                            db.close();
                        });
                    });
                });
            });
        }

        public static clearDatabase(callback: Function): void {
            console.log('Clearing database...');

            Models.Township.remove({}, err => {
                if (err) {
                    console.log(err);
                    return;
                }

                Models.Document.remove({}, err => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    Models.DocumentType.remove({}, err => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        callback();
                    });
                });
            });
        }


        public static populateDatabase(callback: Function): void {
            console.log('Populating database...');

            var transLaForet = new Models.Township({
                postalCode: 35610,
                name: 'Trans-la-Forêt',
                department: 'Ille-et-Vilaine'
            });

            transLaForet.save(err => {
                if (err) {
                    console.log(err);
                    return;
                }

                var birth = new Models.DocumentType({
                    type: 'birth',
                    name: 'Acte de naissance'
                });

                birth.save(err => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    var marriage = new Models.DocumentType({
                        type: 'marriage',
                        name: 'Acte de mariage'
                    });

                    marriage.save(err => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        var death = new Models.DocumentType({
                            type: 'death',
                            name: 'Acte de décès'
                        });

                        death.save(err => {
                            if (err) {
                                console.log(err);
                                return;
                            }

                            var census = new Models.DocumentType({
                                type: 'census',
                                name: 'Recensement'
                            });

                            census.save(err => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }

                                callback();
                            });
                        });
                    });
                });
            });
        }

        public static populateDocuments(callback: Function): void {
            var root = process.argv[2];

            console.log('Browsing ' + root + '...');

            var tasksDone = 0;

            var finishTask = function () {
                tasksDone++;

                if (tasksDone == 2) {
                    callback();
                }
            };

            // Loop through folders
            fs.readdirSync(root).forEach(function (name) {
                var path = root + '/' + name;

                switch (name) {
                    case 'NMD':
                        DocumentLoader.loadNMDDocuments(path, finishTask);
                        break;
                    case 'RECENSEMENT':
                        DocumentLoader.loadRecensementDocuments(path, finishTask);
                    default:
                        break;
                }
            });
        };

        public static loadNMDDocuments(root, finishTask): void {
            // Loop through folders (= documents)
            fs.readdirSync(root).forEach(function (name) {
                var path = root + '/' + name;
                var stat = fs.statSync(path);

                if (stat && stat.isDirectory()) {
                    var captures = /([A-Za-z0-9_\-]*)_(\d{4})_(\w)_(\w*)/.exec(name);
                    var townName = captures[1];
                    var year = parseInt(captures[2], 10);
                    var documentType = captures[3];

                    // Remove caps
                    var collectionType = captures[4].charAt(0).toUpperCase() + captures[4].slice(1).toLowerCase();

                    console.log(townName + ':' + year + ':' + documentType + ':' + collectionType);

                    var pageFiles = fs.readdirSync(path);

                    var reference = DocumentLoader.findDocumentReference(pageFiles[0]);

                    DocumentLoader.findDocumentType(documentType, function (documentType) {
                        DocumentLoader.findTownship(townName, function (township) {

                            var createPage = function (docPath, pageFiles, currentPage, pages) {
                                console.log('Importing page ' + currentPage);

                                if (currentPage >= pageFiles.length) {
                                    var document = {
                                        reference: reference,
                                        fromYear: year,
                                        toYear: year,
                                        documentTypes: [documentType],
                                        collectionType: collectionType,
                                        township: township,
                                        pages: pages
                                    };

                                    DocumentLoader.createDocument(document, function (document) {

                                    });

                                    return;
                                }

                                var currentPageFile = pageFiles[currentPage];

                                var pageFilePath = docPath + '/' + currentPageFile;
                                var pageValues = /_(10NUM_\d{5}_\d{5})_(\d{4})/.exec(currentPageFile);

                                var hash = DocumentLoader.computeFileHash(pageFilePath);
                                var prefix = './public/images/documents';
                                var path = prefix + '/' + DocumentLoader.computeImagePath(hash);

                                DocumentLoader.createDirectories(prefix, hash, function (err) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    DocumentLoader.copyImage(pageFilePath, path, function (err) {
                                        if (err) {
                                            console.log(err);
                                        }

                                        DocumentLoader.createLowResolutionAndThumbnail(path, function (err) {
                                            if (err) {
                                                console.log(err);
                                            }


                                            var page = {
                                                imagePath: path.substring(path.indexOf('/images'), path.length),
                                                // Substract 1 because file names are 1-based but we want a 0-based database
                                                number: parseInt(pageValues[2], 10) - 1
                                            };

                                            pages.push(page);

                                            createPage(docPath, pageFiles, currentPage + 1, pages);

                                        });
                                    });
                                });
                            }
                            createPage(path, pageFiles, 0, []);

                        });
                    });
                }
            });
        };

        public static loadRecensementDocuments(root, finishTask): void {
            // Loop through folders (= documents)
            fs.readdirSync(root).forEach(function (name) {
                var path = root + '/' + name;
                var stat = fs.statSync(path);

                if (stat && stat.isDirectory()) {
                    var captures = /([A-Za-z0-9_\-]*)_(\d{4})/.exec(name);
                    var townName = captures[1];
                    var year = parseInt(captures[2], 10);

                    console.log('Recensement ' + townName + ':' + year);

                    var pageFiles = fs.readdirSync(path);

                    var reference = DocumentLoader.findCensusDocumentReference(pageFiles[0]);

                    DocumentLoader.findDocumentType('C', function (documentType) {
                        DocumentLoader.findTownship(townName, function (township) {

                            var createPage = function (docPath, pageFiles, currentPage, pages) {
                                console.log('Importing census page ' + currentPage);

                                if (currentPage >= pageFiles.length) {
                                    var document = {
                                        reference: reference,
                                        fromYear: year,
                                        toYear: year,
                                        documentTypes: [documentType],
                                        township: township,
                                        pages: pages
                                    };

                                    DocumentLoader.createDocument(document, function (document) {

                                    });

                                    return;
                                }

                                var currentPageFile = pageFiles[currentPage];

                                var pageFilePath = docPath + '/' + currentPageFile;
                                var pageValues = /_(6M_\d{5})_(\d{4})_P/.exec(currentPageFile);

                                var hash = DocumentLoader.computeFileHash(pageFilePath);
                                var prefix = './public/images/documents';
                                var path = prefix + '/' + DocumentLoader.computeImagePath(hash);

                                DocumentLoader.createDirectories(prefix, hash, function (err) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    DocumentLoader.copyImage(pageFilePath, path, function (err) {
                                        if (err) {
                                            console.log(err);
                                        }

                                        DocumentLoader.createLowResolutionAndThumbnail(path, function (err) {
                                            if (err) {
                                                console.log(err);
                                            }


                                            var newPage = {
                                                imagePath: path.substring(path.indexOf('/images'), path.length),
                                                // Substract 1 because file names are 1-based but we want a 0-based database
                                                number: parseInt(pageValues[2], 10) - 1
                                            };

                                            pages.push(newPage);

                                            createPage(docPath, pageFiles, currentPage + 1, pages);
                                        });
                                    });
                                });
                            }
                            createPage(path, pageFiles, 0, []);
                        });
                    });
                }
            });

        };

        public static getDocumentTypeName(letter) {
            var type = '';
            switch (letter) {
                case 'N':
                    type = 'birth';
                    break;
                case 'D':
                    type = 'death';
                    break;
                case 'M':
                    type = 'marriage'
                    break;
                case 'C':
                    type = 'census';
                    break;
                default:
                    break;
            }

            return type;
        };

        public static findDocumentReference(filename) {
            if (filename != undefined) {
                var pageValues = /_(10NUM_\d{5}_\d{5})_(\d{4})/.exec(filename);
                return pageValues[1];
            }
        };

        public static findCensusDocumentReference(filename) {
            if (filename != undefined) {
                var pageValues = /_(6M_\d{5})/.exec(filename);
                return pageValues[1];
            }
        };

        public static findDocumentType(documentType, callback) {
            Models.DocumentType.findOne({ 'type': getDocumentTypeName(documentType) }, function (err, type) {
                if (err) {
                    console.log(err);
                    return;
                }
                callback(type);
            });
        };

        public static findTownship(townName, callback) {
            Models.Township.findOne({ 'name': 'Trans-la-Forêt' }, function (err, township) {
                if (err) {
                    console.log(err);
                    return;
                }

                callback(township);
            });
        };

        public static createDocument(document, callback) {
            var doc = new Models.Document(document);
            doc.save(function (err, document) {
                if (err) {
                    console.log(err);
                    return;
                }

                callback(document);
            });
        };


        public static computeFileHash(filename, callback?) {
            var shasum = crypto.createHash('sha1');

            var s = fs.readFileSync(filename);
            shasum.update(s);

            return shasum.digest('hex');
        };

        public static computeImagePath(path) {
            return path.substring(0, 2) + '/' + path.substring(2, 4) + '/' + path;
        };

        public static createDirectories(destination, path, callback) {
            try {
                var name = path.substring(0, 2) + '/' + path.substring(2, 4);
                var folder = destination + '/' + path.substring(0, 2);
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder);
                }

                if (!fs.existsSync(folder + '/' + path.substring(2, 4))) {
                    fs.mkdirSync(folder + '/' + path.substring(2, 4));
                }

                callback();
            } catch (e) {
                callback(e);
            }
        };

        public static copyImage(origin, hash, callback) {
            var content = fs.readFileSync(origin);
            fs.writeFileSync(hash + '.jpg', content);
            callback();
        };

        public static createLowResolutionAndThumbnail(path, callback) {
            // Low resolution
            exec('convert ' + path + '.jpg' + ' -quality 25% ' + path + '-low.jpg', (error, stdout, stderr) => {
                if (error) {
                    callback(error);
                    return;
                }

                // Thumbnail
                exec('convert ' + path + '.jpg' + ' -resize x96 ' + path + '-thumbnail.jpg', (error, stdout, stderr) => {
                    callback(error);
                });
            });
        };
    }
}

Genovesa.DocumentLoader.loadDocuments();
