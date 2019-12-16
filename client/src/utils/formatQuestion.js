const formatQuestion = string => {
  if (string) {
    if (/<.+>.+<\/.+>/.test(string)) {
      return string;
    }
    return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  return string;
};
export default formatQuestion;
