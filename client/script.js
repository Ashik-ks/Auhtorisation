async function AddUser(event){
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
        let response = await fetch('/submit', {
            method: 'post',
            headers: {
                'Content-Type': "application/json"
            },
            body: str_Datas,
        });
        console.log("response : ", response);

        let parsed_response = await response.text();
        console.log("parsed_response : ", parsed_response)

        if (parsed_response) {
            alert("user Added Successfully");
            return;
        } else {
            alert("something went wrong");
        }

    } catch (error) {
        console.log("error : ,error")
    }
}