//* INTERFACES
import { useFetchInterface } from "../utilities/interfaces/hooks/useFetchInterface";
//* NPMS
import axios from "axios";
const useFetch = async ({ url, type, body }: useFetchInterface) => {
  if (type === "get") {
    try {
      const { data } = await axios.get(url);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
};

export default useFetch;
