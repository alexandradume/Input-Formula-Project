import axios from "axios";

export function getMathJSON() {
  return axios.get("http://localhost:3000/api/loadData").then(
    response => {
      return response.data;
    }
  ).catch((error) => {
    // console.log(error);
    return error;
  });
}