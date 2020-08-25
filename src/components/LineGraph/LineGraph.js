import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
	legend: {
		display: false,
	},
	elements: {
		point: {
			radius: 0,
		},
	},
	maintainAspectRatio: false,
	tooltips: {
		mode: "index",
		intersect: false,
		callbacks: {
			label: function (tooltipItem, data) {
				return numeral(tooltipItem.value).format("+0,0");
			},
		},
	},
	scales: {
		xAxes: [
			{
				type: "time",
				time: {
					format: "MM/DD/YY",
					tooltipFormat: "ll",
				},
			},
		],
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				ticks: {
					callback: function (value, index, values) {
						return numeral(value).format("0a");
					},
				},
			},
		],
	},
};

const casesTypeColors = {
	cases: {
		hex: "#CC1034",
		hexBg: "#cc103450",
	},
	recovered: {
		hex: "#7dd71d",
		hexBg: "#7dd71d50",
	},
	deaths: {
		hex: "#fb4443",
		hexBg: "#fb444350",
	},
};

const buildChartData = (data, casesType = "cases") => {
	const chartData = [];

	let lastDataPoint;

	for (let date in data.cases) {
		if (lastDataPoint) {
			const newDataPoint = {
				x: date,
				y: data[casesType][date] - lastDataPoint,
			};
			chartData.push(newDataPoint);
		}
		lastDataPoint = data[casesType][date];
	}

	return chartData;
};

function LineGraph({ casesType, ...props }) {
	const [data, setData] = useState({});

	// https://disease.sh/v3/covid-19/historical/all?lastdays=120

	useEffect(() => {
		const fetchData = async () => {
			await fetch(
				"https://disease.sh/v3/covid-19/historical/all?lastdays=120"
			)
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					const chartData = buildChartData(data, casesType);

					setData(chartData);
				});
		};

		fetchData();
	}, [casesType]);

	return (
		<div className={props.className}>
			{data?.length > 0 && (
				<Line
					data={{
						datasets: [
							{
								backgroundColor:
									casesTypeColors[casesType].hexBg,
								borderColor: casesTypeColors[casesType].hex,
								data: data,
							},
						],
					}}
					options={options}
				/>
			)}
		</div>
	);
}

export default LineGraph;
