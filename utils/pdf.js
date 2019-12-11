const pdf2json = require("pdf2json");
const fs = require("fs");

const {
  PDF_DECODE_CHARACTERS,
  PDF_ENCODED_CHARACTERS
} = require("../config/secrets");

const getPDFText = buffer => {
  const parser = new pdf2json(this, 1);
  return new Promise((resolve, reject) => {
    parser.on("pdfParser_dataError", () => {
      reject(error);
    });
    parser.on("pdfParser_dataReady", function() {
      //remove white space
      let fileData = parser.getRawTextContent().trim();
      //remove uneccessary brackets
      fileData = fileData.replace(/\(.{6,}\)/g, "");
      fileData = fileData.replace(/-+.+-+/g, "");
      PDF_ENCODED_CHARACTERS.forEach((encodedChar, index) => {
        fileData = fileData.replace(
          new RegExp(encodedChar, "g"),
          PDF_DECODE_CHARACTERS[index]
        );
      });

      // resolve promise raw text of pdf
      resolve(fileData);
    });
    parser.parseBuffer(buffer);
  });
};

const extractQuestionPaper = rawText => {
  const data = rawText;
  //seperate paper into sections
  const sections = /(Section:.+)(Section:.+)(Section:.+)(Section:.+)/gs.exec(
    data
  );
  const questionPaper = {};
  //loop through sections
  sections.forEach((section, index) => {
    if (index !== 0) {
      let directions = [];
      let detailedDirections = [];
      const questions = {};
      //get directions in the section
      directions = section.match(
        /Directions?\s?[:;]?\s?([a-z\s.,:\/';\-]+\d{1,2})\./gi
      );
      if (directions) {
        //loop through directions
        directions.forEach(directionText => {
          //extract the direction and question number it starts from
          const [
            directionDetail,
            directionStartQuestionNum
          ] = directionText
            .match(/Directions?\s?[:;]?\s?(.+)\n(\d{1,2})\./s)
            .filter((val, j) => j !== 0);
          detailedDirections.push({
            detail: formatString(directionDetail),
            from: directionStartQuestionNum
          });
        });
      }
      //get first and last question in the section
      const firstQnInPage = (index - 1) * 25 + 1;
      const lastQnInPaper = firstQnInPage + 24;
      //loop from 1st to last qn in the section
      for (let i = firstQnInPage; i <= lastQnInPaper; i++) {
        try {
          // get each question one by one
          if (i === 100) {
            questions[i] = section.match(
              /100\.\s(.{30,470})--Best of Luck –/s
            )[1];
            continue;
          }
          if (i % 25 === 0) {
            questions[i] = section.match(
              new RegExp("\\n" + i + "\\.\\s(.{30,470})", "s")
            )[1];
            continue;
          }
          questions[i] = section.match(
            new RegExp(i + "\\.\\s(.{30,470})" + (i + 1) + "\\.", "s")
          )[1];
        } catch (err) {
          // if not found using regex
          questions[i] = "";
        } finally {
          questions[i] = questions[i].replace(
            /(Directions?\s?[:;]?\s?.{20,}|-+Page.+)/s,
            ""
          );
        }
      }
      const questionsWithOptions = {};
      //get question nums in section
      const questionNums = Object.keys(questions);
      questionNums.forEach(questionNum => {
        try {
          questionsWithOptions[questionNum] = { options: {}, question: "" };
          if (detailedDirections) {
            const startsWithDirections = detailedDirections.some(direction => {
              return direction.from == questionNum;
            });
            if (startsWithDirections) {
              const directionIndex = detailedDirections.findIndex(
                direction => direction.from == questionNum
              );
              let ending = null;
              if (detailedDirections[directionIndex + 1]) {
                ending = detailedDirections[directionIndex + 1].from - 1;
              }
              questionsWithOptions[questionNum].direction = {
                text: detailedDirections[directionIndex].detail,
                ending: ending
              };
            }
          }
          //get options in question(index 1-4) and question text only (index 0)
          const opts = questions[questionNum]
            .match(/(.*)a ?[).](.+)b ?[).](.+)c ?[).](.+)d ?[).](.+)\n/s)
            .filter((val, j) => j !== 0);
          let question = formatString(opts[0]);
          if (!question) {
            question = "noneed";
          }
          questionsWithOptions[questionNum].question = formatString(question);
          questionsWithOptions[questionNum].options = {
            a: formatString(opts[1]),
            b: formatString(opts[2]),
            c: formatString(opts[3]),
            d: formatString(opts[4])
          };
        } catch (err) {
          questionsWithOptions[questionNum] = {};
        }
      });
      //add to questions property of appropriate property(section name) of question paper
      questionPaper.questions = {
        ...questionPaper.questions,
        ...questionsWithOptions
      };
    }
  });
  return questionPaper;
};
const extractAnswerSheet = rawText => {
  const processedText = rawText.replace(/\s+/g, "");
  const answerSheet = {};
  for (let i = 1; i <= 100; i++) {
    try {
      answerSheet[i] = new RegExp(i + "([abcd])").exec(processedText)[1];
    } catch (err) {
      answerSheet[i] = "missing";
    }
  }
  return answerSheet;
};

const formatString = string => {
  //remove whitespace and line breaks
  let formattedString = string
    .trim()
    .replace(/\r\n/g, "")
    .replace(/Directions?\s?[:;]?\s?.{20,}/, "");
  return formattedString;
};
module.exports = { getPDFText, extractQuestionPaper, extractAnswerSheet };
