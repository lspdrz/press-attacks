import React, { Component } from 'react';
import './css/App.css';

// Components
import CountryList from './CountryList';
import CountryInfo from './graph/CountryInfo'
import CountryGraph from './graph/CountryGraph';
import JournalistNames from './journalistspanel/JournalistNames'

import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';

//Import json
import locationfrequencydata from './data/location_frequency.json'
import pressattacksdata from './data/press_attacks_data.json'
import countriesdata from './data/countries.json'
import sortedyeardata from './data/attacks_sorted_by_year.json'

Amplify.configure(aws_exports);

export default class App extends Component {
  state = {
    country: '',
    journalist: '',
    paneIsOpen: false,
    graphWidth: 0,
    graphHeight: 0,
    resetScrollPosition: false,
  }

  // Lifecycle functions
  componentWillMount() {
    window.addEventListener('resize', this.measure, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measure, false)
  }

  componentDidMount() {
    this.measure()
  }

  // Measures the size of the graph
  measure = () => {
    let chartRect = this.chart.getBoundingClientRect();
    let infoRect = this.info.getBoundingClientRect();
    if (window.innerWidth > 700) {
      if (this.state.graphWidth !== chartRect.width || this.state.graphHeight !== (chartRect.height - infoRect.height)) {
        this.setState({
          graphWidth: chartRect.width,
          //offset for the margins and info text
          graphHeight: chartRect.height - infoRect.height
        });
      }
    }
    else {
      this.setState({
        graphWidth: window.innerWidth - 25,
        graphHeight: 300
      })
    }
  }

  // Button functions
  handleShowCountry = (country) => {
    if (country === this.state.country) {
      this.setState(prevState=> ({
        country: '',
        paneIsOpen: false,
        resetScrollPosition: true,
      }))
    }
    else {
      this.setState(prevState => ({
        country: country,
        paneIsOpen: false,
        resetScrollPosition: true,
      }));
    }
  }

  handleClosePane = () => {
    this.setState(prevState=> ({
      paneIsOpen: false,
      resetScrollPosition: false,
    }));
  }

  handleOpenPane = () => {
    this.setState(prevState=> ({
      paneIsOpen: true,
    }));
  }

  render() {
    // All of the attacks that happened in the country
    var country = this.state.country
    var pressAttacks = [];
    var numAttacks = 0;

    pressattacksdata.forEach((entry, i) => {
      if (entry.location === country) {
        pressAttacks.push(entry)
        numAttacks += 1;
      }
    })

    return (
      <div className="app">
        <div className="left-side">
          <header className="header">
            <h1 className="title">Attacks on Journalists</h1>
            <h2 className="subtitle">from 1992 to 2018</h2>
          </header>
          <div className="container">
            <CountryList countriesData={countriesdata}
                         country={this.state.country}
                         onHandleShowCountry={this.handleShowCountry} />
          <div className="graph-info">
              <div ref={(info)=>{this.info=info}} className="info-container">
                <CountryInfo country={this.state.country}
                             numAttacks={numAttacks}/>
              </div>
              <div ref={(chart)=>{this.chart=chart}} className="graph-container">
                <CountryGraph country={this.state.country}
                              locationFrequencyData={locationfrequencydata}
                              graphWidth={this.state.graphWidth}
                              graphHeight={this.state.graphHeight} />
              </div>
            </div>
          </div>
        </div>
        <div className="right-side">
          <JournalistNames pressAttacksYearSorted={sortedyeardata}
                           country={this.state.country}
                           onHandleChangeJournalist={this.handleChangeJournalist}
                           onHandleClosePane={this.handleClosePane}
                           onHandleOpenPane={this.handleOpenPane}
                           paneIsOpen={this.state.paneIsOpen}
                           resetScrollPosition={this.state.resetScrollPosition}/>
        </div>
      </div>
    );
  }
}
