
async function login(event){
    event.preventDefault();
    let email = document.getElementById('emaillogin').value;
    console.log("email : ",email);

    let password = document.getElementById('passwordlogin').value;
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

        let tokenkey = id;

        localStorage.setItem(tokenkey, token_data); 
        console.log("Token stored successfully.");

        if (parsed_response.data.user_types === 'Admin') {
            alert("Admin login Successfull");
            window.location.href = `admin.html?login=${tokenkey}`
            return;
        } else if(parsed_response.data.user_types === 'Employee') {
            alert("Employee login Successfull");
            window.location.href = `employee.html?id=${id}&login=${tokenkey}`
            return;
        }
        else{
            alert("Something went wrong"); 
        }        

    } catch (error) {
        console.log("error : ,error")
    }
}

async function getusers() {

    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let tokenkey = urlParams.get('login');
    console.log("tokenkey : ",tokenkey)


    let token = localStorage.getItem(tokenkey)
    console.log("token : ",token)
    
    let response = await fetch('/users',{
        method: 'GET',
        headers: {
            'Content-Type': "application/json",
            'Authorization' : `Bearer ${token}`
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
          <div class="container mb-4 bg-white shadow-sm p-3 mb-5 bg-body rounded">
    
        <div class="row d-flex justify-content-center align-items-center">
            <div class="col text-center" onclick="handleClick('${id}','${tokenkey}')">
                <img src="${data[i].image}" class="adminDatacontainerimg" alt="User Image">
            </div>
            <div class="col text-center text-dark" style="font-size: 18px; font-weight: 700;">
                ${data[i].name}
            </div>
            <div class="col fs-5 fw-bold text-center text-dark" style="font-size: 18px; font-weight: 700;">
                ${data[i].email}
            </div>
            <div class="col text-center">
                <button class="editbtn" onclick="handleClickEdit('${id}','${tokenkey}')">Edit</button>
            </div>
            <div class="col text-center">
                <img src="./images/icons8-delete-30.png" alt="Delete" id="deleteimg" onclick="handleClickDelete('${id}','${tokenkey}')">
            </div>
        </div>
    
</div>
        `
    }

    admindatacontainer.innerHTML = rows;

}

function passtoken() {
    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let tokenkey = urlParams.get('login');
    console.log("tokenkey : ",tokenkey)

    window.location.href = `adduser.html?login=${tokenkey}`
}

async function AddUser(event){
    event.preventDefault();

    let image = document.getElementById('image');
    let file = image.files[0];
    console.log("file: ", file);

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    try {
        // Read both files
        const dataUrl = await readFileAsDataURL(file);
        // Submit data with both URLs
        await submitData(dataUrl);
    } catch (error) {
        console.error("Error reading files: ", error);
    }

}

async function submitData(dataUrl) {

    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let tokenkey = urlParams.get('login');
    console.log("tokenkey : ",tokenkey)

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let userType = document.getElementById('userType').value; 
    let joiningdate = document.getElementById('joiningdate').value

    let add_data = {
        name,
        email,
        password,
        userType,
        joiningdate,
        image : dataUrl
    }

    let str_add_data = JSON.stringify(add_data);

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);

    try {
        let response = await fetch('/users',{
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${token}`
            },
            body: str_add_data,
        })
        console.log("response : ", response);

        let parsed_response = await response.json();
        console.log("parsed_response : ", parsed_response);

        if(parsed_response){
            alert("user added successfully");
             window.location.href = `admin.html?login=${tokenkey}`
            return;
        }else{
            alert("user not added");
            return;
        }

       

    } catch (error) {
        console.log("error : ",error)
    }
}

function handleClick(id,tokenkey) {
    window.location.href = `userSingleView.html?id=${id}&loginid=${tokenkey}`
}

async function UserSingleData() {
    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let id = urlParams.get("id");
    console.log("id ", id, typeof (id));

    let tokenkey = urlParams.get('loginid');
    console.log("tokenkey : ",tokenkey);

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);

    try {
        let response = await fetch(`/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${token}`
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
                <div class="container ">
   <div class="row">
    <div class="col-3"></div>
    <div class="col-6 shadow-sm p-3 mb-5 bg-body rounded www" style="  background: linear-gradient(to right, white,white)">
        <div class="row d-flex flex-column justify-content-center align-items-center">
            <div class="col text-center"><img src="${data[i].image}" class="singleusercontainerimg"></div>
            <div class="col text-center text-dark mb-3 mt-3" style="font-size: 18px; font-weight: 700;">Name : 
                ${data[i].name}
            </div>
    
            <div class="col fs-5 fw-bold text-center text-dark mb-3" style="font-size: 18px; font-weight: 700;">
               Email : ${data[i].email}
            </div>
    
            <div class="col fs-5 fw-bold text-center text-dark mb-3" style="font-size: 18px; font-weight: 700;">
               Join Date : ${data[i].joiningdate}
            </div>
    </div>
    <div class="col-3"></div>
   </div>
</div>
            `;
        }
        
        document.getElementById('singleusercontainer').innerHTML = rows;

    } catch (error) {
        console.log("error : ", error);
    }
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

    let tokenkey = urlParams.get("login");
    console.log("tokenkey ", tokenkey, typeof (tokenkey));

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);

    try {

        let response = await fetch(`/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${token}`
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

                 <div class="container ">
   <div class="row">
    <div class="col-3"></div>
    <div class="col-6 shadow-sm p-3 mb-5 bg-body rounded www" style="  background: linear-gradient(to right, white,white)">
        <div class="row d-flex flex-column justify-content-center align-items-center">
            <div class="col text-center"><img src="${data[i].image}" class="singleusercontainerimg"></div>
            <div class="col text-center text-dark mb-3 mt-3" style="font-size: 18px; font-weight: 700;">Name : 
                ${data[i].name}
            </div>
    
            <div class="col fs-5 fw-bold text-center text-dark mb-3" style="font-size: 18px; font-weight: 700;">
               Email : ${data[i].email}
            </div>
    
            <div class="col fs-5 fw-bold text-center text-dark mb-3" style="font-size: 18px; font-weight: 700;">
               Join Date : ${data[i].joiningdate}
            </div>
    </div>
    <div class="col-3"></div>
   </div>
</div>             
    
            `;
        }
        
        // Append all rows at once
        document.getElementById('employeedatacontainer').innerHTML = rows;

    } catch (error) {
        console.log("error : ",error);
    }
}

function handleClickEdit(id,tokenkey){
    window.location.href = `update.html?id=${id}&login=${tokenkey}`;
}

async function currentdata() {
    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id')
    console.log("id from update data", id);

    let tokenkey = params.get('login')
    console.log("tokenkey", tokenkey);

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);

    let name = document.getElementById('name');
    let email = document.getElementById('email')
    let userType = document.getElementById('userType');
    let joiningdate = document.getElementById('joiningdate')

    try {
        let form_response = await fetch(`/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${token}`
            },
        });
        let form_parse_data = await form_response.json();
        console.log(" form_parse_data: ",form_parse_data)

        let data = form_parse_data.data
        console.log("data : ",data)

        name.value = data[0].name
        email.value = data[0].email
        userType.value = data[0].userType
        joiningdate.value = data[0].joiningdate
    } catch (error) {
        image
        console.log("error : ", error)
    }
   
}

async function updateUser(event) {
    event.preventDefault()  

    let image = document.getElementById('image');
    let file = image.files[0];

    if (!file ) {
        alert("Please select image.");
        return;
    }

    try {
        let dataUrl1 = await readFileAsDataURL(file);
        await updateData(dataUrl1);
    } catch (error) {
        console.error("Error reading files:", error);
        alert("An error occurred while reading the files. Please try again.");
    }

}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

async function updateData(dataUrl1) {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let userType = document.getElementById('userType').value 
    let joiningdate = document.getElementById('joiningdate').value

    let UpdateDatas = {
        name,
        email,
        userType,
        joiningdate,
        image : dataUrl1
    }
    let Str_UpdateData = JSON.stringify(UpdateDatas);
    console.log("Str_UpdateData", Str_UpdateData);

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id')
    console.log("id from update data", id);

    let tokenkey = params.get('login')
    console.log("tokenkey", tokenkey);

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);


    try {
        let Update_response = await fetch(`/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: Str_UpdateData

        })
        let parsed_Update_response = await Update_response.json();
        console.log('parsed_Update_response', parsed_Update_response);

        window.location.href = `admin.html?login=${tokenkey}`

        if (parsed_Update_response) {
            alert("Data Updated Successfully")
        }

    } catch (error) {
        console.log("error", error);
    }
}

function handleClickEdit1(id,tokenkey){
    window.location.href = `employeeupdate.html?id=${id}&login=${tokenkey}`
}

async function currentdata1() {
    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id')
    console.log("id from update data", id);

    let tokenkey = params.get('login')
    console.log(" tokenkey", tokenkey);

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);

    let name = document.getElementById('name');
    let email = document.getElementById('email')
    let userType = document.getElementById('userType'); 
    let joiningdate = document.getElementById('joiningdate')

    try {
        let form_response = await fetch(`/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${token}`
            },
        });
        let form_parse_data = await form_response.json();
        console.log(" form_parse_data: ",form_parse_data)

        let data = form_parse_data.data
        console.log("data : ",data)

        name.value = data[0].name
        email.value = data[0].email
        userType.value = data[0].userType
        joiningdate.value = data[0].joiningdate
    } catch (error) {
        image
        console.log("error : ", error)
    }
   
}

async function updateEmployee(event) {
    event.preventDefault()

    event.preventDefault()  

    let image = document.getElementById('image');
    let file = image.files[0];

    if (!file ) {
        alert("Please select image.");
        return;
    }

    try {
        let dataUrl2 = await readFileAsDataURL(file);
        await updateData1(dataUrl2);
    } catch (error) {
        console.error("Error reading files:", error);
        alert("An error occurred while reading the files. Please try again.");
    }

}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

async function updateData1(dataUrl2) {
   let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let userType = document.getElementById('userType').value 
    let joiningdate = document.getElementById('joiningdate').value 

    let UpdateDatas = {
        name,
        email,
        userType,
        joiningdate,
        image : dataUrl2
        
    }
    let Str_UpdateData = JSON.stringify(UpdateDatas);
    console.log("Str_UpdateData", Str_UpdateData);

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id')
    console.log("id from update data", id);

    let tokenkey = params.get('login')
    console.log("tokenkey", tokenkey);

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);


    try {
        let Update_response = await fetch(`/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: Str_UpdateData

        })
        let parsed_Update_response = await Update_response.json();
        console.log('parsed_Update_response', parsed_Update_response);

        window.location.href = `employee.html?id=${id}&login=${tokenkey}`

        if (parsed_Update_response) {
            alert("Data Updated Successfully")
        }

    } catch (error) {
        console.log("error", error);
    }
}

async function employeeprofile() {

    let params = new URLSearchParams(window.location.search);
        console.log("params", params);
    
        let id = params.get('id')
        console.log("id from update data", id);
    
        let tokenkey = params.get('login')
        console.log("tokenkey", tokenkey);
    
        let token = localStorage.getItem(tokenkey);
        console.log("token:", token);
    
        try {
            let response = await fetch(`/users/${id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization' : `Bearer ${token}`
                },
            });
            console.log("response : ", response);
    
            let parsed_response = await response.json();
            console.log("parsed_response : ", parsed_response);
    
            let data = parsed_response.data;
            console.log("data : ", data);
        
            let rows = ''; 
    
            for (let i = 0; i < data.length; i++) {
                console.log(data[i]);
    
                rows += `
    <div class="container ">
    <div class="row d-flex flex-column ">
        <img src="${data[i].image}" class="singleemployeecontainerimg mb-2"> 
        <div class="ms-3 text-dark fs-5 fw-bold mb-2">${data[i].name}</div>
        <div class="ms-3 text-dark fs-5 fw-bold mb-2">${data[i].email}</div>
        <button class=" ms-4 mt-2 editbtn1" onclick="handleClickEdit1('${id}','${tokenkey}')">Edit Settings</button>
        <button class=" ms-4 mt-2 editbtn2" onclick="handleClickreset('${id}','${tokenkey}')">Password reset</button>
</div>
</div>
                `;
            }
            
            document.getElementById('container').innerHTML = rows;
    
        } catch (error) {
            console.log("error : ", error);
        }
}

async function handleClickDelete(id,tokenkey) {

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let tokenKey = tokenkey;

    let token= localStorage.getItem(tokenKey);
    console.log("tokenKey:", token);

    try {
        let Delete_response = await fetch(`/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Authorization' : `Bearer ${token}`
            },
        })
        let parsed_Delete_response = await Delete_response.json();
        console.log("parsed_response : ", parsed_Delete_response);

        window.location.href = `admin.html?id=${id}&login=${tokenKey}`

        if(parsed_Delete_response){
            alert("Book Deleted Successfully")
        }else{
            alert("Book Not Deleted")
        }
    } catch (error) {
        console.log("error : ", error);
    }
}

function handleClickreset(){

    let resetform = document.getElementById('resetform');
    if (resetform.style.display === 'none' || resetform.style.display === '') {
        resetform.style.display = 'block'; 
    } else {
        resetform.style.display = 'none'; 
    }

}

async function passwordreset(event){
    event.preventDefault();

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id')
    console.log("reset id", id);

    let tokenkey = params.get('login')
    console.log("reset tokenkey", tokenkey);

    let token = localStorage.getItem(tokenkey);
    console.log("resettoken:", token);

    let email = document.getElementById('resetemail').value;
    let password = document.getElementById('resetpassword').value;
    let newpassword = document.getElementById('newpassword').value;

    let datas = {
        email,
        password,
        newpassword
    }

    let strDatas = JSON.stringify(datas);

    try {
        let resetResponse = await fetch(`/passwordreset/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: strDatas

        })
        let parsed_resetResponse = await resetResponse.json();
        console.log('parsed_resetResponse', parsed_resetResponse);

        window.location.href = `employee.html?id=${id}&login=${tokenkey}`

        if (parsed_resetResponse) {
            alert("Password reset Successfully")
        }

    } catch (error) {
        console.log("error", error);
    }

}

