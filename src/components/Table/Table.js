import React from "react";
import numeral from "numeral";
import "./styles.css";

function Table({ countries }) {
	return (
		<div className="table">
			{countries.map((country, index) => (
				<tr key={index}>
					<td>{country.country}</td>
					<td>
						<strong>{numeral(country.cases).format("0,0")}</strong>
					</td>
				</tr>
			))}
		</div>
	);
}

export default Table;
