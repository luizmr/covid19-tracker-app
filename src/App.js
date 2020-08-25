import React, { useState, useEffect } from "react";
import {
	MenuItem,
	FormControl,
	Select,
	Card,
	CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./components/LineGraph/LineGraph";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState("worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [casesType, setCasesType] = useState("cases");
	const [mapCenter, setMapCenter] = useState({
		lat: 34.80746,
		lng: -40.4796,
	});
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);

	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((res) => res.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	// https://disease.sh/v3/covid-19/countries
	useEffect(() => {
		const getCountriesData = async () => {
			await fetch(`https://disease.sh/v3/covid-19/countries`)
				.then((res) => res.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));

					const sortedData = sortData(data);

					setTableData(sortedData);

					setCountries(countries);

					setMapCountries(data);
				});
		};

		getCountriesData();
	}, [countries]);

	const handleCountry = async (e) => {
		const countryCode = e.target.value;
		setCountry(countryCode);

		const url =
			countryCode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		if (countryCode === "worldwide") {
			await fetch(url)
				.then((res) => res.json())
				.then((data) => {
					setCountryInfo(data);
					setMapCenter([34.80746, -40.4796]);
					setMapZoom(3);
				});
		} else {
			await fetch(url)
				.then((res) => res.json())
				.then((newData) => {
					setCountryInfo(newData);

					setMapCenter([
						newData.countryInfo.lat,
						newData.countryInfo.long,
					]);
					setMapZoom(4);
				});
		}
	};

	useEffect(() => {
		if (countryInfo.length > 0) {
			setMapCenter([countryInfo.lat, countryInfo.long]);
		}
	}, [countryInfo]);

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 TRACKER</h1>

					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							value={country}
							onChange={handleCountry}
						>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country, index) => (
								<MenuItem value={country.value} key={index}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

				<div className="app__stats">
					<InfoBox
						title="Coronavirus Cases"
						total={prettyPrintStat(countryInfo.cases)}
						cases={prettyPrintStat(countryInfo.todayCases)}
						onClick={(e) => setCasesType("cases")}
						active={casesType === "cases"}
						isCase
					/>
					<InfoBox
						title="Recovered"
						total={prettyPrintStat(countryInfo.recovered)}
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						onClick={(e) => setCasesType("recovered")}
						active={casesType === "recovered"}
					/>
					<InfoBox
						isDeath
						title="Deaths"
						total={prettyPrintStat(countryInfo.deaths)}
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						onClick={(e) => setCasesType("deaths")}
						active={casesType === "deaths"}
					/>
				</div>

				<Map
					center={mapCenter}
					zoom={mapZoom}
					countries={mapCountries}
					casesType={casesType}
				/>
			</div>
			<Card className="app__right">
				<CardContent>
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />
					<h3 className="app__graphTitle">
						Worldwide new {casesType}
					</h3>
					<LineGraph casesType={casesType} className="app__graph" />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
