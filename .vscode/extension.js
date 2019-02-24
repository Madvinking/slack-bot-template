const list = [
  "ChakrounAnas.turbo-console-log",
  "christian-kohler.path-intellisense",
  "dbaeumer.vscode-eslint",
  "donjayamanne.githistory",
  "dsznajder.es7-react-js-snippets",
  "eamodio.gitlens",
  "eg2.tslint",
  "eg2.vscode-npm-script",
  "eridem.vscode-postman",
  "eriklynd.json-tools",
  "esbenp.prettier-vscode",
  "kumar-harsh.graphql-for-vscode",
  "liviuschera.noctis",
  "metaseed.metago",
  "mikestead.dotenv",
  "ms-kubernetes-tools.vscode-kubernetes-tools",
  "p1c2u.docker-compose",
  "PeterJausovec.vscode-docker",
  "PKief.material-icon-theme",
  "quicktype.quicktype",
  "redhat.vscode-yaml",
  "ryu1kn.partial-diff",
  "streetsidesoftware.code-spell-checker"
];

const { exec } = require("child_process");

const command = list
  .map(ext => `code --install-extension ${ext}`)

  .join(" && ");

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.log("cant install extensions");
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
