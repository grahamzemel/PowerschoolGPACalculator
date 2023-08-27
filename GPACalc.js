if((window.location.href).includes("home.html")){
$(document).ready(function () {
  var grades1 = [];
  var grades2 = [];
  var grades3 = [];
  var grades4 = [];
  var grades5 = [];
  var grades6 = [];
  var grades7 = [];
  var grades8 = [];
  var grades9 = [];
  var quarters = 0;
  var honors = 0;
  var ap = 0;

  var rows = $("#quickLookup").find("tr[id^='ccid']");

  var calcGradeW = [""];
  var calcGradeU = [""];

  var periodRow = $("table.linkDescList.grid")
    .find("tbody")
    .find("tr:nth-child(1)")
    .text();
  var periodTypes = [
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "E1",
    "E2",
    "S1",
    "S2",
    "Y1",
    "F1",
  ];

  for (var i = 0; i < periodTypes.length; i++) {
    if (periodRow.indexOf(periodTypes[i]) > -1) {
      quarters++;
    }
  }

  // start of grade table
  table_location = 12;
  for (var i = 0; i < quarters; i++) {
    rows.each(function () {
      $(this)
        .find("td:eq('" + table_location + "')")
        .each(
          // for each class
          function () {
            switch (table_location) {
              case 12:
                grades1.push($(this).text());
                break;
              case 13:
                grades2.push($(this).text());
                break;
              case 14:
                grades3.push($(this).text());
                break;
              case 15:
                grades4.push($(this).text());
                break;
              case 16:
                grades5.push($(this).text());
                break;
              case 17:
                grades6.push($(this).text());
                break;
              case 18:
                grades7.push($(this).text());
                break;
              case 19:
                grades8.push($(this).text());
                break;
              case 20:
                grades9.push($(this).text());
                break;
            }
          }
        );
    });
    table_location++;
  }

  honors = 0;
  ap = 0;
  function getGpa(gradeArray, level) {
    // make below into a switch case
    switch (gradeArray) {
      case 1:
        gradeArray = grades1;
        break;
      case 2:
        gradeArray = grades2;
        break;
      case 3:
        gradeArray = grades3;
        break;
      case 4:
        gradeArray = grades4;
        break;
      case 5:
        gradeArray = grades5;
        break;
      case 6:
        gradeArray = grades6;
        break;
      case 7:
        gradeArray = grades7;
        break;
      case 8:
        gradeArray = grades8;
        break;
      case 9:
        gradeArray = grades9;
        break;
    }

    if (gradeArray[gradeArray.length - 1] < 0) {
      return 0;
    }

    var total = 0;
    var nullGPAS = 0;
    for (var i = 0; i < gradeArray.length; i++) {
      var gpa = gradeArray[i];
      
      if (gpa == undefined) {
        break;
      }
      if (gpa.includes("A+") || gpa >= 96.5) {
        gpa = 4.33;
      } else if (gpa.includes("A-") || gpa >= 89.5) {
        gpa = 3.66;
      } else if (gpa.includes("A") || gpa >= 92.5) {
        gpa = 4.0;
      } else if (gpa.includes("B+") || gpa >= 86.5) {
        gpa = 3.33;
      } else if (gpa.includes("B-") || gpa >= 79.5) {
        gpa = 2.66;
      } else if (gpa.includes("B") || gpa >= 82.5) {
        gpa = 3.0;
      } else if (gpa.includes("C+") || gpa >= 76.5) {
        gpa = 2.33;
      } else if (gpa.includes("C-") || gpa >= 69.5) {
        gpa = 1.66;
      } else if (gpa.includes("C") || gpa >= 73.5) {
        gpa = 2.0;
      } else if (gpa.includes("D+") || gpa >= 66.5) {
        gpa = 1.33;
      } else if (gpa.includes("D-") || gpa >= 59.5) {
        gpa = 0.66;
      } else if (gpa.includes("D") || gpa >= 63.5) {
        gpa = 1.0;
      } else if (gpa.includes("F") || (gpa <= 59.5 && gpa >= 1)) {
        gpa = 0.0;
      } else {
        gpa = 0;
        nullGPAS++;
      }
      total += gpa;
    }
    if (level == "H" || level == "AP") {
      var addHonors = honors * 0.33;
      var addAP = ap * .66;
      // console.log("Honors:" + addHonors +" AP: "+ addAP)
      total += addHonors + addAP; 
      // console.log(total)
    }
    total /= gradeArray.length - nullGPAS;
    if(total > 5) total = 5;
    return total.toFixed(2);
  }

  var theString = "";
  
  for (var i = 1; i <= quarters; i++) {
    if(i == 1 || i == 2 || i == 3 || i == 5 || i == 6 || i == 7){ // custom
      calcGradeU.push(String(getGpa(i, 0, 0)));
    }
    if(getGpa(i, 0, 0) != "NaN" && getGpa(i, 0, 0) != "Infinity"){
      theString += "<th id='gpa" + i + "'>" + getGpa(i, 0, 0) + "</th>";
    }
    else{
      theString += "<th id='gpa" + i + "'>N/A</th>";
    }
  }

  for(var i = 0; i < calcGradeU.length; i++){
    if(calcGradeU[i] == "NaN" || calcGradeU[i] == "Infinity" || calcGradeU[i] == "undefined" || calcGradeU[i] == ""){
      calcGradeU.splice(i, 1);
    }
  }

  var sum = 0;
  var qweight = [0.2, 0.2, 0.1, 0.2, 0.2, 0.1]; // custom
  var glenU = calcGradeU.length;

  if(glenU == 6){
    for(var i = 0; i<glenU; i++){
      sum += parseFloat(calcGradeU[i] * (qweight[i]));
    }
  }
  if(glenU == 5){
    qweight = [0.22, 0.22, 0.12, 0.22, 0.22];
    for(var i = 0; i<glenU; i++){
      sum += parseFloat(calcGradeU[i] * (qweight[i]));
    }
  }
  if(glenU == 4){
    qweight = [0.285, 0.285, 0.142, 0.285];
    for(var i = 0; i<glenU; i++){
      sum += parseFloat(calcGradeU[i] * (qweight[i]));
    }
  }
  if(glenU == 3){
    qweight = [0.4, 0.4, 0.2];
    for(var i = 0; i<glenU; i++){
      sum += parseFloat(calcGradeU[i] * (qweight[i]));
    }
  }
  if(glenU == 2){
    qweight = [0.5, 0.5];
    for(var i = 0; i<glenU; i++){
      sum += parseFloat(calcGradeU[i] * (qweight[i]));
    }
  }
  if(glenU == 1){
    qweight = [1];
    for(var i = 0; i<glenU; i++){
      sum += parseFloat(calcGradeU[i] * (qweight[i]));
    }
  }
  var avg = sum;
  if(avg > 5) avg = 5;
  avg = avg.toFixed(2);

  $("tr:eq('1')").after(
    "<tr><th id='averageuw' class='right' colspan='12'>Weighted GPA: " + avg + " </th>" +
      theString +
      "</tr>"
  );
  $("tr:eq('2')").after(
    "<tr><th id='averagew' class='right' colspan='12'>Unweighted GPA: " + avg + " </th>" +
      theString +
      "</tr>"
  );

  rows.each(function (c) {
    $(this)
      .find("td:eq('11')")
      .each(function () {
        $(this).append(
          "<br><input class='weighHonors' type='checkbox' id='H" + c + "'>"
        );
        $(this).append("<label for='H" + c + "'>H </label>");
        $(this).append(
          "<input class='weighAP' type='checkbox' id='A" + c + "'>"
        );
        $(this).append("<label for='A" + c + "'>AP </label>");
      });
  });

  $(".weighHonors").change(function () {
    calcGradeW = [""];
    var idNum = $(this).attr('id').slice(-1);
      if ($(this).is(":checked")) {
        $("#A" + idNum).attr('disabled', true);
        honors += 1;
        for (var i = 1; i <= quarters; i++) {
          if(i == 1 || i == 2 || i == 3 || i == 5 || i == 6 || i == 7){ // custom
            calcGradeW.push(String(getGpa(i, "H")));
          }
          if(getGpa(i, "H") != "NaN" && getGpa(i, "H") != "Infinity"){
            $("#gpa" + i).text(getGpa(i, "H"));
          }
          else{
            $("#gpa" + i).text("N/A");
          }
        }
        for(var i = 0; i < calcGradeW.length; i++){
          if(calcGradeW[i] == "NaN" || calcGradeW[i] == "Infinity" || calcGradeW[i] == "undefined" || calcGradeW[i] == ""){
            calcGradeW.splice(i, 1);
          }
        }
        var sum = 0;
        var qweight = [0.2, 0.2, 0.1, 0.2, 0.2, 0.1]; // custom
        var glenW = calcGradeW.length;

        if(glenW == 6){
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 5){
          qweight = [0.22, 0.22, 0.12, 0.22, 0.22];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 4){
          qweight = [0.285, 0.285, 0.142, 0.285];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 3){
          qweight = [0.4, 0.4, 0.2];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 2){
          qweight = [0.5, 0.5];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 1){
          qweight = [1];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        var avg = sum;
        if(avg > 5) avg = 5;
        avg = avg.toFixed(2);
        $("#averageuw").text("Weighted GPA: " + avg);
      } else {
        $("#A" + idNum).attr('disabled', false);
        honors -= 1;
        for (var i = 1; i <= quarters; i++) {
          if(i == 1 || i == 2 || i == 3 || i == 5 || i == 6 || i == 7){ // custom
            calcGradeW.push(String(getGpa(i, "H")));
          }
          if(getGpa(i, "H") != "NaN" && getGpa(i, "H") != "Infinity"){
            $("#gpa" + i).text(getGpa(i, "H"));
          }
          else{
            $("#gpa" + i).text("N/A");
          }
        }
        for(var i = 0; i < calcGradeW.length; i++){
          if(calcGradeW[i] == "NaN" || calcGradeW[i] == "Infinity" || calcGradeW[i] == "undefined" || calcGradeW[i] == ""){
            calcGradeW.splice(i, 1);
          }
        }
        var sum = 0;
        var qweight = [0.2, 0.2, 0.1, 0.2, 0.2, 0.1]; // custom
        var glenW = calcGradeW.length;

        if(glenW == 6){
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 5){
          qweight = [0.22, 0.22, 0.12, 0.22, 0.22];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 4){
          qweight = [0.285, 0.285, 0.142, 0.285];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 3){
          qweight = [0.4, 0.4, 0.2];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 2){
          qweight = [0.5, 0.5];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 1){
          qweight = [1];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        var avg = sum;
        if(avg > 5) avg = 5;
        avg = avg.toFixed(2);
        $("#averageuw").text("Weighted GPA: " + avg);
      }
  });

  $(".weighAP").change(function () {
    calcGradeW = [""];
    var idNum = $(this).attr('id').slice(-1);
      if ($(this).is(":checked")) {
        $("#H" + idNum).attr('disabled', true);
        ap += 1;
        for (var i = 1; i <= quarters; i++) {
          if(i == 1 || i == 2 || i == 3 || i == 5 || i == 6 || i == 7){ // custom
            calcGradeW.push(String(getGpa(i, "AP")));
          }
          if(getGpa(i, "AP") != "NaN" && getGpa(i, "AP") != "Infinity"){
            $("#gpa" + i).text(getGpa(i, "AP"));
          }
          else{
            $("#gpa" + i).text("N/A");
          }
        }
        for(var i = 0; i < calcGradeW.length; i++){
          if(calcGradeW[i] == "NaN" || calcGradeW[i] == "Infinity" || calcGradeW[i] == "undefined" || calcGradeW[i] == ""){
            calcGradeW.splice(i, 1);
          }
        }
        var sum = 0;
        var qweight = [0.2, 0.2, 0.1, 0.2, 0.2, 0.1]; // custom
        var glenW = calcGradeW.length;

        if(glenW == 6){
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 5){
          qweight = [0.22, 0.22, 0.12, 0.22, 0.22];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 4){
          qweight = [0.285, 0.285, 0.142, 0.285];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 3){
          qweight = [0.4, 0.4, 0.2];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 2){
          qweight = [0.5, 0.5];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 1){
          qweight = [1];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        var avg = sum;
        if(avg > 5) avg = 5;
        avg = avg.toFixed(2);
        $("#averageuw").text("Weighted GPA: " + avg);
      } else {
        $("#H" + idNum).attr('disabled', false);
        ap -= 1;
        for (var i = 1; i <= quarters; i++) {
          if(i == 1 || i == 2 || i == 3 || i == 5 || i == 6 || i == 7){ // custom
            calcGradeW.push(String(getGpa(i, "AP")));
          }
          if(getGpa(i, "AP") != "NaN" && getGpa(i, "AP") != "Infinity"){
            $("#gpa" + i).text(getGpa(i, "AP"));
          }
          else{
            $("#gpa" + i).text("N/A");
          }
        }
        for(var i = 0; i < calcGradeW.length; i++){
          if(calcGradeW[i] == "NaN" || calcGradeW[i] == "Infinity" || calcGradeW[i] == "undefined" || calcGradeW[i] == ""){
            calcGradeW.splice(i, 1);
          }
        }
        var sum = 0;
        var qweight = [0.2, 0.2, 0.1, 0.2, 0.2, 0.1]; // custom
        var glenW = calcGradeW.length;

        if(glenW == 6){
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 5){
          qweight = [0.22, 0.22, 0.12, 0.22, 0.22];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 4){
          qweight = [0.285, 0.285, 0.142, 0.285];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 3){
          qweight = [0.4, 0.4, 0.2];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 2){
          qweight = [0.5, 0.5];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        if(glenW == 1){
          qweight = [1];
          for(var i = 0; i<glenW; i++){
            sum += parseFloat(calcGradeW[i] * (qweight[i]));
          }
        }
        var avg = sum;
        if(avg > 5) avg = 5;
        avg = avg.toFixed(2);
        $("#averageuw").text("Weighted GPA: " + avg);
      }
    // }
  });
});
}