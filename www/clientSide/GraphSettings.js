/**
 * 
 * 
 * @author TL
 * @description Used to track the settings applied to the graph across sessions
 */
class GraphSettings{
	constructor(){
		//Setup localStorage with default values if not already populated
		debug(1, 'In GraphSettings Class');

		//Constants
		this.graphLayoutNames = ['cose', 'breadthfirst', 'circle', 'concentric', 'grid', 'random'];
		this.defaultLandingPageOptions = ['graph', 'summary', 'issues'];

		//localStorage.clear();

		//Set default values client-side if they don't already exist
		if(!localStorage.getItem('activeYear')) { localStorage.setItem('activeYear', 2022); }
		if(!localStorage.getItem('refreshOnUpdate')) { localStorage.setItem('refreshOnUpdate', 0); }
		if(!localStorage.getItem('ignoreYears')) { localStorage.setItem('ignoreYears', 0); }
		if(!localStorage.getItem('showInterfaces')) { localStorage.setItem('showInterfaces', 1); }
		if(!localStorage.getItem('defaultLandingPage')) { localStorage.setItem('defaultLandingPage', 'graph'); }
		if(!localStorage.getItem('showIssues')) { localStorage.setItem('showIssues', 1); }
		if(!localStorage.getItem('includedFilterTag')) { localStorage.setItem('includedFilterTag', ''); }
		if(!localStorage.getItem('excludedFilterTag')) { localStorage.setItem('excludedFilterTag', ''); }
		if(!localStorage.getItem('linksAsNodes')) { localStorage.setItem('linksAsNodes', 0); }
		if(!localStorage.getItem('displaySubsystems')) { localStorage.setItem('displaySubsystems', 0); }

		//Graph layout
		if(!localStorage.getItem('graphLayoutName')) { localStorage.setItem('graphLayoutName', 'cose') }
		if(!localStorage.getItem('graphLayoutRows')) { localStorage.setItem('graphLayoutRows', 5) }
		if(!localStorage.getItem('graphLayoutAnimate')) { localStorage.setItem('graphLayoutAnimate', 0) }
		
		debug(3,localStorage)
	}
	
	/**
	 * @description 
	 * 
	 * @returns 
	 */
	 getGraphLayout(){

		var layout = {
			name: localStorage.getItem('graphLayoutName'),
			rows: localStorage.getItem('graphLayoutRows'),
			animate: localStorage.getItem('graphLayoutAnimate'),
		}
		return layout;
	 }

	/**
	 * @description 
	 * 
	 * @returns An array containing objects which define the inputs required to update the objects
	 * values
	 */
	getFormControls(){
		return [
			{ type: 'checkbox', id: 'showInterfaces', label: 'Display Interface Nodes', value: localStorage.getItem('showInterfaces') },
			{ type: 'checkbox', id: 'refreshOnUpdate', label: 'Redraw the graph on update', value: localStorage.getItem('refreshOnUpdate') },
			{ type: 'checkbox', id: 'ignoreYears', label: 'Show all subsystems regardless of their active years', value: localStorage.getItem('ignoreYears') },
			{ type: 'checkbox', id: 'showIssues', label: 'Display issues on graph', value: localStorage.getItem('showIssues') },
			{ type: 'checkbox', id: 'linksAsNodes', label: 'Consolidate Links as Nodes (Not yet implemented)', value: localStorage.getItem('linksAsNodes') },
			{ type: 'checkbox', id: 'displaySubsystems', label: 'Display Subsystems (Not yet implemented)', value: localStorage.getItem('displaySubsystems') },
			
			{ type: 'select', id: 'graphLayoutName', label: 'Graph Layout', value: localStorage.getItem('graphLayoutName'), options: this.graphLayoutNames },
			{ type: 'select', id: 'defaultLandingPage', label: 'Default Landing Page', value: localStorage.getItem('defaultLandingPage'), options: this.defaultLandingPageOptions },
		];
	}

	/**
	 * @description Exports the contents of this object for saving to the graphSettings
	 * table in the database.
	 * 
	 * @returns	The array of settings containing {key, value} pairs for posting to the server
	 */
	export(){

		//Iterate through the settingsArr and update the values
		for (var i = 0; i < this.settingsArr.length; i++){
			this.settingsArr[i].value = this[this.settingsArr[i].keyName]	
		}
		console.log('export ', this.settingsArr)
		return this.settingsArr;
	}
}


//Cy styling objects
var cyStyle = [ // the stylesheet for the graph
	{
		selector: 'node',
		style: {
			'width': '100px',
			'background-width': '92px',
			'height': '100px',
			'background-height': '92px',
			'background-color': 'white',
			'background-image': 'data(filename)',
			'background-fit': 'none',
			'label': 'data(name)',
			'border-color': 'black',
			'border-width': '3px'
		}
	},
	{
		selector: '.network',
		style: {
			'width': '80px',
			'background-width': '80px',
			'height': '80px',
			'background-height': '80px',
			'border-color': 'blue',
			'shape': 'round-octagon'
		}
	},
	{
		selector: '.interface',
		style: {
			'width': '60px',
			'background-width': '52px',
			'height': '60px',
			'background-height': '52px',
			'border-color': 'black',
		}
	},

	{ selector: '.critical', style: { 'background-color': 'red' }},
	{ selector: '.warning', style: { 'background-color': '#ffcc00' }},
	{ selector: '.notice', style: { 'background-color': '#33cc33' }},



	{ selector: '.red', style: { 'line-color': 'red'	}},
	{ selector: '.blue', style: { 'line-color': 'blue'	}},
	{ selector: '.amber', style: { 'line-color': 'orange'	}},

	{
		selector: 'edge',
		style: {
			'width': 3,
			'line-color': '#000',
			'curve-style': 'bezier',
		}
	},
	{
		selector: 'edge[name]',
		style: {
			'label': 'data(name)',
			'color': 'black',
			'text-border-color': 'green',
			'text-border-opacity': 1,
			'text-border-width': 2,
			'line-color': 'orange',
			
			'text-background-padding': 1,
			'text-background-color': 'white',
			'text-background-opacity': 1,
		}
	},
	//Need to add styling for various subsystem classes
		
	{
		selector: '.class1',
		style: {
			'border-color': 'black',
		}
	},
	{
		selector: '.class2',
		style: {
			'border-color': 'orange',
		}
	},
	{
		selector: '.class3',
		style: {
			'border-color': 'purple',
		}
	},
	{
		selector: '.class4',
		style: {
			'border-color': 'green',
		}
	},

	{
		selector: '.proposed',
		style: {
			'line-style': 'dashed',
			'line-color': 'grey',
			'border-style': 'dashed',
			'border-color': 'grey',
		}
	},
];

//Cy layout object
var cyLayout = {
	//name: 'breadthfirst',
	name: 'cose',
	rows: 5,
	animate: false,
}


/*
class GraphSettings{
	constructor(){

		this.graphLayouts = ['cose', 'breadthfirst', 'circle', 'concentric', 'grid', 'random'];
		this.settingsArr = [];

		this.settingsArr.push({keyName: 'activeYear', value: 2022})
		this.settingsArr.push({keyName: 'refreshOnUpdate', value: false})
		this.settingsArr.push({keyName: 'ignoreYears', value: false})
		this.settingsArr.push({keyName: 'showInterfaces', value: 1})
		this.settingsArr.push({keyName: 'graphLayout', value: 'cose'})
		this.settingsArr.push({keyName: 'includedFilterTag', value: ''})
		this.settingsArr.push({keyName: 'excludedFilterTag', value: ''})
		this.settingsArr.push({keyName: 'mainPage', value: 'graph'})
		this.settingsArr.push({keyName: 'showIssues', value: 1})

		this.update(this.settingsArr);

	}

	/**
	 * @description 
	 * 
	 * @returns An array containing objects which define the inputs required to update the objects
	 * values
	 */
	/*
	getFormControls(){
		return [
			{ type: 'checkbox', id: 'showInterfaces', label: 'Display Interface Nodes', value: this.showInterfaces },
			{ type: 'checkbox', id: 'refreshOnUpdate', label: 'Redraw the graph on update', value: this.refreshOnUpdate },
			{ type: 'checkbox', id: 'ignoreYears', label: 'Show all subsystems regardless of their active years', value: this.ignoreYears },
			{ type: 'select', id: 'graphLayout', label: 'Graph Layout', value: this.graphLayout, options: this.graphLayouts },
			{ type: 'number', id: 'activeYear', label: 'Active Year', value: this.activeYear },
			{ type: 'text', id: 'includedFilterTag', label: 'Include subsystems with these tags', value: this.includedFilterTag },
			{ type: 'text', id: 'excludedFilterTag', label: 'Exclude subsystems with these tags', value: this.excludedFilterTag },
			{ type: 'select', id: 'mainPage', label: 'Graph Layout', value: this.graphLayout, options: ['graph', 'summary', 'issues'] },
			{ type: 'checkbox', id: 'showIssues', label: 'Display issues on graph', value: this.showIssues },
		];
	}


    /**
     * @description Updates this object with the contents of the graphSettings table 
     * in the database.
     * 
     * @param  {} updateArr
     */
	/*
    async update(updateArr){
		
		updateArr.forEach((element) => {
			//debug(element)
			this[element.keyName] = element.value;
			//debug('updating ' + element.keyName + ' to ' + this[element.keyName])
		});
    }



	/**
	 * @description Exports the contents of this object for saving to the graphSettings
	 * table in the database.
	 * 
	 * @returns	The array of settings containing {key, value} pairs for posting to the server
	 */
	/*
	export(){

		//Iterate through the settingsArr and update the values
		for (var i = 0; i < this.settingsArr.length; i++){
			this.settingsArr[i].value = this[this.settingsArr[i].keyName]	
		}
		console.log('export ', this.settingsArr)
		return this.settingsArr;
	}

	getLayout(){
		//debug('layout called');
		let layout = {
			name: this.graphLayout,
			rows: 5,
			animate: false //Stops the cose layout from bounicing all over the place
		}

		//debug(layout)
		return layout
	}

}


//Cy styling objects
var cyStyle = [ // the stylesheet for the graph
	{
		selector: 'node',
		style: {
			'width': '100px',
			'background-width': '92px',
			'height': '100px',
			'background-height': '92px',
			'background-color': 'white',
			'background-image': 'data(filename)',
			'background-fit': 'none',
			'label': 'data(name)',
			'border-color': 'black',
			'border-width': '3px'
		}
	},
	{
		selector: '.network',
		style: {
			'width': '80px',
			'background-width': '80px',
			'height': '80px',
			'background-height': '80px',
			'border-color': 'blue',
			'shape': 'round-octagon'
		}
	},
	{
		selector: '.interface',
		style: {
			'width': '60px',
			'background-width': '52px',
			'height': '60px',
			'background-height': '52px',
			'border-color': 'black',
		}
	},

	{ selector: '.critical', style: { 'background-color': 'red' }},
	{ selector: '.warning', style: { 'background-color': '#ffcc00' }},
	{ selector: '.notice', style: { 'background-color': '#33cc33' }},



	{ selector: '.red', style: { 'line-color': 'red'	}},
	{ selector: '.blue', style: { 'line-color': 'blue'	}},
	{ selector: '.amber', style: { 'line-color': 'orange'	}},

	{
		selector: 'edge',
		style: {
			'width': 3,
			'line-color': '#000',
			'curve-style': 'bezier',
		}
	},
	{
		selector: 'edge[name]',
		style: {
			'label': 'data(name)',
			'color': 'black',
			'text-border-color': 'green',
			'text-border-opacity': 1,
			'text-border-width': 2,
			'line-color': 'orange',
			
			'text-background-padding': 1,
			'text-background-color': 'white',
			'text-background-opacity': 1,
		}
	},
	//Need to add styling for various subsystem classes
		
	{
		selector: '.class1',
		style: {
			'border-color': 'black',
		}
	},
	{
		selector: '.class2',
		style: {
			'border-color': 'orange',
		}
	},
	{
		selector: '.class3',
		style: {
			'border-color': 'purple',
		}
	},
	{
		selector: '.class4',
		style: {
			'border-color': 'green',
		}
	},

	{
		selector: '.proposed',
		style: {
			'line-style': 'dashed',
			'line-color': 'grey',
			'border-style': 'dashed',
			'border-color': 'grey',
		}
	},
];

//Cy layout object
var cyLayout = {
	//name: 'breadthfirst',
	name: 'cose',
	rows: 5,
	animate: false,
}
*/