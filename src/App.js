import React, { useEffect, useState } from "react";
import { evaluate } from "mathjs";
import "./styles.css";

export default function App() {
  const [displayText, setDisplayText] = useState("");
  const [resultText, setResultText] = useState("");
  const [isResultVisible, setResult] = useState(false);
  const [isDecimalAllowed, setDecimalAllow] = useState(true);
  const [isLandscape, setLandscapeView] = useState(false);
  const mobileScroll = React.createRef();

  function handleInput(value) {
    if (isResultVisible) {
      if (
        value === "×" ||
        value === "÷" ||
        value === "+" ||
        value === "-" ||
        value === "."
      ) {
        setDisplayText(() => `${resultText}`);
      } else {
        setDisplayText(() => "");
      }
      setResult(false);
      setResultText("");
    }
    if (
      value === "×" ||
      value === "÷" ||
      value === "+" ||
      value === "-" ||
      value === "."
    ) {
      if (displayText.slice(-1) !== value) {
        switch (value) {
          case ".":
            console.log(
              displayText.length > 0,
              !isNaN(displayText.slice(-1)),
              isDecimalAllowed
            );
            if (
              displayText.length > 0 &&
              !isNaN(displayText.slice(-1)) &&
              // displayText.split(".").splice(-1)[0] !== "" &&
              isDecimalAllowed
            ) {
              setDisplayText((text) => text + value);
              setDecimalAllow(false);
            }
            break;
          case "-":
            if (
              displayText.slice(-1) === "÷" ||
              displayText.slice(-1) === "×"
            ) {
              setDisplayText((text) => text + value);
              setDecimalAllow(true);
            } else if (displayText.slice(-1) === "+") {
              setDisplayText((text) => text.slice(0, -1) + value);
              setDecimalAllow(true);
            } else if (
              displayText.length === 0 ||
              !isNaN(displayText.slice(-1))
            ) {
              setDisplayText((text) => text + value);
              setDecimalAllow(true);
            }
            break;
          default:
            if (displayText.length > 0) {
              if (isNaN(displayText.slice(-1))) {
                if (
                  displayText.slice(-1) !== "-" ||
                  (displayText.length > 1 && displayText.slice(-1) === "-")
                ) {
                  setDisplayText((text) => text.slice(0, -1) + value);
                }
              } else {
                setDisplayText((text) => text + value);
              }
              setDecimalAllow(true);
            }
            break;
        }
      }
    } else {
      setDisplayText((text) => text + value);
    }
  }

  function clear() {
    if (displayText.length > 0 && !isResultVisible) {
      setDisplayText(displayText.slice(0, -1));
    } else {
      setResult(false);
      setDisplayText(resultText);
      setResultText("");
    }
  }

  function operate() {
    if (displayText.length > 0) {
      let result = displayText;
      if (displayText.slice(-1).includes("×")) {
        result = result.replace(/([×])/g, "");
      } else if (displayText.slice(-1).includes("÷")) {
        result = result.replace(/([÷])/g, "");
      } else if (displayText.slice(-1).includes("-")) {
        result = result.replace(/([-])/g, "");
        result = result.replace(/([÷])/g, "");
        result = result.replace(/([×])/g, "");
      } else if (displayText.slice(-1).includes("+")) {
        result = result.replace(/([+])/g, "");
      }
      result = evaluate(result.replace(/([×])/g, "*").replace(/([÷])/g, "/"));
      setResultText(result.toFixed(result.toString().includes(".") ? 2 : 0));
      setResult(true);
      setDecimalAllow(true);
    }
  }

  function setOrientation(
    orientation = (window.screen.orientation || {}).type ||
      window.screen.mozOrientation ||
      window.screen.msOrientation
  ) {
    if (
      orientation === "landscape-primary" ||
      orientation === "landscape-secondary"
    ) {
      setLandscapeView(true);
    } else {
      setLandscapeView(false);
    }
  }

  useEffect(() => {
    setOrientation();
    window.addEventListener("orientationchange", function (event) {
      const orientation = event.target.screen.orientation.type;
      setOrientation(orientation);
    });
    mobileScroll.current.scrollIntoView();
    return () => {
      window.removeEventListener("orientationchange", function () {});
    };
  }, []);
  return (
    <div className="App">
      <div className="container">
        <p className="display-field">{displayText}</p>
        {isResultVisible && <p className="answer-field">{resultText}</p>}
        {isLandscape && (
          <div className="landscape-button-layout">
            <button className="action-button">sin</button>
            <button className="action-button">cos</button>
            <button className="action-button">tan</button>
            <button className="action-button">log</button>
            <button className="action-button">in</button>
            <button className="action-button">(</button>
            <button className="action-button">)</button>
            <button className="action-button">^</button>
            <button className="action-button">√</button>
            <button className="action-button">!</button>
            <button className="action-button">π</button>
            <button className="action-button">e</button>
            <button className="action-button">INV</button>
            <button className="action-button">
              <span>RAD</span>
            </button>
            <button className="action-button">
              <span>DEG</span>
            </button>
          </div>
        )}
        <div className="button-layout">
          <div className="input-button-layout">
            <button className="action-button" onClick={() => handleInput(7)}>
              7
            </button>
            <button className="action-button" onClick={() => handleInput(8)}>
              8
            </button>
            <button className="action-button" onClick={() => handleInput(9)}>
              9
            </button>

            <button className="action-button" onClick={() => handleInput(4)}>
              4
            </button>
            <button className="action-button" onClick={() => handleInput(5)}>
              5
            </button>
            <button className="action-button" onClick={() => handleInput(6)}>
              6
            </button>
            <button className="action-button" onClick={() => handleInput(1)}>
              1
            </button>
            <button className="action-button" onClick={() => handleInput(2)}>
              2
            </button>
            <button className="action-button" onClick={() => handleInput(3)}>
              3
            </button>
            <button className="action-button" onClick={() => handleInput(0)}>
              0
            </button>
            <button className="action-button" onClick={() => handleInput(".")}>
              .
            </button>
            <button className="action-button" onClick={() => operate()}>
              =
            </button>
          </div>
          <div className="operation-button-layout">
            <button className="action-button" onClick={() => clear()}>
              CE
            </button>
            <button className="action-button" onClick={() => handleInput("÷")}>
              ÷
            </button>
            <button className="action-button" onClick={() => handleInput("×")}>
              ×
            </button>
            <button className="action-button" onClick={() => handleInput("-")}>
              -
            </button>
            <button className="action-button" onClick={() => handleInput("+")}>
              +
            </button>
          </div>
        </div>
        <div ref={mobileScroll}></div>
      </div>
    </div>
  );
}
