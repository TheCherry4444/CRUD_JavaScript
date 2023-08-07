
var statusToggle = document.getElementById("statusToggle");
var tableBody = document.querySelector(".table tbody");

var getData = [];

(async function setDataOnLoad() {
     try {
          const response = await axios.get("http://localhost:8000/users");


          const data = response.data;
          console.log("🚀 ~ file: user.js:16 ~ setDataOnLoad ~ data:", data);

          getData = data;
          updateTable(data);
     } catch (error) {
          console.log("🚀 ~ file: user.js:16 ~ setDataOnLoad ~ error:", error);
     }
})();


var tableData = [
     {
          label: "First Name",
          value: "first_name",
          width: "15%",
          sort: {
               enable: true,
               type: "ASC"
          },
     },
     {
          label: "Last Name",
          value: "last_name",
          width: "15%",
          sort: {
               enable: true,
               type: "ASC"
          },
     },
     {
          label: "Email",
          value: "email",
          width: "15%",
          sort: {
               enable: true,
               type: "ASC"
          },
     },
     {
          label: "Address",
          value: "address",
          width: "20%",
          sort: {
               enable: true,
               type: "ASC"
          },
     },
     {
          label: "Status",
          value: "status",
          width: "8%",
          sort: {
               enable: false,
          },
     },
     {
          label: "Action",
          value: "action",
          width: "10%",
          sort: {
               enable: false,
          },
     },
];


var addNewUserButton = document.querySelector(".add-new-user-button");
addNewUserButton.addEventListener("click", showModal);

function showModal() {

     var modal = new bootstrap.Modal(document.getElementById("addUserModal"));
     modal.show(); document.getElementById("addButton").style.display = "inline";
     document.getElementById("cancelButton").style.display = "inline";
     document.getElementById("modalHeader").innerText = "Add New User";

}



var searchBox = document.getElementById("search-box");
searchBox.addEventListener("input", performSearch);

function performSearch() {
     var searchText = searchBox.value.toLowerCase();
     var filteredData = getData.filter(function (row) {
          for (var key in row) {
               if (typeof row[key] === 'string' && row[key].toLowerCase().includes(searchText)) {
                    return true;
               }
          }
          return false;
     });

     updateTable(filteredData);
}




function generateTableHeaders() {
     var tableHeaderRow = document.getElementById("tableHeaderRow");

     tableData.forEach(function (header) {
          var th = document.createElement("th");
          th.setAttribute("scope", "col");
          th.style.width = header.width;

          var label = document.createTextNode(header.label);
          th.appendChild(label);

          if (header.sort.enable) {
               if (header.sort.type === "ASC") {
                    const ascIcon = document.createElement("o");
                    ascIcon.id = `${header.value}_${header.sort.type}`;
                    ascIcon.innerHTML = "&#8657;";
                    th.appendChild(ascIcon);

               } else {
                    const descIcon = document.createElement("o");
                    descIcon.id = `${header.value}_${header.sort.type}`;
                    descIcon.innerHTML = "&#8659;";
                    th.appendChild(descIcon);
               }


               th.addEventListener("click", function () {
                    sortTable(header);
               });
          }

          tableHeaderRow.appendChild(th);
     });
}





function generateTableRows() {


     var tableBody = document.querySelector(".table tbody");
     tableBody.innerHTML = "";

     getData.forEach(function (rowData) {
          var newRow = document.createElement("tr");
          newRow.id = rowData.id;

          tableData.forEach(function (header) {
               var cell = document.createElement("td");

               if (header.value === "action") {
                    var deleteButton = document.createElement("button");
                    deleteButton.type = "button";
                    deleteButton.className = "btn btn-danger";
                    deleteButton.textContent = "Delete";
                    deleteButton.addEventListener("click", function () {
                         deleteRow(this);
                    });
                    cell.appendChild(deleteButton);

                    var editButton = document.createElement("button");
                    editButton.type = "button";
                    editButton.className = "btn btn-success";
                    editButton.textContent = "Edit";
                    editButton.addEventListener("click", function () {
                         editRow(this);
                    });
                    cell.appendChild(editButton);
               } else {
                    cell.textContent = rowData[header.value];
               }

               newRow.appendChild(cell);
          });

          tableBody.appendChild(newRow);
     });
}




let addRow = async (event) => {
     event.preventDefault();



     var firstNames = document.getElementsByName("firstNames")[0].value;
     var lastNames = document.getElementsByName("lastNames")[0].value;
     var emails = document.getElementsByName("emails")[0].value;
     var address = document.getElementsByName("address")[0].value;
     var status = document.getElementsByName("status")[0].value;


     if (
          firstNames.trim() === "" ||
          lastNames.trim() === "" ||
          emails.trim() === ""
     ) {
          if (firstNames.trim() === "") {
               document.getElementById("firstNamesError").textContent =
                    "Please enter a first name!";
          }
          if (lastNames.trim() === "") {
               document.getElementById("lastNamesError").textContent =
                    "Please enter a last name!";
          }
          if (emails.trim() === "") {
               document.getElementById("emailsError").textContent =
                    "Please enter an email!";
          }
          return;
     } else if (firstNames.length < 3) {
          document.getElementById("firstNamesError").textContent =
               "First name should be at least 3 letters!";
          return;
     } else if (lastNames.length < 3) {
          document.getElementById("lastNamesError").textContent =
               "Last name should be at least 3 letters!";
          return;
     }

     if (address.trim() === "") {
          address = "-";
     }

     if (statusToggle.checked) {
          status = "Active";
     } else {
          status = "in-Active";
     }

     var newRow = {
          id: new Date().getTime(),
          first_name: firstNames,
          last_name: lastNames,
          email: emails,
          address: address,
          status: status,
     };

     getData.push(newRow);

     await axios.post('http://localhost:8000/users', newRow).then((response) => {
          event.preventDefault();
          return false;

     })
          .catch(function (error) {
               console.log(error);
          });
     clearFields();

     event.preventDefault();

     return false;



}




function updateTable(filteredData) {
     var tableBody = document.querySelector(".table1 table tbody");
     tableBody.innerHTML = "";



     var data = filteredData || getData;

     data.forEach(function (rowData) {
          var newRow = document.createElement("tr");
          newRow.id = rowData.id;

          tableData.forEach(function (header) {
               var cell = document.createElement("td");

               if (header.value === "action") {
                    var deleteButton = document.createElement("button");
                    deleteButton.type = "button";
                    deleteButton.className = "btn btn-danger";
                    deleteButton.textContent = "Delete";
                    deleteButton.addEventListener("click", function () {
                         deleteRow(this);
                    });
                    cell.appendChild(deleteButton);

                    var editButton = document.createElement("button");
                    editButton.type = "button";
                    editButton.className = "btn btn-success";
                    editButton.textContent = "Edit";
                    editButton.addEventListener("click", function () {
                         editRow(this);
                    });
                    cell.appendChild(editButton);
               } else {
                    cell.textContent = rowData[header.value];
               }

               newRow.appendChild(cell);
          });

          tableBody.appendChild(newRow);
     });

     if (data.length === 0) {
          var noDataRow = document.createElement("tr");
          noDataRow.id = "noDataRow";
          var noDataCell = document.createElement("td");
          noDataCell.setAttribute("colspan", "6");
          noDataCell.textContent = "NO DATA FOUND";
          noDataCell.classList.add("centered");

          tableBody.appendChild(noDataRow.appendChild(noDataCell));
     }
}
updateTable();




function clearFields() {
     document.getElementById("formId").reset();
     document.getElementById("firstNamesError").textContent = "";
     document.getElementById("lastNamesError").textContent = "";
     document.getElementById("emailsError").textContent = "";


     tableData.forEach(function (header) {
          if (header.sort.enable) {
               var sortIcon = document.getElementById(`${header.value}_${header.sort.type}`);
               sortIcon.innerHTML = "&#8657;"; // Upward arrow
          }
     });
}

const deleteRow = async (button) => {
     var row = button.parentNode.parentNode;

     var id = row.id;

     try {
          await axios.delete(`http://localhost:8000/users/${id}`);
          getData = getData.filter(function (row) {
               return row.id !== id;
          });
          // row.parentNode.removeChild(row);
     } catch (error) {
          console.log("🚀 ~ file: user.js:16 ~ deleteRow ~ error:", error);
     }
};


var index;
var rowData;

function editRow(button) {
     var row = button.parentNode.parentNode;
     index = row.rowIndex - 1;
     rowData = getData[index];

     showModal();
     document.getElementById("modalHeader").innerText = "Edit User";




     document.getElementsByName("firstNames")[0].value = rowData.first_name;
     document.getElementsByName("lastNames")[0].value = rowData.last_name;
     document.getElementsByName("emails")[0].value = rowData.email;
     document.getElementsByName("address")[0].value = rowData.address;
     var statusToggle = document.getElementsByName("status")[0];

     if (rowData.status === "Active") {
          statusToggle.checked = true;
     } else {
          statusToggle.checked = false;
     }

     document.getElementById("saveButton").style.display = "inline";
     document.getElementById("cancelButton").style.display = "inline";

     document.getElementById("addButton").style.display = "none";

}



function saveRow() {
     var updatedFirstName = document.getElementsByName("firstNames")[0].value;
     var updatedLastName = document.getElementsByName("lastNames")[0].value;
     var updatedEmail = document.getElementsByName("emails")[0].value;
     var updatedAddress = document.getElementsByName("address")[0].value;
     var updatedstatus = document.getElementsByName("status")[0].value;

     if (
          updatedFirstName.trim() === "" ||
          updatedLastName.trim() === "" ||
          updatedEmail.trim() === ""
     ) {
          if (updatedFirstName.trim() === "") {
               document.getElementById("firstNamesError").textContent =
                    "Please enter a first name!";
          }
          if (updatedLastName.trim() === "") {
               document.getElementById("lastNamesError").textContent =
                    "Please enter a last name!";
          }
          if (updatedEmail.trim() === "") {
               document.getElementById("emailsError").textContent =
                    "Please enter an email!";
          }
          return;
     } else if (updatedFirstName.length < 3) {
          document.getElementById("firstNamesError").textContent =
               "First name should be at least 3 letters!";
          return;
     } else if (updatedLastName.length < 3) {
          document.getElementById("lastNamesError").textContent =
               "Last name should be at least 3 letters!";
          return;
     }

     if (updatedAddress.trim() === "") {
          updatedAddress = "-";
     }

     if (statusToggle.checked) {
          updatedstatus = "Active";
     } else {
          updatedstatus = "in-Active";
     }

     rowData.first_name = updatedFirstName;
     rowData.last_name = updatedLastName;
     rowData.email = updatedEmail;
     rowData.address = updatedAddress;
     rowData.status = updatedstatus;

     axios.put(`http://localhost:8000/users/${rowData.id}`, rowData)
          .then(function (response) {
               if (response.status === 200) {

                    clearFields();
                    document.getElementById("saveButton").style.display = "none";
                    document.getElementById("cancelButton").style.display = "none";
                    updateTable();
                    var myModalEl = document.getElementById("addUserModal");
                    var modal = bootstrap.Modal.getInstance(myModalEl);
                    modal.hide();
               }
          })
          .catch(function (error) {
               console.log("🚀 ~ file: user.js:16 ~ saveRow ~ error:", error);
          });


}



function cancelEdit(event) {
     event.preventDefault();


     clearFields();



     var myModalEl = document.getElementById('addUserModal');
     var modal = bootstrap.Modal.getInstance(myModalEl)
     modal.hide();

     document.getElementById("saveButton").style.display = "none";

}


const clearTableHeaders = () => {
     const list = document.getElementById("tableHeaderRow")

     while (list.hasChildNodes()) {
          list.removeChild(list.firstChild);
     }

}



function sortTable(header) {
     const sortData = JSON.parse(JSON.stringify(header));
     const { value, sort } = sortData;
     const { type } = sort;

     tableData.forEach((item) => {
          if (item.sort.enable) {
               const icon = document.getElementById(`${item.value}_${item.sort.type}`);
               if (icon) {
                    icon.innerHTML = "&#8657;";
                    item.sort.type = "ASC";
               }
          }
     });

     getData.sort((a, b) => {
          if (a[value].toLowerCase() < b[value].toLowerCase()) {
               return type === "ASC" ? -1 : 1;
          }
          if (a[value].toLowerCase() > b[value].toLowerCase()) {
               return type === "ASC" ? 1 : -1;
          }
     });

     const icon = document.getElementById(`${value}_${type}`);
     if (icon) {
          icon.innerHTML = type === "ASC" ? "&#8659;" : "&#8657;";
     }

     const tableHeaderData = JSON.parse(JSON.stringify(tableData));
     const onSortObj = tableHeaderData.find((item) => item.value === value);
     onSortObj.sort.type = type === "ASC" ? "DESC" : "ASC";

     tableData = tableHeaderData;



     clearTableHeaders();
     generateTableHeaders();
     updateTable();
}

generateTableHeaders();
generateTableRows();



