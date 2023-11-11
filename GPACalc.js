if (window.location.href.includes("home.html")) {
  $(document).ready(function () {
    var grades1 = [],
      grades2 = [],
      grades3 = [],
      grades4 = [],
      grades5 = [],
      grades6 = [],
      grades7 = [],
      grades8 = [],
      grades9 = [];
    var quarters = 0;

    var rows = $("#quickLookup").find("tr[id^='ccid']");
    var calcGradeW = [""];
    var calcGradeU = [""];

    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }
    // On page load, set checkbox according to cookie
    var checkboxState = getCookie("checkboxState");
    if (checkboxState === "true") {
      $(".sort").prop("checked", true);
    } else {
      $(".sort").prop("checked", false);
    }

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

    quarters = periodTypes.reduce(
      (count, type) => (periodRow.indexOf(type) > -1 ? count + 1 : count),
      0
    );

    var gradeArrays = [
      grades1,
      grades2,
      grades3,
      grades4,
      grades5,
      grades6,
      grades7,
      grades8,
      grades9,
    ];
    var table_location = 12;

    for (var i = 0; i < quarters; i++) {
      let currentArray = gradeArrays[i];
      rows.each(function () {
        var text = $(this).find(`td:eq('${table_location}')`).text();
        currentArray.push(text);
      });
      table_location++;
    }

    honors = 0;
    ap = 0;

    function getGpa(gradeArray, level) {
      const gradeMapping = [
        [96.5, "A+", 4.33],
        [92.5, "A", 4.0],
        [89.5, "A-", 3.67],
        [86.5, "B+", 3.33],
        [82.5, "B", 3.0],
        [79.5, "B-", 2.67],
        [76.5, "C+", 2.33],
        [73.5, "C", 2.0],
        [69.5, "C-", 1.67],
        [66.5, "D+", 1.33],
        [63.5, "D", 1.0],
        [59.5, "D-", 0.67],
      ];

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
        default:
          console.log("Invalid value of gradeArray!");
      }

      if (gradeArray[gradeArray.length - 1] < 0) return 0;

      var total = 0, validGPAs = 0;

      for (var gpa of gradeArray) {
        if(!gpa.includes("Not available") && gpa !== undefined && !gpa.includes("[ i ]") && gpa !== "NaN"){
          var gradeValue = 0;
          for (const [thresh, gradeStr, value] of gradeMapping) {
            if (gpa >= thresh || gpa.includes(gradeStr)) {
              gradeValue = value;
              break;
            }
          }
          total += gradeValue;
          validGPAs++;
        }
      }
      if(total != 0){
        total -= 0.33 // error offset, not sure why. Accounts for diff in transcript vs. official GPA
      }
      
      // not dividing GPA out of 100 by 25 or 24, somewhere between. 24.8 is the closest. 
      weightValue = (level === "H" || level === "AP") ? (honors * 0.33 + ap * 0.66) : 0;
      total += weightValue;
      return (total / validGPAs).toFixed(2);
    }

    let theString = "";
    let qweight;

    for (let i = 1; i <= quarters; i++) {
      const currentGPA = String(getGpa(i, 0));

      if ([1, 2, 3, 5, 6, 7].includes(i)) {
        calcGradeU.push(currentGPA);
      }

      if (currentGPA !== "NaN" && currentGPA !== "Infinity") {
        theString += `<th id='gpa${i}'>${currentGPA}</th>`;
      } else {
        theString += `<th id='gpa${i}'>N/A</th>`;
      }
    }
    calcGradeU = calcGradeU.filter(
      (g) => !["NaN", "Infinity", "undefined", ""].includes(g)
    );

    const glenU = calcGradeU.length;
    switch (glenU) {
      case 6:
        qweight = [0.2, 0.2, 0.1, 0.2, 0.2, 0.1]; // custom
        break;
      case 5:
        qweight = [0.22, 0.22, 0.12, 0.22, 0.22];
        break;
      case 4:
        qweight = [0.285, 0.285, 0.142, 0.285];
        break;
      case 3:
        qweight = [0.4, 0.4, 0.2];
        break;
      case 2:
        qweight = [0.5, 0.5];
        break;
      case 1:
        qweight = [1];
        break;
      default:
        console.log("Invalid value of glenU!");
    }
    const sum = calcGradeU.reduce(
      (acc, val, idx) => acc + parseFloat(val) * qweight[idx],
      0
    );

    let avg = sum > 5 ? 5 : sum;
    avg = avg.toFixed(2);

    $("th:contains('Absences')").remove();
    $("th:contains('Tardies')").remove();

    var content = $(
      "#quickLookup > table:nth-child(4) > tbody > tr:nth-child(1) > td"
    ).text();
    var numbers = content.match(/\d+(\.\d+)?/g);
    // numbers[0] is 1 (from 'F1')
    var firstNumber = parseFloat(numbers[1]);
    var secondNumber = parseFloat(numbers[2]);
    $("table:contains('Current Cumulative Transcript GPA')").remove();

    $("th:contains('F1')").after(
      '<th rowspan="2" colspan="2" style="font-size: .8rem; text-align:center;">Official GPAs <div style="display:block; font-size:0.6rem; white-space:nowrap;">(updated quarterly)</div></th>'
    );
    $("tr:eq(1)").after(
      `<tr><th id='averageuw' class='right' colspan='12'>Current Year Weighted GPA: ${avg} </th>${theString}<th id='weightedOfficial'>Weighted</th><th>${secondNumber}</th></tr>`
    );
    $("tr:eq(2)").after(
      `<tr><th id='averagew' class='right' colspan='12'>Current Year Unweighted GPA: ${avg} </th>${theString}<th id='unweightedOfficial'>Unweighted</th><th>${firstNumber}</th></tr>`
    );
    $("tr:eq('3')").after(
      "<th id='checkboxOption' class='right' colspan='12'>Sort classes by AP / Honors / Regular: <input class='sort' type='checkbox' id='sort'> </th><th colspan='9'></th> <th>Absences</th><th>Tardies</th>"
    );

      // replace text from element with id attByClass with "If you like using PowerSchool GPA Calculator, please rate us on our Chrome Web Store page! and link the page where it says "Chrome Web Store page"
    var attByClass = document.createElement("a");
    attByClass.innerHTML = "Chrome Web Store page";
    attByClass.href = "https://chrome.google.com/webstore/detail/powerschool-gpa-calculato/dgfnbmfhjioifionnlcklnpfkkjjglbj?hl=en/review";
    attByClass.target = "_blank";
      document.getElementById("attByClass").innerHTML = "If you like using PowerSchool GPA Calculator, please rate us on our ";
      document.getElementById("attByClass").appendChild(attByClass);
      document.getElementById("attByClass").innerHTML += "!";

    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }

    // On page load, set checkbox according to cookie
    var checkboxState = getCookie("checkboxState");
    if (checkboxState === "true") {
      $(".sort").prop("checked", true);
    } else {
      $(".sort").prop("checked", false);
    }

    var classCount = 0;
    rows.each(function () {
      $(this)
        .find("td:eq('11')")
        .each(function () {
          classCount++;
        });
    });

    // SORT CLASSES BY AP / HONORS / REGULAR
    // Checks if the checkbox is checked on page load
    function getRowOrder(row, isSortChecked) {
      if (isSortChecked) {
        const name = row.find("td:eq(11)").text();
        const hasGrey = row.find("td.notInSession").length > 0;
        let hasGrades = false;

        row.find("td:not(.notInSession)").each(function () {
          var cellValue = $(this).text().trim();
          // if it's not the first cell (period), and it's not the name
          if (
            !(
              cellValue.includes(row.find("td:eq(0)").text().trim()) ||
              cellValue.includes(row.find("td:eq(11)").text().trim())
            )
          ) {
            if (
              cellValue.includes("A") ||
              cellValue.includes("B") ||
              cellValue.includes("C") ||
              cellValue.includes("D") ||
              cellValue.includes("E") ||
              cellValue.includes("F")
            ) {
              hasGrades = true;
              return false; // exit .each() loop
            }
          }
        });

        if (name.includes("AP ")) return 0;
        if (name.includes("HONORS")) return 1;
        if (!hasGrey && hasGrades) return 2;
        if (hasGrey && hasGrades) return 3;
        if (hasGrey) return 4;

        return 5;
      } else {
        return row.find("td:eq(0)").text().charAt(1);
      }
    }

    if ($(".sort").is(":checked")) {
      var sortedRows = [];
      for (var i = 3; i <= classCount + 3; i++) {
        var row = $("tr:eq(" + (i + 1) + ")");
        var order = getRowOrder(row, true); // Using getRowOrder
        sortedRows.push({ row: row, order: order });
      }
      sortedRows.sort((a, b) => a.order - b.order);
      // replace all rows after row 5 with sorted rows
      for (var i = 0; i < sortedRows.length; i++) {
        $("tr:eq(" + (i + 5) + ")").after(sortedRows[i].row);
      }
    } else {
      var sortedRows = [];
      for (var i = 3; i <= classCount + 3; i++) {
        var row = $("tr:eq(" + (i + 1) + ")");
        var period = row.find("td:eq(0)").text();
        var periodNum = period.charAt(1);
        sortedRows.push({ row: row, order: periodNum });
      }
      sortedRows.sort((a, b) => a.order - b.order);
      for (var i = 0; i < sortedRows.length; i++) {
        $("tr:eq(" + (i + 5) + ")").after(sortedRows[i].row);
      }
    }

    $(".sort").change(function () {
      var classCount = 0;
      rows.each(function () {
        $(this)
          .find("td:eq('11')")
          .each(function () {
            classCount++;
          });
      });
      var isSortChecked = this.checked;
      document.cookie = "checkboxState=" + isSortChecked + "; path=/";
      var sortedRows = [];
      for (var i = 3; i <= classCount + 3; i++) {
        var row = $("tr:eq(" + (i + 1) + ")");
        var order = getRowOrder(row, isSortChecked); // Using getRowOrder
        sortedRows.push({ row: row, order: order });
      }
      sortedRows.sort((a, b) => a.order - b.order);
      for (var i = 0; i < sortedRows.length; i++) {
        $("tr:eq(" + (i + 5) + ")").after(sortedRows[i].row);
      }
    });

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
          $(this).append("<label for='A" + c + "'>AΡ </label>"); // intentional Unicode char 03A1 to not get mixed up when sorting classes
        });
    });

    $(".weighHonors").change(function () {
      calcGradeW = [""];
      var idNum = $(this).attr("id").slice(-1);
      if ($(this).is(":checked")) {
        $("#A" + idNum).attr("disabled", true);
        honors += 1;
        for (var i = 1; i <= quarters; i++) {
          if (i == 1 || i == 2 || i == 3 || i == 5 || i == 6 || i == 7) {
            // custom
            calcGradeW.push(String(getGpa(i, "H")));
          }
          if (getGpa(i, "H") != "NaN" && getGpa(i, "H") != "Infinity") {
            $("#gpa" + i).text(getGpa(i, "H"));
          } else {
            $("#gpa" + i).text("N/A");
          }
        }
        for (var i = 0; i < calcGradeW.length; i++) {
          if (
            calcGradeW[i] == "NaN" ||
            calcGradeW[i] == "Infinity" ||
            calcGradeW[i] == "undefined" ||
            calcGradeW[i] == ""
          ) {
            calcGradeW.splice(i, 1);
            i--;
          }
        }
        var sum = 0;
        var glenW = calcGradeW.length;

        switch (glenW) {
          case 6:
            qweight = [0.2, 0.2, 0.1, 0.2, 0.2, 0.1];
            break;
          case 5:
            qweight = [0.22, 0.22, 0.12, 0.22, 0.22];
            break;
          case 4:
            qweight = [0.285, 0.285, 0.142, 0.285];
            break;
          case 3:
            qweight = [0.4, 0.4, 0.2];
            break;
          case 2:
            qweight = [0.5, 0.5];
            break;
          case 1:
            qweight = [1];
            break;
          default:
            console.log("Invalid value of glenW!");
        }
        for (var i = 0; i < glenW; i++) {
          sum += parseFloat(calcGradeW[i] * qweight[i]);
        }
        var avg = sum;
        if (avg > 5) avg = 5;
        avg = avg.toFixed(2);
        $("#averageuw").text("Current Year Weighted GPA: " + avg);
      } else {
        $("#A" + idNum).attr("disabled", false);
        honors -= 1;
        for (var i = 1; i <= quarters; i++) {
          if (i == 1 || i == 2 || i == 3 || i == 5 || i == 6 || i == 7) {
            // custom
            calcGradeW.push(String(getGpa(i, "H")));
          }
          if (getGpa(i, "H") != "NaN" && getGpa(i, "H") != "Infinity") {
            $("#gpa" + i).text(getGpa(i, "H"));
          } else {
            $("#gpa" + i).text("N/A");
          }
        }
        for (var i = 0; i < calcGradeW.length; i++) {
          if (
            calcGradeW[i] == "NaN" ||
            calcGradeW[i] == "Infinity" ||
            calcGradeW[i] == "undefined" ||
            calcGradeW[i] == ""
          ) {
            calcGradeW.splice(i, 1);
            i--;
          }
        }
        var sum = 0;
        var glenW = calcGradeW.length;
        switch (glenW) {
          case 6:
            qweight = [0.2, 0.2, 0.1, 0.2, 0.2, 0.1];
            break;
          case 5:
            qweight = [0.22, 0.22, 0.12, 0.22, 0.22];
            break;
          case 4:
            qweight = [0.285, 0.285, 0.142, 0.285];
            break;
          case 3:
            qweight = [0.4, 0.4, 0.2];
            break;
          case 2:
            qweight = [0.5, 0.5];
            break;
          case 1:
            qweight = [1];
            break;
          default:
            console.log("Invalid value of glenW!");
        }
        for (var i = 0; i < glenW; i++) {
          sum += parseFloat(calcGradeW[i] * qweight[i]);
        }
        var avg = sum;
        if (avg > 5) avg = 5;
        avg = avg.toFixed(2);
        $("#averageuw").text("Current Year Weighted GPA: " + avg);
      }
    });

    $(".weighAP").change(function () {
      calcGradeW = [""];
      var idNum = $(this).attr("id").slice(-1);
      if ($(this).is(":checked")) {
        $("#H" + idNum).attr("disabled", true);
        ap += 1;
        for (var i = 1; i <= quarters; i++) {
          if (i == 1 || i == 2 || i == 3 || i == 5 || i == 6 || i == 7) {
            // custom
            calcGradeW.push(String(getGpa(i, "AP")));
          }
          if (getGpa(i, "AP") != "NaN" && getGpa(i, "AP") != "Infinity") {
            $("#gpa" + i).text(getGpa(i, "AP"));
          } else {
            $("#gpa" + i).text("N/A");
          }
        }
        for (var i = 0; i < calcGradeW.length; i++) {
          if (
            calcGradeW[i] == "NaN" ||
            calcGradeW[i] == "Infinity" ||
            calcGradeW[i] == "undefined" ||
            calcGradeW[i] == ""
          ) {
            calcGradeW.splice(i, 1);
            i--;
          }
        }
        var sum = 0;
        var glenW = calcGradeW.length;

        switch (glenW) {
          case 6:
            qweight = [0.2, 0.2, 0.1, 0.2, 0.2, 0.1];
            break;
          case 5:
            qweight = [0.22, 0.22, 0.12, 0.22, 0.22];
            break;
          case 4:
            qweight = [0.285, 0.285, 0.142, 0.285];
            break;
          case 3:
            qweight = [0.4, 0.4, 0.2];
            break;
          case 2:
            qweight = [0.5, 0.5];
            break;
          case 1:
            qweight = [1];
            break;
          default:
            console.log("Invalid value of glenW!");
        }
        for (var i = 0; i < glenW; i++) {
          sum += parseFloat(calcGradeW[i] * qweight[i]);
        }
        var avg = sum;
        if (avg > 5) avg = 5;
        avg = avg.toFixed(2);
        $("#averageuw").text("Current Year Weighted GPA: " + avg);
      } else {
        $("#H" + idNum).attr("disabled", false);
        ap -= 1;
        for (var i = 1; i <= quarters; i++) {
          if (i == 1 || i == 2 || i == 3 || i == 5 || i == 6 || i == 7) {
            // custom
            calcGradeW.push(String(getGpa(i, "AP")));
          }
          if (getGpa(i, "AP") != "NaN" && getGpa(i, "AP") != "Infinity") {
            $("#gpa" + i).text(getGpa(i, "AP"));
          } else {
            $("#gpa" + i).text("N/A");
          }
        }
        for (var i = 0; i < calcGradeW.length; i++) {
          if (
            calcGradeW[i] == "NaN" ||
            calcGradeW[i] == "Infinity" ||
            calcGradeW[i] == "undefined" ||
            calcGradeW[i] == ""
          ) {
            calcGradeW.splice(i, 1);
            i--;
          }
        }
        var sum = 0;
        var glenW = calcGradeW.length;

        switch (glenW) {
          case 6:
            qweight = [0.2, 0.2, 0.1, 0.2, 0.2, 0.1];
            break;
          case 5:
            qweight = [0.22, 0.22, 0.12, 0.22, 0.22];
            break;
          case 4:
            qweight = [0.285, 0.285, 0.142, 0.285];
            break;
          case 3:
            qweight = [0.4, 0.4, 0.2];
            break;
          case 2:
            qweight = [0.5, 0.5];
            break;
          case 1:
            qweight = [1];
            break;
          default:
            console.log("Invalid value of glenW!");
        }
        for (var i = 0; i < glenW; i++) {
          sum += parseFloat(calcGradeW[i] * qweight[i]);
        }
        var avg = sum;
        if (avg > 5) avg = 5;
        avg = avg.toFixed(2);
        $("#averageuw").text("Current Year Weighted GPA: " + avg);
      }
      // }
    });
  });
}
