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
        [89.5, "A-", 3.66],
        [86.5, "B+", 3.33],
        [82.5, "B", 3.0],
        [79.5, "B-", 2.66],
        [76.5, "C+", 2.33],
        [73.5, "C", 2.0],
        [69.5, "C-", 1.66],
        [66.5, "D+", 1.33],
        [63.5, "D", 1.0],
        [59.5, "D-", 0.66],
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

      var total = 0,
        nullGPAS = 0;

      gradeArray = gradeArray.filter(
        (g) => g !== "[ i ]" && g !== " Not available"
      );

      for (var gpa of gradeArray) {
        if (gpa === undefined) break;
        var gradeValue = 0;
        for (const [thresh, gradeStr, value] of gradeMapping) {
          if (gpa >= thresh || gpa.includes(gradeStr)) {
            gradeValue = value;
            break;
          }
        }
        if (
          gradeValue === 0 &&
          (gpa.includes("F") || (gpa <= 59.5 && gpa >= 1))
        ) {
          gradeValue = 0.0;
        } else if (gradeValue === 0) {
          nullGPAS++;
        }
        total += gradeValue;
      }

      if ((level === "H" || level === "AP") && total !== 0) {
        total += honors * 0.33 + ap * 0.66;
      }

      total /= gradeArray.length - nullGPAS;
      if (total > 5) total = 5;

      return total.toFixed(2);
    }

    var theString = "";

    for (var i = 1; i <= quarters; i++) {
      if (i == 1 || i == 2 || i == 3 || i == 5 || i == 6 || i == 7) {
        // custom
        calcGradeU.push(String(getGpa(i, 0, 0)));
      }
      if (getGpa(i, 0, 0) != "NaN" && getGpa(i, 0, 0) != "Infinity") {
        theString += "<th id='gpa" + i + "'>" + getGpa(i, 0, 0) + "</th>";
      } else {
        theString += "<th id='gpa" + i + "'>N/A</th>";
      }
    }

    for (var i = 0; i < calcGradeU.length; i++) {
      if (
        calcGradeU[i] == "NaN" ||
        calcGradeU[i] == "Infinity" ||
        calcGradeU[i] == "undefined" ||
        calcGradeU[i] == ""
      ) {
        calcGradeU.splice(i, 1);
        i--;
      }
    }

    var sum = 0;
    var glenU = calcGradeU.length;

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
    for (var i = 0; i < glenU; i++) {
      sum += parseFloat(calcGradeU[i] * qweight[i]);
    }
    var avg = sum;
    if (avg > 5) avg = 5;
    avg = avg.toFixed(2);

    $("tr:eq('1')").after(
      "<tr><th id='averageuw' class='right' colspan='12'>Weighted GPA: " +
        avg +
        " </th>" +
        theString +
        "</tr>"
    );
    $("tr:eq('2')").after(
      "<tr><th id='averagew' class='right' colspan='12'>Unweighted GPA: " +
        avg +
        " </th>" +
        theString +
        "</tr>"
    );
    $("tr:eq('3')").after(
      "<tr><th id='averagew' class='right' colspan='12'>Sort classes by AP / Honors / Regular: " +
        "<input class='sort' type='checkbox' id='sort'> </th></tr>"
    );
    // var checkboxState = document.cookie.replace(
    //   /(?:(?:^|.*;\s*)checkboxState\s*\=\s*([^;]*).*$)|^.*$/,
    //   "$1"
    // );
    // $(".sort").prop("checked", checkboxState === "true");

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

    // Call the function manually after setting checkbox based on cookie
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

        if (hasGrey) {
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
        }

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

    if ($(".sort").is(":checked") || true) {
      const sortedRows = [];
      const isSortChecked = $(".sort").is(":checked");

      for (let i = 4; i <= classCount + 3; i++) {
        const row = $("tr:eq(" + (i + 1) + ")");
        const order = getRowOrder(row, isSortChecked);
        sortedRows.push({ row, order });
      }

      sortedRows.sort((a, b) => a.order - b.order);

      // Clear and append rows
      $("tr")
        .slice(5, classCount + 4)
        .remove();
      sortedRows.forEach((sortedRow, i) => {
        $("tr:eq(" + (i + 4) + ")").after(sortedRow.row);
      });
    }

    $(".sort").change(function () {
      document.cookie = "checkboxState=" + this.checked + "; path=/";
      const isSortChecked = this.checked;
      const sortedRows = [];

      for (let i = 4; i <= classCount + 3; i++) {
        const row = $("tr:eq(" + (i + 1) + ")");
        const order = getRowOrder(row, isSortChecked);
        sortedRows.push({ row, order });
      }

      sortedRows.sort((a, b) => a.order - b.order);

      // Clear and append rows
      $("tr")
        .slice(5, classCount + 4)
        .remove();
      sortedRows.forEach((sortedRow, i) => {
        $("tr:eq(" + (i + 4) + ")").after(sortedRow.row);
      });
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

    // HONORS WEIGHTING
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
        $("#averageuw").text("Weighted GPA: " + avg);
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
        $("#averageuw").text("Weighted GPA: " + avg);
      }
    });

    // AP WEIGHTING
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
        $("#averageuw").text("Weighted GPA: " + avg);
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
        $("#averageuw").text("Weighted GPA: " + avg);
      }
      // }
    });
  });
}
