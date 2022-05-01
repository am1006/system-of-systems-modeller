const { format } = require('./db');
const sql = require('./db');
const System = require('./System');

let debugLevel = 7;

//Debug function local to the methods in this file
function debug(level, msg){
	if (debugLevel >= level){
        console.log(msg);
    }
}

exports.switch = (req,res) => {
	debug(1, `graph.js debug level: ${debugLevel} req.body.type: ${req.body.type}`);

    var queryString = '';

    //******************************** Graph ****************************************
    //Gets the nodes for the graph


	//Get all the systems requested by the user
	queryString = sql.format(`SELECT a.id_system, name, image, tags, a.quantity
	FROM quantities AS a
	LEFT JOIN quantities AS b
	ON a.id_system = b.id_system AND a.year < b.year
	LEFT JOIN systems
	ON systems.id_system = a.id_system
	WHERE b.year IS NULL AND a.year <= ${req.body.year} AND a.quantity > 0`);
	var includedTags = [];
	var excludedTags = [];

	//Handle included and excluded tags
	switch (2 * Boolean(req.body.includedFilterTag) + Boolean(req.body.excludedFilterTag)){
		case 3:
			//Both included and excluded tags have been provided
			includedTags = req.body.includedFilterTag.split(',');
			excludedTags = req.body.excludedFilterTag.split(',');
			queryString += sql.format(` AND (`);
			includedTags.forEach((element) => {
				queryString += sql.format(`tags LIKE ? OR `, ['%' + element + '%']);
			})
			queryString = queryString.substring(0, queryString.length - 4);
			queryString += ') AND NOT (';
			excludedTags.forEach((element) => {
				queryString += sql.format(`tags LIKE ? OR `, ['%' + element + '%']);
			})
			queryString = queryString.substring(0, queryString.length - 4);
			queryString += ');';
			break;
		case 2:
			//Only included tags have been provided
			includedTags = req.body.includedFilterTag.split(',');
			queryString += sql.format(` AND (`);
			includedTags.forEach((element) => {
				queryString += sql.format(` tags LIKE ? OR`, ['%' + element + '%']);
			})
			queryString = queryString.substring(0, queryString.length - 3);
			queryString += ');';
			break;
		case 1:
			//Only excluded tags have been provided
			excludedTags = req.body.excludedFilterTag.split(',');
			queryString += sql.format(` AND`);
			excludedTags.forEach((element) => {
				queryString += sql.format(` tags NOT LIKE ? AND`, ['%' + element + '%']);
			})
			queryString = queryString.substring(0, queryString.length - 4);
			queryString += ';';
			break;
		case 0:
			//No tags have been provided
			queryString += ';'
		default:
	}

	var systemsArr = [];
	var systemsIdArr = [];
	var interfacesArr = [];
	var SIIdArr = [];
	var networksArr = [];
	var statsObj = {};

	executeQuery(queryString)
		.then((result) => {
			debug(7, 'System Table result no rows: ' + result.length);
			
			//Create a new system object for each row of the systems table
			//Make sure there are systems to display
			if (result.length > 0){
				//Loop through the systems table, creating a new System object for each row
				result.forEach(element => {

					//Create a new system object in the systemsArr
					systemsArr.push(new System(element, req.body.showInterfaces))
					systemsIdArr.push(element.id_system);
				});
			} else {
				return new Promise((resolve,reject) => {
					reject({msg: 'There are no systems available for the given year, given filter terms.'})
				})
			}

			//Get only the system interfaces which belong to systems which are available in the current year
			return executeQuery(sql.format(`
				SELECT * FROM interfaces;
				SELECT SIMap.id_SIMap, SIMap.id_system, interfaces.id_interface, interfaces.name, interfaces.image, SIMap.isProposed
				FROM SIMap 
				LEFT JOIN interfaces ON interfaces.id_interface = SIMap.id_interface
				WHERE SIMap.id_system IN (?)
				ORDER BY SIMap.id_system;`, [systemsIdArr]))
		})
		.then((result) => {
			debug(7, 'Interfaces Table result no rows: ' + result[0].length);
			debug(7, 'SIMap Table result no rows: ' + result[1].length);
			//Create an interfaces table for capturing the quantity of interfaces available,
			//add each system interface to the respective system and fetch their associated networks.

			//Loop through the interfaces table, creating a new Interface object for each row
			interfacesArr = [];

			result[0].forEach((element) => {
				interfacesArr.push({
					id_interface: element.id_interface,
					name: element.name,
					quantity: 0,
					systems: []
				})
			})

			//Loop through the system interfaces table and add the interfaces to the respective system
			//Additionally, add the quanitity of systems available in this year to interfacesArr
			result[1].forEach((element) => {

				//For next query, track the SI's which are used in this year
				SIIdArr.push(element.id_SIMap);

				for (var i = 0; i < systemsArr.length; i++){
					if (systemsArr[i].id_system == element.id_system){
						//Add the systems interface
						systemsArr[i].interfaces.push({
							id_SIMap: element.id_SIMap,
							id_interface: element.id_interface,
							name: element.name,
							image: element.image,
							isProposed: element.isProposed,
							networks: [],
							issues: [],
						})

						//Update interfacesArr total quantity, as well as an array to track which systems the interface is installed within
						for (var j = 0; j < interfacesArr.length; j++){
							if (interfacesArr[j].id_interface == element.id_interface){
								//found the matching generic interface
								interfacesArr[j].quantity += systemsArr[i].qtySystemsThisYear;
								interfacesArr[j].systems.push(element.id_system)
								break;
							}
						}
					}
				}
			})

			//Prune interfacesArr for any interfaces which are not available in the current year
			for (var i = 0; i < interfacesArr.length; i++){
				
				if (interfacesArr[i].quantity == 0 ){
					//Remove the interface object from the array
					interfacesArr.splice(i,1);
					i--;
				}
			}

			//Return the networks associated with the system interfaces
			return executeQuery(sql.format(`
				SELECT SINMap.id_SIMap, SINMap.id_network, networks.name, networks.image
				FROM SINMap
				LEFT JOIN networks
				ON SINMap.id_network = networks.id_network;`, [SIIdArr])
			)
		})
		.then((result) => {
			debug(7, 'SINMap Table result no rows: ' + result.length);
			//Add the network to the system interface

			//Loop through SIN records, assigning them to every SI, if they match
			result.forEach((element) => {

				//Track if the network is used in this year
				var flag = false;

				//Loop through every system
				for (var i=0; i < systemsArr.length; i++){

					//Loop through every SI
					for (var j=0; j < systemsArr[i].interfaces.length; j++){
						//Setup a SIN object for the SI
						//systemsArr[i].interfaces[j].networks = [];

						//Assign the network to the SI
						if (systemsArr[i].interfaces[j].id_SIMap == element.id_SIMap){
							systemsArr[i].interfaces[j].networks.push({
								id_network: element.id_network,
								//name: element.name,
								//image: element.image,
							})
							flag = true;
						}
					}
				}

				//If the network is used, add to networkArr so the node can be created							//Dumb: SIN records contain multiple versions of the same network. But works
				if (flag){
					networksArr.push({
						id_network: element.id_network,
						name: element.name,
						image: element.image,
					})
				}

			})
			//Return the issues associated with System Interfaces
			return executeQuery(sql.format(`
				SELECT systems.id_system, issues.*
				FROM issues
				LEFT JOIN SIMap
				ON SIMap.id_SIMap = issues.id_type
				LEFT JOIN systems
				ON SIMap.id_system = systems.id_system
				WHERE id_type IN (?) AND type = 'SystemInterface';`, [SIIdArr]) //SystemInterface issues
			)
		})
		.then((result) => {	//Handle SystemInterface issues
			debug(7, 'Issues Table result no rows: ' + result.length);

			//Go through each system
			systemsArr.forEach((systemElement) => {
				//Go through the system's interfaces
				systemElement.interfaces.forEach((interfaceElement) => {
					//Go through System Interface issues
					result.forEach((issueElement) => {
						if (issueElement.id_system == systemElement.id_system){

							if (issueElement.id_type == interfaceElement.id_SIMap){
								//Issue is a match to this system interface
								interfaceElement.issues.push(
									{
										severity: issueElement.severity,
										name: issueElement.name
									})
							}
						}
					})

					//Go through Interface issues
				})
			})


			//Save each issue to statsObj
			statsObj.issues = {}
			statsObj.issues.systemInterfaces = [];
			
			result.forEach((element) => {
				statsObj.issues.systemInterfaces.push(element.id_issue)
			})



	//*************************************** Response to client *******************************************************/
			var responseArr = []

			//Produce the network nodes																		//Need to look more closely how this works
			networksArr.forEach((element) => {
				responseArr.push({
					group: 'nodes',
					data: {
						id: 'node_n_' + element.id_network,
						id_network: element.id_network,
						nodeType: 'Network',
						name: element.name,
						filename: './images/' + element.image,
					},
					classes: 'network'
				})
			})
			
			//Produce the system nodes and edges (links)
			systemsArr.forEach((element) => {
				responseArr = responseArr.concat(element.getCyObject());
			})

			//Build an array of stats to assist with other info
			statsObj.interfaceCounts = interfacesArr;

			//Respond to the client
			res.send([responseArr,statsObj])
		})
		.catch((err) => {
			debug(1, err)
			if (err.msg == 'No systems'){
				res.json({data: {}});
			} else {
				res.json({err: 'There was an error executing the query'})
			}
		});
}


var executeQuery = (queryString) => new Promise((resolve,reject) => {
	//Submit the query to the database
	queryString = queryString.trim();
	let re = /\n\s\s+/gi;
	queryString = queryString.replace(re,'\n\t')
	debug(7, 'Query:  ' + queryString);
	sql.query(queryString, (err,res) => {
		if (err) { 
            reject(err);
        }
		resolve(res);
	})    
}) 
