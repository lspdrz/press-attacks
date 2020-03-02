import React, { useRef, useState, FunctionComponent, useEffect } from "react";

import JournalistPane from "./JournalistPane";
import pressattacksdata from "../../data/press_attacks_data.json";

interface JournalistNamesProps {
  pressAttacksYearSorted: any;
  country: String;
  resetScroll: Boolean;
}

const JournalistNames: FunctionComponent<JournalistNamesProps> = (
  props: JournalistNamesProps
) => {
  const [journalist, setJournalist] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [paneIsOpen, setPaneIsOpen] = useState(false);
  const names = useRef<HTMLDivElement>(null);
  const journalistContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (names && names.current && props.resetScroll) {
      names.current.scrollTop = 0;
      names.current.scrollLeft = 0;
    }
  }, []);

  useEffect(() => {
    if (names && names.current) {
      names.current.scrollTop = scrollTop;
      names.current.scrollLeft = scrollLeft;
    } else if (journalistContainer.current) {
      journalistContainer.current.scrollTop = 0;
      journalistContainer.current.scrollLeft = 0;
    }
  });

  const handleChangeJournalist = async (name: string) => {
    setJournalist(name);
    if (names.current) {
      setScrollTop(names.current?.scrollTop);
      setScrollLeft(names.current?.scrollLeft);
      setPaneIsOpen(true);
    }
  };

  const { pressAttacksYearSorted, country } = props;

  let currentYear = 0;
  let resultDivs = [];
  let result: any[] = [];
  pressAttacksYearSorted.forEach((entry: any, idx: number) => {
    if (entry.location === country) {
      if (entry.year === currentYear) {
        result.push(
          <button
            className="name-button"
            key={idx}
            value={entry.name}
            onClick={() => handleChangeJournalist(entry.name)}
          >
            {entry.name}
          </button>
        );
      } else {
        if (currentYear !== 0) {
          resultDivs.push(
            <div className="name-section" key={currentYear}>
              {result}
            </div>
          );
          result = [];
        }
        currentYear = entry.year;
        result.push(
          <p className="names-year" key={currentYear}>
            {currentYear}
          </p>
        );
        result.push(
          <button
            className="name-button"
            key={idx}
            value={entry.name}
            onClick={() => handleChangeJournalist(entry.name)}
          >
            {entry.name}
          </button>
        );
      }
    }
  });

  //One last wrap for the end cases:
  resultDivs.push(
    <div className="name-section" key={currentYear}>
      {result}
    </div>
  );

  //Most recent year to last
  resultDivs.reverse();

  if (paneIsOpen) {
    return (
      <div ref={journalistContainer} className="journalist-container">
        <JournalistPane
          journalist={journalist}
          journalistData={pressattacksdata}
          onHandleClosePane={() => setPaneIsOpen(false)}
        />
      </div>
    );
  } else {
    return (
      <div ref={names} className="names">
        {resultDivs}
        <style jsx global>
          {`
            .names {
              padding-right: 15px;
              overflow: scroll;
            }

            .names-year {
              margin: 0;
              flex-shrink: 0;
              flex-grow: 0;
              display: inline;
              font-size: 3.33em;
            }

            .name-button {
              background-color: #ffffff;
              display: flex;
              align-items: left;
              text-align: left;
              justify: left;
              color: #747474;
              padding: 3px;
              border: none;
              outline: none;
              cursor: pointer;
              font-size: 1.5em;
            }

            .name-button:hover {
              color: #e10000;
            }

            .journalist-container {
              overflow: scroll;
            }

            @media (max-width: 700px) {
              .names {
                display: flex;
                flex-direction: row;
                align-items: baseline;
                height: 100%;
              }
              .name-section {
                display: flex;
                flex-direction: row;
                align-items: baseline;
              }
            }
          `}
        </style>
      </div>
    );
  }
};

export default JournalistNames;
