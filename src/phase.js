/**
 * Phase javascript library to be used in dota 2 Panorama. The aim of this library is aid
 * development of responsive dota 2 custom UIs.
 *
 * Developed and maintained by: Perry
 */

 /* Contructor */
function Phase() {
}

/* Phase initialisation */
(function() {
	Phase.animations = [];
	Phase.aniLoopRunning = false;
	Phase.previousTick = -1;

	Phase.DEF_VAL = {
		"opacity" : "1;"
	};
}());

/* Phase animation functions
=========================================================================================*/

/* Phase animation update loop */
Phase.UpdateLoop = function() {
	//Set animation meta values
	var frameTime = Game.GetGameTime() - Phase.previousTick;

	//Skip in case it scheduled twice on the same frame
	if (frameTime > 0) {
		//update all animations
		var i = 0;
		while ( i < Phase.animations.length) {
			//Update the animation
			var anim = Phase.animations[i];
			var timeLeft = anim.endTime - Game.GetGameTime();

			//Update all goals
			for (var property in anim.goal) {
				var goalVal = anim.goal[property];
				var pxProp = anim.target.style[property].indexOf( 'px' ) > -1;
				var curVal = pxProp ? parseFloat(anim.target.style[property].replace('px', '')) : parseFloat(anim.target.style[property]);

				var distance = goalVal - curVal;

				if (timeLeft > 0) {
					var newVal = curVal + distance * frameTime / timeLeft;
					$.Msg(newVal);
					anim.target.style[property] = pxProp ? newVal + 'px;' : newVal + ";";
				} else {
					anim.target.style[property] = pxProp ? goalVal + 'px;' : goalVal + ";";
				}
			}

			//If the animation has ended, remove it
			if (timeLeft <= 0) {
				Phase.animations.splice( i, 1 );
			} else {
				i++;
			}
		}
	}

	//See if we continue or not
	if ( Phase.animations.length > 0 ) {
		Phase.previousTick = Game.GetGameTime();
		$.Schedule( 0.03, Phase.UpdateLoop );
	} else {
		Phase.aniLoopRunning = false;
	}
}

/* Animate
 * Animate an element.
 * Parameters:
 * 		element {object} 	- The element to animate.
 *		duration {int} 		- The animation duration in ms.
 *		properties {object} - An object containing the goal for each property to animate.
 *		easing {function}	- The easing function to use.
 */
Phase.Animate = function( element, duration, properties, easing ) {
	//Check if properties are set
	for (property in properties) {
		if (element.style[property] == null) {
			element.style[property] = Phase.DEF_VAL[property];
		}
	}

	Phase.animations.push({ 
		target: element, 
		goal: properties,
		endTime: Game.GetGameTime() + duration/1000, 
		ease: easing
	});

	//Start the loop
	if (!Phase.aniLoopRunning) {
		Phase.aniLoopRunning = true;
		Phase.previousTick = Game.GetGameTime();
		Phase.UpdateLoop();
	}
};

/* Phase utility functions
=========================================================================================*/

/* DeepPrint
 * Print all object properties iteratively.
 *
 * Parameters:
 * 		object {object} - The object to print
 */
Phase.DeepPrint = function( object, indent, name ) {

	indent = typeof indent === 'undefined' ? 0 : indent;

	switch(typeof object) {
		case 'undefined':
			$.Msg( Array(indent + 1).join("\t") + 'undefined' );
			break;
		case 'object':

			var openingString = typeof name === 'undefined' ? "{" : name + " : {";
			$.Msg( Array( indent + 1 ).join( "\t" ) + openingString );

			for ( var key in object ) {
				if ( typeof object[key] === 'object' ) {
					Phase.DeepPrint( object[key], indent + 1, key );
				} else {
					$.Msg( Array(indent + 2).join("\t") + key + " : " + object[key] );
				}
			}

			$.Msg( Array(indent + 1).join("\t") + "}" );
			break;
		default:
			$.Msg( object );
			break;
	}
};