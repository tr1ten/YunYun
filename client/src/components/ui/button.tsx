import React, {  MouseEventHandler } from "react";

type ButtonProps={
    onClick?:MouseEventHandler,
    children?:React.ReactNode,
    className?:string
    
}
const Button = ({onClick, children,className}:ButtonProps)=>{
    return (
        <button onClick={onClick} className={"rounded-md px-2 py-2 border-2 "+className} >{children}</button>
    );
}
export default Button; 