﻿// making pretty stuff in InDesign text on circle paths// Copyright (C) 2011 Fabian "fabiantheblind" Morón Zirfas// http://www.the-moron.net// http://fabiantheblind.info// info [at] the - moron . net// This program is free software: you can redistribute it and/or modify// it under the terms of the GNU General Public License as published by// the Free Software Foundation, either version 3 of the License, or// any later version.// This program is distributed in the hope that it will be useful,// but WITHOUT ANY WARRANTY; without even the implied warranty of// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the// GNU General Public License for more details.// You should have received a copy of the GNU General Public License// along with this program.  If not, see <http://www.gnu.org/licenses/.// what is the InDesign targetengine ?// if you want to store something e.g. a value or a string// you can define a targetsession with a specific name of you choice// this session will exist until you close InDesign// use this only if you know for shure what you are doing// for example run thisscript in InDesign:/*    #targetengine "session01"    var myValue = 0;    alert(myValue);    myValue++;*///than this one;/*    #targetengine "session01"    alert(myValue);*/// InDesign will alert 0 at first as declared// the second script will alert 1// because myValue was stored by the targetengine "session1"// and got incremented at the end of script one// with now targetengine declared InDesign will create at launch his own engine// and destroy that after the script execution// this is "garbage collection"// this would be our engine// #targetengine "TypoStandard"// STEP 1 Make the content//var f = new File($.fileName);// get the name off this filevar license = new Array();// this is for having some textlicense.push(f.name+"\n");license.push("Copyright (C) 2011 Fabian \"fabiantheblind\" Morón Zirfas\n");license.push("http://www.the-moron.net\n ");license.push("http://fabiantheblind.info\n ");license.push("info [at] the - moron . net\n");license.push("This program is free software: you can redistribute it and/or modify\n");license.push("it under the terms of the GNU General Public License as published by\n");license.push("the Free Software Foundation, either version 3 of the License, or\n");license.push("any later version.\n");license.push("\n");license.push("This program is distributed in the hope that it will be useful,\n");license.push("but WITHOUT ANY WARRANTY; without even the implied warranty of\n");license.push("MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n");license.push("GNU General Public License for more details.\n");license.push("\n");license.push("You should have received a copy of the GNU General Public License");license.push("along with this program.  If not, see http://www.gnu.org/licenses/");// STEP 2 define the documentvar ps = 300; // the pagesize// create a new document with a width and a heightvar doc  = app.documents.add();	doc.documentPreferences.properties = {pageWidth : ps, pageHeight : ps}; // change the size of the pagevar font;// this will hold the font see the next functionvar fontIsThere = false;	checkFont();var p = doc.pages[0];// get the first page of that document// STEP 3 define some valuesvar bounds = ps/license.length; // this is the distance from the page sidesvar pw = doc.documentPreferences.pageWidth; // the widthvar ph = doc.documentPreferences.pageHeight; // the heightvar distFactor = 6; // the distance between the rings// STEP 4 create the circles on the pagevar ovs = new Array(); // create a new array for the ovals// lets make circles// use license.length// so we have a circle for every line of textfor(var i = 0; i < license.length; i++){		// calculate the ovals geometricBounds	// distFactor multiplied by i makes eac next circle smaller than the rest	var y1 = bounds + (i * distFactor); // from top the upper left point	var x1 = bounds + (i * distFactor); // from left  the upper left point	var y2 = ph - bounds - (i * distFactor); // from top  the lower right point	var x2 = pw - bounds - (i * distFactor); // from left  the lower right point		//create a circle and put him into the array ovs	ovs.push(p.ovals.add({geometricBounds:[y1,x1,y2,x2]}));		ovs[i].strokeWeight = 0;   // we dont want to see the circles	ovs[i].textPaths.add(); // add a textpath to the circle	// create some transformation Matricies	var rotTM = app.transformationMatrices.add({counterclockwiseRotationAngle:(i*10)+180 });// rotate (the 180 is for getting the line start upwards)		var hrShiftTM = app.transformationMatrices.add({horizontalTranslation:i* distFactor});// transform horizontal	var vrShiftTM = app.transformationMatrices.add({verticalTranslation:i* -distFactor});// transform vertical	var vrScaleTM = app.transformationMatrices.add({verticalScaleFactor:0.95});// scale vertical with the factor 0.7 makes it smaller	var hrScaleTM = app.transformationMatrices.add({horizontalScaleFactor:0.95});// scale horizontal with the factor 0.7 makes it smaller	// var shearTM = app.transformationMatrices.add({clockwiseShearAngle:45}); // shear		// now connect the path with the previous one	// this works with the second oval not the first	// also dont sclae the first circle	if(i > 0){		ovs[i].textPaths[0].previousTextFrame = ovs[i-1].textPaths[0];		ovs[i].transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.centerAnchor, vrScaleTM); 		ovs[i].transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.centerAnchor, hrScaleTM);		}// close if i > 0				// apply the Transformation Matricies		ovs[i].transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.centerAnchor, rotTM);				ovs[i].transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.centerAnchor, vrShiftTM);		ovs[i].transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.centerAnchor, hrShiftTM);//~		 ovs[i].transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.centerAnchor, shearTM );			}// close for loop i < lincense.length	// STEP 5 add the text to the circles// now add some  text to the circles// we only have to do this once. each overflow goes into the next Circle Pathovs[0].textPaths[0].contents = license.join("");// pull together the license text to one string// or you could use some placeholder text//ovs[0].textPaths[0].contents = TextFrameContents.placeholderText;// STEP 6 edit the text/** * Now comes the text editing part * we will loop thru all ovals, textpaths and words and change their size and font *  */// start a loop for all ovalsvar k = 0;while(k < ovs.length){	// start another loop for all textpaths on every oval	var j = 0;	while(j < ovs[k].textPaths.length){				// start another loop for all words on every textpath on every oval		var i = 0;		while(i < ovs[k].textPaths[j].words.length){						// this is textediting			// this scales every word down depending on the number of words on the textpath			// it is called "MAPPING VALUES INTO RANGES"			var downScaleFactor = ((13/ovs[k].textPaths[j].words.length)*i);			ovs[k].textPaths[j].words.item(i).pointSize = 23 - downScaleFactor;// could also bee--> Math.random()*10;			// if we have the font of our choice			// we use it			 if(fontIsThere == true){				ovs[k].textPaths[j].words.everyItem().appliedFont = font;				}// close if fontIsThere			i++;			}// close i loop		j++;		}//close j loop	k++;}//close k loop// and we are done// STEP 7 enjoy your artwork/** * This function checks if there is a font by creating a textframe and removing it  * it is using try chatch*/function checkFont(){	// to get the names of all fonts use the script fontCollection.jsx from the InDesign SDK	// http://www.adobe.com/devnet/indesign/sdk.html		font = "Gentium Book Basic	Regular"; // this is the font of choice	var testTF = doc.pages.item(0).textFrames.add(); // make a textframe dont worry about the size	try{		// this applies the font if it works		 testTF.lines.everyItem().appliedFont = font; 		// we remove the font in the following line		// if not the line before will cause an error and you are already in the catch block		doc.pages.item(0).textFrames.lastItem().remove();		fontIsThere = true; // so we can try to use the font variable		}catch(e){		// if the font isnt installed		// this will just remove the test textFrame		doc.pages.item(0).textFrames.lastItem().remove();		// and set this to false		fontIsThere = false;			}}