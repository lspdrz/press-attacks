import React, { Component } from 'react';

import JournalistPane from './JournalistPane'
import pressattacksdata from '../data/press_attacks_data.json'

export default class JournalistNames extends Component {

  static defaultProps = {
    pressAttacksYearSorted: [],
    country: ''
  }

  state = {
    journalist: '',
  }

  handleChangeJournalist = (e) => {
    var journalist = e.target.value
    this.setState(prevState => ({
      journalist: journalist,
    }));
    this.props.onHandleOpenPane();
  }

  handleClosePane = () => {
    this.props.onHandleClosePane();
  }

  render() {
    const {
      pressAttacksYearSorted,
      country,
      paneIsOpen
    } = this.props

    var currentYear = 0
    var resultDivs = []
    var result = []
    pressAttacksYearSorted.forEach((entry, i) => {
      if (entry.location === country) {
        if (entry.year === currentYear) {
          result.push(<button className="name-button"
                              key={i}
                              value={entry.name}
                              onClick={this.handleChangeJournalist}>
                              {entry.name}
                              </button>)
        }
        else {
          // Wrap in div
          if (currentYear !== 0) {
            resultDivs.push(<div className="name-section">{result}</div>);
            result = []
          }
          currentYear = entry.year
          result.push(<p className="names-year">{currentYear}</p>)
          result.push(<button className="name-button"
                              key={i}
                              value={entry.name}
                              onClick={this.handleChangeJournalist}>
                              {entry.name}
                              </button>)
        }
      }
    })

    //One last wrap for the end cases:
    resultDivs.push(<div className="name-section">{result}</div>)

    if (paneIsOpen) {
      return (
        <div className="names">
          <JournalistPane journalist={this.state.journalist}
                          journalistData={pressattacksdata}
                          onHandleClosePane={this.handleClosePane} />
        </div>
      )
    }
    else {
      return (
        <div className="names">
          {resultDivs}
        </div>
      )
    }
  }
}
