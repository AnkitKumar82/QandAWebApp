import axios from "axios";
const myServerAddr = "http://localhost:5000";
export const getCall = async (data)=>{
    try{
        const response = await axios.get(myServerAddr+data.api);
        return response.data;
    }catch (error) {
        console.error(error);
        return null;
    }
}
export const postCall = async (data)=>{
    try{
        const response = await axios.post(myServerAddr+data.api,data.body);
        return response.data;
    }catch (error) {
        console.error(error);
        return null;
    }
}