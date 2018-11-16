// var name = document.querySelector("#exampleInputName");
// var gender = document.querySelectorAll("#form-user-create [name=gender]:checked");
// var birth = document.querySelector("exampleInputBirth");
// var country = document.querySelector("exampleInputEmail");
// var email = document.querySelector("exampleInputContry");
// var password = document.querySelector("exampleInputPassword");
// var photo = document.querySelector("exampleInputFile");
// var admin = document.querySelector("#");

var fields = document.querySelectorAll("#form-user-create [name]")
var user = {};

function addLine(dataUser) {
    let dateNow = new Date

    document.getElementById("table-users").innerHTML = `
<tr>
    <td>
        <img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm">
    </td>
    <td>${dataUser.name}</td>
    <td>${dataUser.email}</td>
    <td>${dataUser.admin}</td>
    <td>${dateNow.toLocaleDateString()}</td>
    <td>
        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>
</tr>
`;

}

document.getElementById("form-user-create").addEventListener("submit", function (event) {
    event.preventDefault();

    fields.forEach(function (field, index) {

        if (field.name == "gender") {
            if (field.checked) {
                user[field.name] = field.value;
            }
        }
        else {
            user[field.name] = field.value;
        }
    });

    var objectUser = new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin)

    addLine(objectUser);

});