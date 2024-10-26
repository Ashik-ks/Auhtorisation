
async function login(event) {
    event.preventDefault();
    console.log("login btn clicked...")
    let email = document.getElementById('emaillogin').value;
    console.log("email : ", email);

    let password = document.getElementById('passwordlogin').value;
    console.log("password : ", password)

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
        console.log("token_data : ", token_data);

        let id = parsed_response.data.token_id;
        console.log("id : ", id)

        let tokenkey = id;

        localStorage.setItem(tokenkey, token_data);
        console.log("Token stored successfully.");

        if (parsed_response.data.loginCount === 0) {
            // If login count is 0, redirect to reset password page
            window.location.href = `resetpassword.html?id=${id}&login=${tokenkey}`;
            return;
        } else if (parsed_response.data.loginCount >= 1) {
            // If login count is 1 or more, check user type and redirect
            if (parsed_response.data.user_types === 'Admin') {
                alert("Admin login successful");
                window.location.href = `admin.html?id=${id}&login=${tokenkey}`;
                return;
            } else if (parsed_response.data.user_types === 'Employee') {
                alert("Employee login successful");
                window.location.href = `employee.html?id=${id}&login=${tokenkey}`;
                return;
            } else {
                alert("Unknown user type. Please contact support.");
                return;
            }
        } else {
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

    let id = urlParams.get("id");
    console.log("id ", id, typeof (id));

    let tokenkey = urlParams.get('login');
    console.log("tokenkey : ", tokenkey)


    let token = localStorage.getItem(tokenkey)
    console.log("token : ", token)

    let response = await fetch('/users', {
        method: 'GET',
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${token}`
        },
    })

    let parsed_response = await response.json();
    console.log("parsed_response : ", parsed_response);

    let data = parsed_response.data;
    console.log('data : ', data);

    let admindatacontainer = document.getElementById("admindatacontainer");
    let rows = ''

    for (i = 0; i < data.length; i++) {
        let id = data[i]._id;
        rows = rows + `

          <div class="container mb-4 bg-white shadow-sm p-3 rounded">
    <div class="row d-flex justify-content-center align-items-center">
        <div class="col text-center">
            <img src="${data[i].image}" class="adminDatacontainerimg" alt="User Image">
        </div>
        <div class="col text-center text-dark" style="font-size: 18px; font-weight: 700;">
            ${data[i].name}
        </div>
        <div class="col fs-5 fw-bold text-center text-dark" style="font-size: 18px; font-weight: 700;">
            ${data[i].email}
        </div>
        <div class="col text-center">
            <button class="editbtn" onclick="handleClickEdit('${data[i]._id}', '${tokenkey}')">Edit</button>
        </div>
        <div class="col text-center">
            <button class="editbtn" onclick="handleClick('${data[i]._id}', '${tokenkey}')">View</button>
        </div>
        <div class="col text-center">
            <img src="./images/icons8-delete-30.png" alt="Delete" id="deleteimg" onclick="handleClickDelete('${data[i]._id}', '${tokenkey}')">
        </div>
    </div>
</div>

        `
    }

    admindatacontainer.innerHTML = rows;

}

function terms() {
    let termsDiv = document.getElementById('termsdiv');
    if (termsDiv.style.display === "none" || termsDiv.style.display === "") {
        termsDiv.style.display = "block";
    } else {
        termsDiv.style.display = "none";
    }
}

async function AddUser(event) {
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

    let id = urlParams.get('id');
    console.log("id: ", id)

    let tokenkey = urlParams.get('login');
    console.log("tokenkey : ", tokenkey)

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let userType = document.getElementById('userType').value;
    let joiningdate = document.getElementById('joiningdate').value

    let add_data = {
        name,
        email,
        userType,
        joiningdate,
        image: dataUrl
    }

    let str_add_data = JSON.stringify(add_data);

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);

    try {
        let response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: str_add_data,
        })
        console.log("response : ", response);

        let parsed_response = await response.json();
        console.log("parsed_response : ", parsed_response);

        if (parsed_response) {
            alert("user added successfully");
            window.location.href = `admin.html?login=${tokenkey}`
            return;
        } else {
            alert("user not added");
            return;
        }

    } catch (error) {
        console.log("error : ", error)
    }
}

function handleClick(id, tokenkey) {
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
    console.log("tokenkey : ", tokenkey);

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);

    try {
        let response = await fetch(`/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
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
                <div class="container" >
   <div class="row">
    <div class="col-3"></div>
    <div class="col-6 shadow-sm p-3 mb-5 bg-body rounded www" style=" background-image: url('./images/WhatsApp Image 2024-10-09 at 12.32.24_0a5cc346.jpg'); 
                       background-size: cover; 
                       background-position: center;">
        <div class="row d-flex flex-column justify-content-center align-items-center">
            <div class="col text-center mt-3"><img src="${data[i].image}" class="singleusercontainerimg"></div>
            <div class="col text-center text-light mb-4 mt-3 fs-4 fw-bold" style="font-size: 18px; font-weight: 700;">Name : 
                ${data[i].name}
            </div>
    
            <div class="col fs-4 fw-bold text-center text-light mb-4" style="font-size: 18px; font-weight: 700;">
               Email : ${data[i].email}
            </div>
    
            <div class="col fs-4 fw-bold text-center text-light mb-5" style="font-size: 18px; font-weight: 700;">
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

    let tokenkey = urlParams.get('login');
    console.log("tokenkey ", tokenkey, typeof (tokenkey));

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);

    try {

        let response = await fetch(`/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
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
        <div class="row">
            <div class="col shadow-sm p-3 mb-5 bg-body rounded www"
                style="background-image: url('./images/WhatsApp Image 2024-10-09 at 12.32.24_0a5cc346.jpg'); 
                       background-size: cover; 
                       background-position: center;">
                <div class="row d-flex">
                    <div class="col-6">
                        <div class="row">
                            <div class="col-2"></div>
                            <div class="col-10">
                                <div class="col fs-4 fw-bold text-light mt-5 mb-2">HR MANAGEMENT</div>
                                <div class="col fs-1 fw-bold text-light">Welcome To Our Team</div>
                                <div class="col fs-5 text-light mb-4">
                                    We’re thrilled to have you onboard! As a valued member of our organization,
                                    you play a crucial role in our mission. Together, we’ll achieve great things!
                                    We’re excited to embark on this journey with you. Let’s make great things happen together!
                                </div>
                                <div class="col"><button class="border-1 ps-2 pe-2 bg-transparent text-light morebtn">more</button></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="col text-center mt-5"><img src="${data[i].image}" class="singleusercontainerimg"></div>
                        <div class="col text-center text-light mb-3 mt-3" style="font-size: 18px; font-weight: 700;">
                            Name: ${data[i].name}
                        </div>
                        <div class="col fs-5 fw-bold text-center text-light mb-3" style="font-size: 18px; font-weight: 700;">
                            Email: ${data[i].email}
                        </div>
                        <div class="col fs-5 fw-bold text-center text-light mb-3" style="font-size: 18px; font-weight: 700;">
                            Join Date: ${data[i].joiningdate}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
            `;
        }

        // Append all rows at once
        document.getElementById('employeedatacontainer').innerHTML = rows;

    } catch (error) {
        console.log("error : ", error);
    }
}

function handleClickEdit(id, tokenkey) {
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
        let form_response = await fetch(`/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            },
        });
        let form_parse_data = await form_response.json();
        console.log(" form_parse_data: ", form_parse_data)

        let data = form_parse_data.data
        console.log("data : ", data)

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
    event.preventDefault();

    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let id = url_params.get("id");
    let token_key = url_params.get("login");
    let token = localStorage.getItem(token_key);

    let body;

    if (document.getElementById('image').files[0] === undefined) {
        body = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            userType: document.getElementById('userType').value,
            joiningdate: document.getElementById('joiningdate').value
        }
    } else {
        let file = document.getElementById('image').files[0];

        // Use a Promise to wait for FileReader to finish reading the file
        body = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                resolve({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    userType: document.getElementById('userType').value,
                    joiningdate: document.getElementById('joiningdate').value,
                    image: e.target.result // DataURL of the image
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    try {
        let str_body = JSON.stringify(body);
        console.log("str_body:", str_body);
        let response = await fetch(`/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: str_body
        });
        console.log("response : ", response);
        if (response.status === 200) {
            alert("user updated successfully");
            window.location = `admin.html?id=${id}&login=${token_key}`;
        } else {
            alert("user updation failed");
        }
    } catch (error) {
        console.log("error : ", error);
    }
}

function handleClickEdit1(id, tokenkey) {
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
        let form_response = await fetch(`/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            },
        });
        let form_parse_data = await form_response.json();
        console.log(" form_parse_data: ", form_parse_data)

        let data = form_parse_data.data
        console.log("data : ", data)

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

    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let id = url_params.get("id");
    console.log("www : ", id)
    let tokenKey = url_params.get("login");
    let token = localStorage.getItem(tokenKey);
    console.log("www : ", token)

    let body;

    if (document.getElementById('image').files[0] === undefined) {
        body = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            userType: document.getElementById('userType').value,
            joiningdate: document.getElementById('joiningdate').value
        }
    } else {
        let file = document.getElementById('image').files[0];

        // Use a Promise to wait for FileReader to finish reading the file
        body = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                resolve({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    userType: document.getElementById('userType').value,
                    joiningdate: document.getElementById('joiningdate').value,
                    image: e.target.result // DataURL of the image
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    try {
        let str_body = JSON.stringify(body);
        console.log("str_body:", str_body);
        let response = await fetch(`/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: str_body
        });
        console.log("response : ", response);
        if (response.status === 200) {
            alert("user updated successfully");
            window.location.href = `employee.html?id=${id}&login=${tokenKey}`
        } else {
            alert("user updation failed");
        }
    } catch (error) {
        console.log("error : ", error);
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
        let response = await fetch(`/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
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
        <div class="text-center"><img src="${data[i].image}" class="singleemployeecontainerimg mb-4"> </div>
        <button class=" ms-4 mt-2 editbtn1" onclick="handleClickEdit1('${id}','${tokenkey}')">Edit Settings</button>
        <button class=" ms-4 mt-3 editbtn2" onclick="handleClickreset('${id}','${tokenkey}')">Password reset</button>
</div>
</div>
                `;
        }

        document.getElementById('container').innerHTML = rows;

    } catch (error) {
        console.log("error : ", error);
    }
}

async function adminprofile() {

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id')
    console.log("id from update data", id);

    let tokenkey = params.get('login')
    console.log("tokenkey", tokenkey);

    let token = localStorage.getItem(tokenkey);
    console.log("token:", token);

    try {
        let response = await fetch(`/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
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
        <div class="text-center"><img src="${data[i].image}" class="singleemployeecontainerimg mb-4"> </div>
        <div class="col text-center text-dark" style="font-size: 18px; font-weight: 700;">
            ${data[i].name}
        </div>
        <div class="col mb-3 text-center text-dark" style="font-size: 18px; font-weight: 700;">
            ${data[i].email}
        </div>
        <button class="ms-4  mt-2 mb-1 editbtn1" onclick="handleClickEdit('${id}','${tokenkey}')">Edit Settings</button>
        <button class="ms-4 mt-2 editbtn2" onclick="handleClickreset('${id}','${tokenkey}')">Password reset</button>
</div>
</div>
                `;
        }

        document.getElementById('container').innerHTML = rows;

    } catch (error) {
        console.log("error : ", error);
    }
}

async function handleClickDelete(id, tokenkey) {

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let tokenKey = tokenkey;

    let token = localStorage.getItem(tokenKey);
    console.log("tokenKey:", token);

    try {
        let Delete_response = await fetch(`/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            },
        })
        let parsed_Delete_response = await Delete_response.json();
        console.log("parsed_response : ", parsed_Delete_response);

        window.location.href = `admin.html?id=${id}&login=${tokenKey}`

        if (parsed_Delete_response) {
            alert("user Deleted Successfully")
        } else {
            alert("user Not Deleted")
        }
    } catch (error) {
        console.log("error : ", error);
    }
}

//To reset password
function handleClickreset() {

    let resetform = document.getElementById('resetform');
    if (resetform.style.display === 'none' || resetform.style.display === '') {
        resetform.style.display = 'block';
    } else {
        resetform.style.display = 'none';
    }

}

async function passwordreset(event) {
    event.preventDefault();

    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    let tokenkey = params.get('login');
    let token = localStorage.getItem(tokenkey);

    // Collecting passwords from input fields
    let password = document.getElementById('resetpassword').value;
    let newpassword = document.getElementById('newpassword').value;

    let datas = {
        password,
        newpassword
    };

    let strDatas = JSON.stringify(datas);

    try {
        let resetResponse = await fetch(`/passwordreset/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: strDatas
        });

        let parsed_resetResponse = await resetResponse.json();
        console.log('parsed_resetResponse', parsed_resetResponse);

        if (parsed_resetResponse.success) {
            alert("Password reset successfully");
            window.location.href = `index.html`;
        } else {
            alert(parsed_resetResponse.message || "Failed to reset password");
        }

    } catch (error) {
        console.log("error", error);
        alert("An error occurred. Please try again.");
    }
}


//to pass token key
function passtoken() {
    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let id = urlParams.get('id');
    console.log("id : ", id)

    let tokenkey = urlParams.get('login');
    console.log("tokenkey : ", tokenkey)

    window.location.href = `adduser.html?login=${tokenkey}&id=${id}`
}
function passtoken1() {
    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let tokenkey = urlParams.get('loginid');
    console.log("tokenkeysingle : ", tokenkey)

    let id = urlParams.get('id');
    console.log("singleid : ", id)

    window.location.href = `admin.html?login=${tokenkey}&id=${id}`
}
function passtoken2() {
    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let tokenkey = urlParams.get('login');
    console.log("tokenkeysingle : ", tokenkey)

    let id = urlParams.get('id');
    console.log("singleid : ", id)

    window.location.href = `admin.html?login=${tokenkey}&id=${id}`
}
function passtoken3() {
    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let tokenkey = urlParams.get('login');
    console.log("tokenkeysingle : ", tokenkey)

    let id = urlParams.get('id');
    console.log("singleid : ", id)

    window.location.href = `employee.html?login=${tokenkey}&id=${id}`
}

//To logout
function logoutalert() {
    let logoutdiv = document.getElementById('logoutdiv');
    let offcanvasbody = document.getElementById('offcanvasbody');

    if (logoutdiv.style.display === 'none' || logoutdiv.style.display === '') {
        logoutdiv.style.display = 'block';
        offcanvasbody.classList.add('blur');

        logoutdiv.querySelector('input, button').focus();
    } else {
        logoutdiv.style.display = 'none';
        offcanvasbody.classList.remove('blur');
    }
}
function logout() {

    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let tokenkey = urlParams.get('login');
    console.log("tokenkey : ", tokenkey)

    localStorage.removeItem(tokenkey);
    console.log("keys in localstorage : ", Object.keys(localStorage))
    window.location.href = `index.html`
}
function nologout() {
    window.location = window.location.href;
}

function forgotpass(event) {
    event.preventDefault();
    console.log("button clicked");
    window.location.href = `emailverification.html`
    
}

async function emailverify(event) {
    event.preventDefault();

    let email = document.getElementById('forgotemail').value;
    let data = { email };
    let str_data = JSON.stringify(data);

    try {
        let response = await fetch('/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: str_data,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        let parsed_response = await response.json();
        console.log("parsed_response: ", parsed_response);

        if (parsed_response.success) {
            alert("Verification email sent to your email address.");
        } else {
            alert("User not found or email already verified.");
        }
    } catch (error) {
        console.error("Error: ", error);
        alert("An error occurred while sending the verification email. Please try again later.");
    }
}


async function forgotpassword(event) {
    event.preventDefault();
    console.log("button Clicked");

    let location = window.location;
    console.log("location", location);

    let querystring = location.search;
    console.log("querystring", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url", urlParams);

    let resettoken = urlParams.get('token');
    console.log("resettoken : ", resettoken)

    let password = document.getElementById('forgotNewpassword').value;
    console.log("password : ", password);

    let confirmpassword = document.getElementById('confirmpassword').value;
    console.log("confirmpassword : ", confirmpassword)
    if(password === confirmpassword ){
        let data = {
            password
        }
    
        let srt_data = JSON.stringify(data);
    
        try {
            let response = await fetch('/reset-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${resettoken}`
                },
                body: srt_data,
            })
            console.log("response : ", response);
    
            let parsed_response = await response.json();
            console.log("parsed_response : ", parsed_response);
    
            if (parsed_response) {
                alert("password reset successfully");
                window.location.href = `index.html`
                return;
            } else {
                alert("reset password not successfull");
                return;
            }
    
        } catch (error) {
            console.log("error : ", error)
    
        }
    }
        
    else{
        alert("Confirmpassword is incorrect")
    }

    

}

