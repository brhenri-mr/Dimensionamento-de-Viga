import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";


const EqMath = (props) => {

    const config = {
        loader: { load: ["[tex]/html"] },
        tex: {
          packages: { "[+]": ["html"] },
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"]
          ],
          displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"]
          ]
        }
      };
    
      return (
        <MathJaxContext version={3} config={config}>
            <MathJax hideUntilTypeset={"first"}>{props.text}</MathJax>
            <br></br>
        </MathJaxContext>
      );
    }


export default EqMath


