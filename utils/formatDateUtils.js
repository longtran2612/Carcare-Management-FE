const changeDate = (x) => {
  if (x === null || x === undefined || x === "") return "";
  let temp = new Date(x);
  x = `${temp.getDate()}/${temp.getMonth() + 1}/${temp.getFullYear()}`;
  let array = x.split("/");
  return array[1] + "/" + array[0] + "/" + array[2];
};
export default changeDate;
