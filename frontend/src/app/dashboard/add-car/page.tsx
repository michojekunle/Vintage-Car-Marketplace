"use client";
import React from "react";
import AddCarForm from "./_components/add-car-form";
// import jsonp from 'jsonp';

const AddCar = () => {
	// "https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getYears"

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		console.log("running")
		
	// 		const url = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getYears';
    
	// 		jsonp(url, { name: 'callback' }, (err, response) => {
	// 		  if (err) {
	// 			console.log(err.message);  // Handle any errors
	// 		  } else {
	// 			console.log({response});      // Store the data
	// 		  }
	// 		});
	// 		// console.log(data);
	// 	};
	// 	fetchData();
	// }, []);

	return <AddCarForm />;
};

export default AddCar;
