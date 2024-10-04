let localstoragedata = '';
async function login(event){
    event.preventDefault();
    let email = document.getElementById('email').value;
    console.log("email : ",email);

    let password = document.getElementById('password').value;
    console.log("password : ",password)

    let Datas = {
        email,
        password,
    }

    let str_Datas = JSON.stringify(Datas);
    console.log("str_Datas: ", str_Datas);

    try {
        let response = await fetch('/login', {
            method: 'post',
            headers: {
                'Content-Type': "application/json"
            },
            body: str_Datas,
        });
        console.log("response : ", response);

        let parsed_response = await response.json();
        console.log("parsed_response : ", parsed_response);

        let token_data = parsed_response.data.token;
        console.log("token_data : ",token_data);

        let id = parsed_response.data. token_id;
        console.log("id : ",id)

        localStorage.setItem(localstoragedata, token_data); 
        console.log("Token stored successfully.");

        if (parsed_response.data.user_types === 'Admin') {
            alert("Admin login Successfull");
            window.location.href = `admin.html`
            return;
        } else if(parsed_response.data.user_types === 'Employee') {
            alert("Employee login Successfull");
            window.location.href = `employee.html?id=${id}`
            return;
        }
        else{
            alert("Something went wrong"); 
        }        

    } catch (error) {
        console.log("error : ,error")
    }
}

async function AddUser(event){
    event.preventDefault();

    let name = document.getElementById('name').value;
    console.log("name : ",name)

    let email = document.getElementById('email').value;
    console.log("email : ",email);

    let password = document.getElementById('password').value;
    console.log("password : ",password);

    let userType = document.getElementById('userType').value; 
    console.log("userType:", userType);

    let add_data = {
        name,
        email,
        password,
        userType
    }

    let str_add_data = JSON.stringify(add_data);

    let getstoragedata = localStorage.getItem(localstoragedata);
    console.log("getstoragedata:", getstoragedata);

    try {
        let response = await fetch('/users',{
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${getstoragedata}`
            },
            body: str_add_data,
        })
        console.log("response : ", response);

        let parsed_response = await response.json();
        console.log("parsed_response : ", parsed_response);

        if(parsed_response){
            alert("user added successfully");
             window.location.href = `admin.html`
            return;
        }else{
            alert("user not added");
            return;
        }

       

    } catch (error) {
        console.log("error : ",error)
    }

}

async function getusers() {

    let getstoragedata = localStorage.getItem(localstoragedata);
    console.log("getstoragedata:", getstoragedata);
    
    let response = await fetch('/users',{
        method: 'GET',
        headers: {
            'Content-Type': "application/json",
            'Authorization' : `Bearer ${getstoragedata}`
        },
    })

    let parsed_response = await response.json();
    console.log("parsed_response : ", parsed_response);

    let data = parsed_response.data;
    console.log('data : ',data);

    let admindatacontainer = document.getElementById("admindatacontainer");
    let rows = ''

    for (i = 0; i < data.length; i++) {
        let id = data[i]._id;
        rows = rows + `
          <div class="container lh-lg pb-3  shadow-none p-3 mb-5 rounded-pill" style="background-color: rgb(248, 68, 100);"
    >
    <div class="row d-flex justify-content-center align-items-center">
        <div class="col text-center" onclick="handleClick('${id}')"><img src="${data[i].image}" class="adminDatacontainerimg"></div>
        <div class="col text-center text-light" style="font-size: 18px; font-weight: 700;">
            ${data[i].name}
        </div>

        <div class="col fs-5 fw-bold text-center text-light" style="font-size: 18px; font-weight: 700;">
            ${data[i].email}
        </div>

        <div class="col "><button class="ps-2 pe-2 fs-5 editbtn" onclick="handleClickEdit('${id}')">Edit</button></div>
        <div class="col text-center"><img src="./images/icons8-delete-30.png" alt="deleteimg" id="deleteimg"
                onclick="handleClickDelete('${id}')"></div>
    </div>
</div>
        `
    }

    admindatacontainer.innerHTML = rows;

}

async function UserSingleData() {
    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let getstoragedata = localStorage.getItem(localstoragedata);
    console.log("getstoragedata:", getstoragedata);

    let id = urlParams.get("id");
    console.log("id ", id, typeof (id));

    try {
        let response = await fetch(`/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${getstoragedata}`
            },
        });
        console.log("response : ", response);

        let parsed_response = await response.json();
        console.log("parsed_response : ", parsed_response);

        let data = parsed_response.data;
        console.log("data : ", data);

        let singleusercontainer = document.getElementById('singleusercontainer')

        let rows = ''; 

        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);

            rows += `
                 <div class="container">
        <div class="row d-flex justify-content-center align-items-center">
            <div class="col text-center"><img src="${data[i].image}" class="singleusercontainer"></div>
            <div class="col text-center text-dark" style="font-size: 18px; font-weight: 700;">
                ${data[i].name}
            </div>
    
            <div class="col fs-5 fw-bold text-center text-dark" style="font-size: 18px; font-weight: 700;">
                ${data[i].email}
            </div>
    </div>
            `;
        }
        
        document.getElementById('singleusercontainer').innerHTML = rows;

    } catch (error) {
        console.log("error : ", error);
    }
}

function handleClick(id) {
    window.location.href = `userSingleView.html?id=${id}`
}

async function employeesingle() {

    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let id = urlParams.get("id");
    console.log("id ", id, typeof (id));

    let getstoragedata = localStorage.getItem(localstoragedata);
    console.log("getstoragedata:", getstoragedata);

    try {

        let response = await fetch(`/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${getstoragedata}`
            },
        });
        console.log("response : ", response);

        let parsed_response = await response.json();
        console.log("parsed_response : ", parsed_response);

        let data = parsed_response.data;
        console.log("data : ", data);

        let employeedatacontainer = document.getElementById('employeedatacontainer')

        let rows = ''; // Initialize rows outside the loop

        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);

            rows += `
                 <div class="container">
        <div class="row d-flex justify-content-center align-items-center">
            <div class="col text-center"><img src="${data[i].image}" class="singleusercontainer"></div>
            <div class="col text-center text-dark" style="font-size: 18px; font-weight: 700;">
                ${data[i].name}
            </div>
    
            <div class="col fs-5 fw-bold text-center text-dark" style="font-size: 18px; font-weight: 700;">
                ${data[i].email}
            </div>
                    <div class="col "><button class="ps-2 pe-2 fs-5 editbtn" onclick="handleClickEdit1('${id}')">Edit</button></div>
    </div>
            `;
        }
        
        // Append all rows at once
        document.getElementById('employeedatacontainer').innerHTML = rows;

    } catch (error) {
        console.log("error : ",error);
    }
}

function handleClickEdit(id){
    window.location.href = `update.html?id=${id}`;
}

async function currentdata() {
    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id')
    console.log("id from update data", id);

    let getstoragedata = localStorage.getItem(localstoragedata);
    console.log("getstoragedata:", getstoragedata);

    let name = document.getElementById('name');
    let email = document.getElementById('email')
    let userType = document.getElementById('userType'); 

    try {
        let form_response = await fetch(`/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${getstoragedata}`
            },
        });
        let form_parse_data = await form_response.json();
        console.log(" form_parse_data: ",form_parse_data)

        let data = form_parse_data.data
        console.log("data : ",data)

        name.value = data[0].name
        email.value = data[0].email
        userType.value = data[0].userType
    } catch (error) {
        image
        console.log("error : ", error)
    }
   
}

// async function currentdata1() {
//     let params = new URLSearchParams(window.location.search);
//     console.log("params", params);

//     let id = params.get('id')
//     console.log("id from update data", id);

//     let getstoragedata = localStorage.getItem(localstoragedata);
//     console.log("getstoragedata:", getstoragedata);

//     let name = document.getElementById('name');
//     let email = document.getElementById('email')
//     let userType = document.getElementById('userType'); 

//     try {
//         let form_response = await fetch(`/users/${id}`,{
//             method: 'GET',
//             headers: {
//                 'Content-Type': "application/json",
//                 'Authorization' : `Bearer ${getstoragedata}`
//             },
//         });
//         let form_parse_data = await form_response.json();
//         console.log(" form_parse_data: ",form_parse_data)

//         let data = form_parse_data.data
//         console.log("data : ",data)

//         name.value = data[0].name
//         email.value = data[0].email
//         userType.value = data[0].userType
//     } catch (error) {
//         image
//         console.log("error : ", error)
//     }
   
// }

async function updateUser(event) {
    event.preventDefault()

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let userType = document.getElementById('userType').value 

    let UpdateDatas = {
        name,
        email,
        userType,
        
    }
    let Str_UpdateData = JSON.stringify(UpdateDatas);
    console.log("Str_UpdateData", Str_UpdateData);

    let getstoragedata = localStorage.getItem(localstoragedata);
    console.log("getstoragedata:", getstoragedata);

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id')
    console.log("id from update data", id);


    try {
        let Update_response = await fetch(`/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${getstoragedata}`
            },
            body: Str_UpdateData

        })
        let parsed_Update_response = await Update_response.json();
        console.log('parsed_Update_response', parsed_Update_response);

        window.location.href = `admin.html?id=${id}`

        if (parsed_Update_response) {
            alert("Data Updated Successfully")
        }

    } catch (error) {
        console.log("error", error);
    }
}

async function handleClickDelete(id) {

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let getstoragedata = localStorage.getItem(localstoragedata);
    console.log("getstoragedata:", getstoragedata);

    try {
        let Delete_response = await fetch(`/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${getstoragedata}`
            },
        })
        let parsed_Delete_response = await Delete_response.json();
        console.log("parsed_response : ", parsed_Delete_response);

        window.location.href = `admin.html?id=${id}`

        if(parsed_Delete_response){
            alert("Book Deleted Successfully")
        }else{
            alert("Book Not Deleted")
        }
    } catch (error) {
        console.log("error : ", error);
    }
}

function handleClickEdit1(id){
window.location.href = `employeeupdate.html?id=${id}`
}

async function updateEmployee(event) {
    event.preventDefault()

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let userType = document.getElementById('userType').value 

    let UpdateDatas = {
        name,
        email,
        userType,
        
    }
    let Str_UpdateData = JSON.stringify(UpdateDatas);
    console.log("Str_UpdateData", Str_UpdateData);

    let getstoragedata = localStorage.getItem(localstoragedata);
    console.log("getstoragedata:", getstoragedata);

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id')
    console.log("id from update data", id);


    try {
        let Update_response = await fetch(`/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${getstoragedata}`
            },
            body: Str_UpdateData

        })
        let parsed_Update_response = await Update_response.json();
        console.log('parsed_Update_response', parsed_Update_response);

        window.location.href = `employee.html?id=${id}`

        if (parsed_Update_response) {
            alert("Data Updated Successfully")
        }

    } catch (error) {
        console.log("error", error);
    }
}

