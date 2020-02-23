import React, { Component, FunctionComponent } from "react";
import * as d3 from "d3";

interface LineProps {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  height: number;
  width: number;
  yDomain: number[];
  locationFrequency: [number, number][];
}

const Line: FunctionComponent<LineProps> = (props: LineProps) => {
  //Sizing settings:
  const margin = props.margin;
  const height = props.height - margin.top - margin.bottom;
  const width = props.width - margin.left - margin.right;

  //Array with frequency of attacks in location per year:
  const locationFrequency = props.locationFrequency;
  //y-axis domain:
  const yDomain = props.yDomain;

  // D3 Line:
  const x = d3.scaleTime().range([0, width]);

  const y = d3.scaleLinear().range([height, 0]);

  const line = d3
    .line()
    .x(function(d: any) {
      return x(d.year);
    })
    .y(function(d: any) {
      return y(d.Freq);
    });

  locationFrequency.forEach(() => {
    x.domain(
      d3.extent(locationFrequency, function(d: any) {
        return d.year;
      }) as [any, any]
    );
    y.domain(yDomain);
  });

  const newline = line(locationFrequency) as string;

  return (
    <div>
      <path className="line" d={newline}></path>
      <style jsx>{`
        .axis path,
        .axis line {
          fill: none;
          stroke: #000;
          shape-rendering: crispEdges;
        }
        .x.axis path {
          display: none;
        }

        .line {
          fill: none;
          stroke: #e10000;
          stroke-width: 2px;
        }
      `}</style>
    </div>
  );
};

export default Line;
