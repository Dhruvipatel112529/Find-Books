import { Book } from "../components/Book";
import { Navbar } from "../components/Navbar";
import AboutUs from "./AboutUs";

export const Index=()=>{
    return (<>
        <Navbar/> 
        <Book/> 
        <AboutUs/>
    </>)
}