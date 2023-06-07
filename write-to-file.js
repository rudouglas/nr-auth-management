import * as fs from "fs";

export const writeToFile = ({ content, filename }) => {
  fs.writeFileSync(filename, content, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

export const appendToFile = ({ content, filename }) => {
  fs.appendFileSync(filename, content, (err) => {
    if (err) {
      console.error(err);
    }
  });
};
