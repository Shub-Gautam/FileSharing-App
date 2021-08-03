const File = require("./models/file");
const fs = require("fs");
const connectDB = require("./config/db");
connectDB();
async function fetchData() {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  //24 hrs old
  const files = await File.find({ createdAt: { $lt: pastdate } });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await File.remove();
        console.log("succesfully del" + `${file.filename}`);
      } catch (err) {
        console.log(`Error while deleting file ${err}`);
      }
    }
    console.log("Job Done!");
  }
}

//this return a promise so we can use then keyword and then called a function which in this case is process.exit
fetchData().then(process.exit);
