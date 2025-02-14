export function countWords(s: string): number {
  s = s.replace(/(^\s*)|(\s*$)/gi, ""); //exclude  start and end white-space
  s = s.replace(/[ ]{2,}/gi, " "); //2 or more space to 1
  s = s.replace(/\n /, "\n"); // exclude newline with a start spacing
  return s.split(" ").filter(function (str) {
    return str != "";
  }).length;
  //return s.split(' ').filter(String).length; - this can also be used
}

export function countNonWhiteSpace(s: string) {
  s = s.replace(" ", "");
  return s.length;
}
