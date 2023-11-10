const mongoose = require('mongoose');
const DbName = 'cfiot'
const PORT = 27017

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect(`mongodb://localhost:${PORT}/${DbName}`, {user:'whistle', pass:'19930304wsh'});
  await mongoose.connect(`mongodb://wsh:19930304wsh@localhost:${PORT}/${DbName}`);

  console.log(`db:${DbName} connected on port:${PORT}`)
}