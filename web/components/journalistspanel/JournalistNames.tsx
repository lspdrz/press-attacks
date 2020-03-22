/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useRef,
  FunctionComponent,
  useEffect,
  useCallback,
  useContext,
  useMemo
} from "react";
import { AppContext } from "../appContext";
import journalistNamesStyles from "../../styles/journalistNames";
import JournalistPane from "./JournalistPane";
import { Journalist } from "../../types/press-attacks";

interface JournalistNamesProps {
  journalists: Journalist[];
}
/*
This is the JournalistNames component that displays the names
of journalists on the right side of the application when a country
is selected. It also acts as the parent to the JournalistPane component.
Refs:
- names: the names div
- journalistContainer: the journalist-container div
Functions:
- handleChangeJournalist(name): Sets the journalist state variable to the
passed in name. Then sets the scrollTop and scrollLeft states before setting
- getJournalistButtonDivs(): Loops through pressAttacksYearSorted data and generates
the divs used in the name-section.
*/

const JournalistNames: FunctionComponent<JournalistNamesProps> = (
  props: JournalistNamesProps
) => {
  const { journalists } = props;
  const { journalist, dispatchJournalist } = useContext(AppContext);
  const { scrollTop, dispatchScrollTop } = useContext(AppContext);
  const { scrollLeft, dispatchScrollLeft } = useContext(AppContext);
  const names = useRef<HTMLDivElement>(null);
  const journalistContainer = useRef<HTMLDivElement>(null);

  /* When the component updates, readjust the scroll to
  the previous names div position or set to 0 for the journalistContainer
  div */
  useEffect(() => {
    if (names && names.current) {
      names.current.scrollTop = scrollTop;
      names.current.scrollLeft = scrollLeft;
    } else if (journalistContainer.current) {
      journalistContainer.current.scrollTop = 0;
      journalistContainer.current.scrollLeft = 0;
    }
  });

  const handleChangeJournalist = useCallback(
    (journalist: Journalist) => {
      dispatchJournalist({ type: "SELECT", journalist: journalist });
      if (names.current) {
        dispatchScrollTop({
          type: "SELECTED_JOURNALIST",
          scrollValue: names.current.scrollTop
        });
        dispatchScrollLeft({
          type: "SELECTED_JOURNALIST",
          scrollValue: names.current.scrollTop
        });
      }
    },
    [dispatchJournalist, dispatchScrollLeft, dispatchScrollTop]
  );

  const getJournalistButtonDivs = useCallback(
    (journalists: any) => {
      if (journalists.length === 0) return null;
      let currentYear = 0;
      let journalistButtons: any[] = [];
      let result = [];
      journalists.forEach((entry: any, idx: number) => {
        let year = entry.year.slice(0, 4);
        if (year !== currentYear) {
          if (currentYear !== 0) {
            result.push(
              <div className="name-section" key={currentYear}>
                {journalistButtons}
              </div>
            );
            journalistButtons = [];
          }
          currentYear = year;
          journalistButtons.push(
            <p className="names-year" key={currentYear}>
              {currentYear}
            </p>
          );
        }
        journalistButtons.push(
          <button
            className="name-button"
            key={idx}
            value={entry.fullName}
            onClick={() => handleChangeJournalist(entry)}
          >
            {entry.fullName}
          </button>
        );
      });
      //One last wrap for the end cases:
      result.push(
        <div className="name-section" key={currentYear}>
          {journalistButtons}
        </div>
      );
      return result;
    },
    [handleChangeJournalist]
  );
  const journalistButtonDivs = useMemo(
    () => getJournalistButtonDivs(journalists),
    [getJournalistButtonDivs, journalists]
  );

  return journalist.id !== "" ? (
    <div ref={journalistContainer} className="journalist-container">
      <JournalistPane
        journalist={journalist}
        onHandleClosePane={() => dispatchJournalist({ type: "DESELECT" })}
      />
    </div>
  ) : (
    <div ref={names} className="names">
      {journalistButtonDivs}
      <style jsx global>
        {journalistNamesStyles}
      </style>
    </div>
  );
};
export default JournalistNames;
