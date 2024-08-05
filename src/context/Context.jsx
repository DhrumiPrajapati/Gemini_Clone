import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput] = useState("");
    //input will store the input obtained by user
    const [recentPrompt,setRecentPrompt] = useState("");
    //recentPromt will be used to store obtained input from user and display
    const [prevPrompts,setPrevPromts] = useState([]);
    //prevPromts will be used to store all the previous prompts
    const [showResult,setShowResult] = useState(false);
    //boolean field-->if showing result(True) then it will make the cards and stuff disapper
    const [loading,setLoading] = useState(false);
    //loading will be used to show the loading animation until the result loads
    const [resultData, setResultData] = useState("");
    //resultData will be used to store the result and display the result for the user

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        //while calling this function resultData will get empty(prev stored data will be removed)
        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt);
            setRecentPrompt(prompt);
        }
        else {
            setPrevPromts(prev=>[...prev,input]);
            setRecentPrompt(input);
            response = await runChat(input);
        }

        let responseArray = response.split("**");
        let newResponse = "";

        for(let i=0; i<responseArray.length; i++) {
            if(i===0 || i%2 !== 1) {  //even number
                newResponse += responseArray[i];
            }
            else {
                newResponse += "<b>" + responseArray[i] + "</b>"; 
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");

        for(let i=0; i<newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord+" ");
        }

        setResultData(newResponse2);
        setLoading(false) ;
        setInput("");

    }

    const ContextValue = {
        prevPrompts,
        setPrevPromts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={ContextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;

// import React, { createContext, useEffect, useState } from "react";

// export const Context = createContext();

// const ContextProvider = (props) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const onSent = async (prompt) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('/api/run', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });
//       const data = await response.json();
//       console.log(data.response);
//     } catch (err) {
//       console.error("Error in onSent: ", err); // Debugging statement
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     onSent("what is ReactJS");
//   }, []);

//   const ContextValue = {
//     loading,
//     error,
//     // Add any additional context values here
//   };

//   return (
//     <Context.Provider value={ContextValue}>
//       {props.children}
//       {loading && <div>Loading...</div>}
//       {error && <div>Error: {error}</div>}
//     </Context.Provider>
//   );
// };

// export default ContextProvider;
