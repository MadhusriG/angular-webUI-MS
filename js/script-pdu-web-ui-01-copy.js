//functions to append each svg into the main div: START
                function svg_pduLoad(){
                     var svg_pdu = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); //create svg element
                    svg_pdu.setAttribute("viewBox","0 0 210 220");
                    svg_pdu.setAttribute("preserveAspectRatio","xMidYMid meet");
                    svg_pdu.setAttribute("version","1.1");
                    svg_pdu.setAttribute("class","pdu");
                    circuitContainer.appendChild(svg_pdu);
                    //pdu middle lines
                    var middleLineGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    middleLineGroup.setAttribute("id","pdu-middle-lines"); //Set g's id
                    svg_pdu.appendChild(middleLineGroup);
                    var middleLine1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    middleLine1.setAttribute("d","M 44.252753,135.45093 C 164.95305,133.94576 167.4503,134.69835 167.4503,134.69835 h -1.66482"); //Set path's data
                    middleLine1.setAttribute("style","fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.84947181;"); //Set path's styles
                    var middleLine2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    middleLine2.setAttribute("d","M 44.045541,139.09776 C 165.15194,137.59445 167.65759,138.3461 167.65759,138.3461 h -1.67043"); //Set path's data
                    middleLine2.setAttribute("style","fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.85249639;"); //Set path's styles
                    var pduMiddleLinesGroup = document.getElementById("pdu-middle-lines");
                    pduMiddleLinesGroup.appendChild(middleLine1);                                        pduMiddleLinesGroup.appendChild(middleLine2);
                    /***********pdu top part***********/
                    var pduTopGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    pduTopGroup.setAttribute("id","pdu-top"); //Set g's id
                    svg_pdu.appendChild(pduTopGroup);
                    //pdu top center line
                    var pduTopLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    pduTopLine.setAttribute("y","27.848412");                   
                    pduTopLine.setAttribute("x","105.15416");
                    pduTopLine.setAttribute("height","81.10318");                    pduTopLine.setAttribute("width","1.812");
                    pduTopLine.setAttribute("style","display:inline;fill:#ffffff;")
                    pduTopGroup.appendChild(pduTopLine);
                    /***********pdu top left curves***********/
                    var pduTopLeftCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    pduTopLeftCurveGroup.setAttribute("id","pdu-top-left-curve"); //Set g's id
                    svg_pdu.appendChild(pduTopLeftCurveGroup);
                    var topLeftCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topLeftCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                    topLeftCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var topLeftCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topLeftCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                    topLeftCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var topLeftCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topLeftCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                    topLeftCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    pduTopLeftCurveGroup.appendChild(topLeftCurve1);                    pduTopLeftCurveGroup.appendChild(topLeftCurve2);
                    pduTopLeftCurveGroup.appendChild(topLeftCurve3);
                    /***********pdu top right curves***********/
                    var pduTopRightCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    pduTopRightCurveGroup.setAttribute("id","pdu-top-right-curve"); //Set g's id
                    pduTopRightCurveGroup.setAttribute("transform","translate(57.466688,0.87762149)");
                    svg_pdu.appendChild(pduTopRightCurveGroup);
                    var topRightCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topRightCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                    topRightCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var topRightCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topRightCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                    topRightCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var topRightCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topRightCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                    topRightCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    pduTopRightCurveGroup.appendChild(topRightCurve1);                    pduTopRightCurveGroup.appendChild(topRightCurve2);
                    pduTopRightCurveGroup.appendChild(topRightCurve3);

                    /***********pdu bottom part***********/
                    var pduBottomGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    pduBottomGroup.setAttribute("id","pdu-bottom"); //Set g's id
                    svg_pdu.appendChild(pduBottomGroup);
                    //pdu bottom center line
                    var pduBottomLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    pduBottomLine.setAttribute("y","161.75018");                   
                    pduBottomLine.setAttribute("x","105.05904");
                    pduBottomLine.setAttribute("height","81.10318");                    pduBottomLine.setAttribute("width","1.812");
                    pduBottomLine.setAttribute("style","display:inline;fill:#ffffff;")
                    pduBottomGroup.appendChild(pduBottomLine);
                    /***********pdu bottom left curves***********/
                    var pduBottomLeftCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    pduBottomLeftCurveGroup.setAttribute("id","pdu-top-left-curve"); //Set g's id
                    pduBottomLeftCurveGroup.setAttribute("transform","rotate(180,77.216618,134.91208)");
                    svg_pdu.appendChild(pduBottomLeftCurveGroup);
                    var bottomLeftCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomLeftCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                    bottomLeftCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var bottomLeftCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomLeftCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                    bottomLeftCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var bottomLeftCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomLeftCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                    bottomLeftCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    pduBottomLeftCurveGroup.appendChild(bottomLeftCurve1);                    pduBottomLeftCurveGroup.appendChild(bottomLeftCurve2);
                    pduBottomLeftCurveGroup.appendChild(bottomLeftCurve3);
                    /***********pdu bottom right curves***********/
                    var pduBottomRightCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    pduBottomRightCurveGroup.setAttribute("id","pdu-bottom-right-curve"); //Set g's id
                    pduBottomRightCurveGroup.setAttribute("transform","rotate(180,106.04625,134.91214)");
                    svg_pdu.appendChild(pduBottomRightCurveGroup);
                    var bottomRightCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomRightCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                    bottomRightCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var bottomRightCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomRightCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                    bottomRightCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var bottomRightCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomRightCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                    bottomRightCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    pduBottomRightCurveGroup.appendChild(bottomRightCurve1);                    pduBottomRightCurveGroup.appendChild(bottomRightCurve2);
                    pduBottomRightCurveGroup.appendChild(bottomRightCurve3);
                    //voltage symbol: START
                    var pduVoltageSign = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    pduVoltageSign.setAttribute("d","m 61.232141,60.764882 -9.378412,0.122962 4.582717,-8.183423 z");
                    pduVoltageSign.setAttribute("style","opacity:1;fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.61626506;");
                    pduVoltageSign.setAttribute("transform","matrix(1.0118631,0,0,1.2312215,-26.963536,47.692866)");
                    svg_pdu.appendChild(pduVoltageSign);
                    //voltage symbol : END
                    //letter Y : START
                    var pduYLetter = document.createElementNS("http://www.w3.org/2000/svg",'text');
                    pduYLetter.setAttribute("style","font-size:16px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;");
                    pduYLetter.setAttribute("transform","scale(1.0028955,0.99711289)");
                    pduYLetter.setAttribute("x",'25.997938');
                    pduYLetter.setAttribute("y",'163.35176');
                    svg_pdu.appendChild(pduYLetter);
                    var pduYLetterText = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
                    pduYLetterText.setAttribute("id",'pduLabelText');
                    pduYLetter.appendChild(pduYLetterText);
                    pduLabelText.textContent = "Y";
                    pduYLetterText.setAttribute("style","fill:#ffffff;fill-opacity:1;stroke-width:0.40014985");
                    //letter Y : END
                    return svg_pdu;
                }

                function svg_bcmLoad(){
                   var svgBCMWrapper = document.createElement("div");
                   svgBCMWrapper.setAttribute("class","bcmWrapper");
                   bsContainer.appendChild(svgBCMWrapper);
                   var svg_bcm = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); //create svg element
                    svg_bcm.setAttribute("viewBox","0 0 210 227");
                    svg_bcm.setAttribute("preserveAspectRatio","xMidYMid meet");
                    svg_bcm.setAttribute("version","1.1");
                    svg_bcm.setAttribute("class","bcm");
                    svgBCMWrapper.appendChild(svg_bcm);
                    //bcm top line
                    var bcmTopLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    bcmTopLine.setAttribute("y","0");                   
                    bcmTopLine.setAttribute("x","98.273804");
                    bcmTopLine.setAttribute("height","28.530001");                    bcmTopLine.setAttribute("width","1.5119047");
                    bcmTopLine.setAttribute("style","display:inline;fill:#ffffff;")
                    svg_bcm.appendChild(bcmTopLine);
                    //bcm connector
                    var bcmConnector = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bcmConnector.setAttribute("d","m 98.273694,53.388681 v -2.11646 a 9.9506448,11.831466 0 0 0 8.042116,-11.003107 l 0.0129,-0.59855 a 9.9506448,11.831466 0 0 0 -8.054916,-11.60491 v -2.112682 a 11.688061,13.919373 0 0 1 9.791936,13.717592 l -0.0146,0.704038 a 11.688061,13.919373 0 0 1 -9.777368,13.014079 z"); //Set path's data
                    bcmConnector.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    svg_bcm.appendChild(bcmConnector);
                    //bcm bottom line
                    var bcmBottomLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    bcmBottomLine.setAttribute("y","50.830109");                   
                    bcmBottomLine.setAttribute("x","98.273804");
                    bcmBottomLine.setAttribute("height","37.529999");                    bcmBottomLine.setAttribute("width","1.5119047");
                    bcmBottomLine.setAttribute("style","display:inline;fill:#ffffff;")
                    svg_bcm.appendChild(bcmBottomLine);
                    //bcm bottom box
                    /*var bcmBottomBox = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    bcmBottomBox.setAttribute("y","87.11003");                   
                    bcmBottomBox.setAttribute("x","69.61718");
                    bcmBottomBox.setAttribute("height","76.212067");                    bcmBottomBox.setAttribute("width","58.825146");
                    bcmBottomBox.setAttribute("style","fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:1.61618006;")
                    svg_bcm.appendChild(bcmBottomBox);*/
                    //bcm bottom path 
                    var bcmBottomPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bcmBottomPath.setAttribute("d","M 263.11914 514.21094 L 263.11914 802.25586 L 485.45117 802.25586 L 485.45117 514.21094 L 263.11914 514.21094 z M 268.78906 519.88086 L 479.78125 519.88086 L 479.78125 796.58789 L 268.78906 796.58789 L 268.78906 519.88086 z "); //Set path's data
                    bcmBottomPath.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    bcmBottomPath.setAttribute("transform","scale(0.26458333) translate(0,-180.87762149)");
                    //bcmBottomPath.setAttribute("transform","translate(57.466688,0.87762149)");
                    svg_bcm.appendChild(bcmBottomPath);
                    
                }

                function svg_sfcmLoad(){
                    var svgSFCMWrapper = document.createElement("div");
                   svgSFCMWrapper.setAttribute("class","sfcmWrapper");
                   bsContainer.appendChild(svgSFCMWrapper);
                    var svg_sfcm = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); //create svg element
                    svg_sfcm.setAttribute("viewBox","0 0 210 227");
                    svg_sfcm.setAttribute("preserveAspectRatio","");
                    svg_sfcm.setAttribute("version","1.1");
                    svg_sfcm.setAttribute("class","sfcm");
                    svgSFCMWrapper.appendChild(svg_sfcm);
                    //sfcm top line
                    var sfcmTopLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    sfcmTopLine.setAttribute("y","0");                   
                    sfcmTopLine.setAttribute("x","102.76402");
                    sfcmTopLine.setAttribute("height","28.530001");                    sfcmTopLine.setAttribute("width","1.5119047");
                    sfcmTopLine.setAttribute("style","fill:#ffffff;fill-opacity:1;")
                    svg_sfcm.appendChild(sfcmTopLine);
                    //sfcm connector
                    var sfcmConnector = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    sfcmConnector.setAttribute("d","m 102.76392,53.124103 v -2.11646 a 9.950645,11.831466 0 0 0 8.04212,-11.00311 l 0.0129,-0.59855 a 9.950645,11.831466 0 0 0 -8.05492,-11.60491 v -2.11268 a 11.688061,13.919373 0 0 1 9.79194,13.71759 l -0.0146,0.70404 a 11.688061,13.919373 0 0 1 -9.77737,13.01408 z"); //Set path's data
                    sfcmConnector.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    svg_sfcm.appendChild(sfcmConnector);
                    //sfcm bottom line
                    var sfcmBottomLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    sfcmBottomLine.setAttribute("y","52.449112");                   
                    sfcmBottomLine.setAttribute("x","102.76402");
                    sfcmBottomLine.setAttribute("height","101.29762");                    sfcmBottomLine.setAttribute("width","1.5119047");
                    sfcmBottomLine.setAttribute("style","display:inline;fill:#ffffff;")
                    svg_sfcm.appendChild(sfcmBottomLine);
                }
                    
                function svg_pduWithLineLoad(){
                     var svg_pduWithLine = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); //create svg element
                    svg_pduWithLine.setAttribute("viewBox","0 0 210 127");
                    svg_pduWithLine.setAttribute("preserveAspectRatio","xMidYMid meet");
                    svg_pduWithLine.setAttribute("version","1.1");
                    svg_pduWithLine.setAttribute("class","pdu");
                    pduContainer.appendChild(svg_pduWithLine);
                    //pdu middle lines
                    var pduWithLineGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    svg_pduWithLine.appendChild(pduWithLineGroup);
                    var middleLine1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    middleLine1.setAttribute("d"," M 73.424044,73.59191 C 131.79521,72.875583 133.0029,73.233743 133.0029,73.233743 h -0.80512"); //Set path's data
                    middleLine1.setAttribute("style","stroke:#ffffff;stroke-width:0.84947181;"); //Set path's styles
                    var middleLine2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    middleLine2.setAttribute("d","m 73.407244,75.819138 c 58.414266,-0.716121 59.622836,-0.358065 59.622836,-0.358065 h -0.80572"); //Set path's data
                    middleLine2.setAttribute("style","stroke:#ffffff;stroke-width:0.85249639;"); //Set path's styles
                    pduWithLineGroup.appendChild(middleLine1);                                        pduWithLineGroup.appendChild(middleLine2);
                    /***********pdu top part***********/
                    var pduTopLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    pduTopLine.setAttribute("y","23.490372");                   
                    pduTopLine.setAttribute("x","103.16511");
                    pduTopLine.setAttribute("height","37.759335");                    pduTopLine.setAttribute("width","0.99060559");
                    pduTopLine.setAttribute("style","display:inline;fill:#ffffff;")
                    pduWithLineGroup.appendChild(pduTopLine);
                    //pdu bottom center line
                    var pduBottomLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    pduBottomLine.setAttribute("y","86.88958");                   
                    pduBottomLine.setAttribute("x","102.76957");
                    pduBottomLine.setAttribute("height","37.759335");                    pduBottomLine.setAttribute("width","0.99060559");
                    pduBottomLine.setAttribute("style","display:inline;fill:#ffffff;")
                    pduWithLineGroup.appendChild(pduBottomLine);
                    /***********pdu top left curves***********/
                    var pduTopLeftCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    pduTopLeftCurveGroup.setAttribute("id","pdu-top-left-curve"); //Set g's id
                    pduTopLeftCurveGroup.setAttribute("transform","matrix(0.51306838,0,0,0.46557154,48.989756,9.9957783)");
                    svg_pduWithLine.appendChild(pduTopLeftCurveGroup);
                    var topLeftCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topLeftCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                    topLeftCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var topLeftCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topLeftCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                    topLeftCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var topLeftCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topLeftCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                    topLeftCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    pduTopLeftCurveGroup.appendChild(topLeftCurve1);                    pduTopLeftCurveGroup.appendChild(topLeftCurve2);
                    pduTopLeftCurveGroup.appendChild(topLeftCurve3);
                    /***********pdu top right curves***********/
                    var pduTopRightCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    pduTopRightCurveGroup.setAttribute("id","pdu-top-right-curve"); //Set g's id
                    pduTopRightCurveGroup.setAttribute("transform","matrix(0.49276875,0,0,0.46557154,80.046454,9.8752073)");
                    svg_pduWithLine.appendChild(pduTopRightCurveGroup);
                    var topRightCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topRightCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                    topRightCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var topRightCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topRightCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                    topRightCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var topRightCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    topRightCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                    topRightCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    pduTopRightCurveGroup.appendChild(topRightCurve1);                    pduTopRightCurveGroup.appendChild(topRightCurve2);
                    pduTopRightCurveGroup.appendChild(topRightCurve3);

                    /***********pdu bottom part***********/

                    /***********pdu bottom left curves***********/
                    var pduBottomLeftCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    pduBottomLeftCurveGroup.setAttribute("id","pdu-top-left-curve"); //Set g's id
                    pduBottomLeftCurveGroup.setAttribute("transform","matrix(-0.49953529,0,0,-0.46557154,127.53089,137.73486)");
                    svg_pduWithLine.appendChild(pduBottomLeftCurveGroup);
                    var bottomLeftCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomLeftCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                    bottomLeftCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var bottomLeftCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomLeftCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                    bottomLeftCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var bottomLeftCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomLeftCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                    bottomLeftCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    pduBottomLeftCurveGroup.appendChild(bottomLeftCurve1);                    pduBottomLeftCurveGroup.appendChild(bottomLeftCurve2);
                    pduBottomLeftCurveGroup.appendChild(bottomLeftCurve3);
                    /***********pdu bottom right curves***********/
                    var pduBottomRightCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                    pduBottomRightCurveGroup.setAttribute("id","pdu-bottom-right-curve"); //Set g's id
                    pduBottomRightCurveGroup.setAttribute("transform","matrix(-0.47698015,0,0,-0.46557154,154.02451,137.73491)");
                    svg_pduWithLine.appendChild(pduBottomRightCurveGroup);
                    var bottomRightCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomRightCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                    bottomRightCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var bottomRightCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomRightCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                    bottomRightCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    var bottomRightCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    bottomRightCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                    bottomRightCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                    pduBottomRightCurveGroup.appendChild(bottomRightCurve1);                    pduBottomRightCurveGroup.appendChild(bottomRightCurve2);
                    pduBottomRightCurveGroup.appendChild(bottomRightCurve3);
                    //voltage and letter Y symbols: START
                    var pduVoltageSign = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    pduVoltageSign.setAttribute("id","pduVoltage");
                    pduVoltageSign.setAttribute("d","m 61.232141,60.764882 -9.378412,0.122962 4.582717,-8.183423 z");
                    pduVoltageSign.setAttribute("style","opacity:1;fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.61626506;");
                    pduVoltageSign.setAttribute("transform","matrix(0.6692784,0,0,0.82590072,27.986742,17.654586)");
                    svg_pduWithLine.appendChild(pduVoltageSign);
                    var pduYLetter = document.createElementNS("http://www.w3.org/2000/svg",'text');
                    pduYLetter.setAttribute("style","font-size:8px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;");
                    pduYLetter.setAttribute("transform","scale(0.94756847,1.0553327)");
                    pduYLetter.setAttribute("x",'66.86174');
                    pduYLetter.setAttribute("y",'84.010979');
                    svg_pduWithLine.appendChild(pduYLetter);
                    var pduYLetterText = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
                    pduYLetterText.setAttribute("id",'pduLabelText');
                    pduYLetter.appendChild(pduYLetterText);
                    pduLabelText.textContent = "Y";
                    pduYLetterText.setAttribute("style","fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.40014985");
                    //voltage and letter Y symbols: END
                    //connector line
                    var pduConnectorLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    pduConnectorLine.setAttribute("y","124.38097");                   
                    pduConnectorLine.setAttribute("x","-15.493953");
                    pduConnectorLine.setAttribute("height","0.59938949");                    pduConnectorLine.setAttribute("width","500.52371");
                    pduConnectorLine.setAttribute("style","fill:#ffffff;")
                    svg_pduWithLine.appendChild(pduConnectorLine);
                    return svg_pduWithLine;
                }
                //functions to append each svg into the main div: END