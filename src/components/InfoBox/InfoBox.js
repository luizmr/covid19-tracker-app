import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./styles.css";

function InfoBox({ title, cases, total, active, isCase, isDeath, ...props }) {
	return (
		<Card
			className={`infoBox ${active && "infoBox--selected"} ${
				isCase && "infoBox--case"
			} ${isDeath && "infoBox--death"} `}
			onClick={props.onClick}
		>
			<CardContent>
				<Typography className="infoBox__title" color="textSecondary">
					{title}
				</Typography>

				<h2
					className={`infoBox__cases ${
						!isCase && !isDeath && "infoBox__cases--recovered"
					} ${isDeath && "infoBox__cases--death"}`}
				>
					{cases}
				</h2>

				<Typography className="infoBox__total" color="textSecondary">
					{total} Total
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
