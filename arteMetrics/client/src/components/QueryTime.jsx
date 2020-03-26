import * as d3 from 'd3';
import React, { useState, useEffect, useRef } from 'react';

const QueryTime = () => {
    const svgRef = useRef();
    const startOffset = [];
    const resolverDuration = [];
    const paths = [];
    const rootQuery = [];
    const request = [];
    const response = [];
    const [startOffSet, setStartOffset] = useState(startOffset);
    const [root, setRoot] = useState(rootQuery);
    const [path, setPath] = useState(paths);
    const [resolver, setResolver] = useState(resolverDuration);

    d3.json('/query/345').then(queries => {
        const {id, api_key, name, start_time, end_time, duration} = queries[0];
        rootQuery.push(id, api_key, name, start_time, end_time, duration);
        const resolvers = queries[0].resolvers;
        console.log(rootQuery)
        console.log(resolvers)
        resolvers.forEach((info, i) => {
            startOffset.push(info['startOffset']);
            resolverDuration.push(info['duration']);
            paths.push(info['path']);
        })
        console.log(startOffSet, resolver)
        const responseTime = rootQuery[5]- ((startOffSet[startOffSet.length-1]) - resolver[resolver.length-1]);
        const responseOffset = startOffSet[startOffSet.length - 1] + resolver[resolver.length - 1];
        response.push(responseTime, responseOffset)
        resolverDuration.push(response);
        // console.log('this is response', response)
        console.log('resolver', resolver)


        const width = 1400;
        const height = 1000;

        //this sets the main svg tag that will be used to create the chart
        const svg = d3.select(svgRef.current)
        .attr('class', 'svg')
        .attr('width', width)
        .attr('height', height);

        //creating the x-axis 
        const x = d3.scaleLinear()
        .domain([0, d3.max(root, (d) => d/1000)])
        .range([100, width - 100]);

        const xAxis = g => {
            g.attr('class', 'x-axis')
            .attr('transform', `translate(0, 30)`)
            .call(d3.axisTop(x))
        }

        svg.append('g')
        .call(xAxis)


        //appending a rect tag to svg
        svg.append('rect')
        .attr('class', 'background')
        .attr('fill', 'none')
        .attr('width', width)
        .attr('height', height)

        //this renders the bars
        svg.selectAll('rect')
            .data(root[5])
            .enter()
            .append('rect')
            .attr('x', d => d)
            .attr('y', (d, i) => (i + 1) * 30)
            .attr('width', (d) => d)
            .attr('height', 25)
            .attr('class', 'firstbar')
            .data(resolvers)
            .enter()
            .append('rect')
            .attr('x', (d, i) => d["startOffset"] / 1000000)
            .attr('y', (d, i) => (i + 1) * 30)
            .attr('width', (d, i) => {
              if (i === 0) return d["duration"] / 1000000;
              else return d["duration"] / 10000;
            })
            .attr('height', 6)
            .attr('transform', 'translate(100, 10)')
            .attr('fill', 'navy')
            .attr('class', 'bar')

        svg.selectAll('rect')
            .data(response)
            .enter()
            .append('rect')
            .attr('x', (d, i) => d[1] / 1000000)
            // .attr('y', (d, i) => ())

        //this renders the path's of each bar
            svg.selectAll('text')
            .data(root[2])
            .enter()
            .append('text')
            .text((d) => d)
            .attr('x', 0)
            .attr('y', 0)
            .data(resolvers)
            .enter()
            .append('text')
            .attr('text-anchor', 'end')
            .text((d) => d["path"].join('.'))
            //  + ' ' + Math.floor(d["duration"]/1000) + 'µs')
            .attr('x', (d, i) => (d["startOffset"] / 1000000) + 90 )
            .attr('y', (d, i) => (i + 1) * 30)
            .attr('transform', 'translate(0, 20)')
            .attr('class', 'text');

        // svg.selectAll('text')
        //     .data(resolvers)
        //     .enter()
        //     .append('text')
        //     .attr('text-anchor', 'start')
        //     .text((d) => `d["duration"]/1000 µs`)
        //     .attr('x', (d, i) => (d["startOffset"] / 1000000) + 100)
        //     .attr('y', (d, i) => (i + 1) * 30)
        //     .attr('transform', 'translate(0, 20)')
        //     .attr('class', 'text');
    })
    return (
      <React.Fragment>
        <svg ref={svgRef}>
        </svg>
      </React.Fragment>
    );
  }

export default QueryTime;