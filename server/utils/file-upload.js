const dayjs = require('dayjs');
let fs = require('fs');

exports.fileUpload = async function (file, directory) {
    return new Promise((resolve, reject) => {
        try {
            // console.log('file',file)ire
            // console.log("directory",directory)

            let mime_type = file.split(';')[0].split('/')[1];
            console.log("mime_type", mime_type);

            if (mime_type === "png" || "jpeg" || "jpg" || "mp4" || "mp3" || "pdf") {
                console.log("allowed file type");



                let filename = dayjs() + String(Math.floor(Math.random() * 100)) + "." + mime_type;
                console.log("filename : ", filename);

                let upload_path = `uploads/${directory}`;
                console.log("upload_path : ", upload_path);

                // console.log("file : ",file)


                let base64 = file.split(';base64,')[1];
                console.log("base64", base64);

                fs.mkdir(upload_path, { recursive: true }, (err) => {
                    if (err) {
                        reject(err.message ? err.message : err);

                    } else {
                        let upload_path = `uploads/${directory}/${filename}`;
                        console.log("upload_path : ", upload_path);

                        fs.writeFile(
                            upload_path,
                            base64,
                            { encoding: "base64" },
                            function (err) {
                                if (err) {
                                    console.log('err', err);
                                    reject(err.message ? err.message : err);
                                }
                                else {
                                    resolve(upload_path)
                                }
                            }
                        )
                    }
                })
            }
            else {
                reject("file size upto 100mb ")
            }
        } catch (error) {

        }
    })

}