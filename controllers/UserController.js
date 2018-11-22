class UserController {
    constructor(formIdCreate, formIdUpdate, tableId) {
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();
    }

    onEdit() {
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
            this.showPanelCreate();
        });
        this.formUpdateEl.addEventListener("submit", event => {
            event.preventDefault();
            let btn = this.formUpdateEl.querySelector("[type=submit]")
            btn.disabled = true;
            let values = this.getValues(this.formUpdateEl);
            let index = this.formUpdateEl.dataset.trIndex
            let tr = this.tableEl.rows[index];
            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);

            this.getphoto(this.formUpdateEl).then(
                (content) => {
                    if (!values.photo) {
                        result._photo = userOld._photo;
                    }
                    else {
                        values.photo = content;
                    }

                    tr.dataset.user = JSON.stringify(result);

                    tr.innerHTML = `
                    <td>
                        <img src="${result._photo}" alt="User Image" class="img-circle img-sm">
                    </td>
                    <td>${result._name}</td>
                    <td>${result._email}</td>
                    <td>${result._admin ? "Sim" : "Não"}</td>
                    <td>${result._register.toLocaleString()}</td>
                    <td>
                        <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>
                `;
                    this.addEventsTR(tr);
                    this.updateCount();
                    this.showPanelCreate();
                    this.formUpdateEl.reset();
                    btn.disabled = false;
                },
                (e) => {
                    console.error(e);
                });
        });
    }
    showPanelCreate() {
        document.querySelector("#box-user-create").hidden = false;
        document.querySelector("#box-user-update").hidden = true;
    }
    showPanelUpdate() {
        document.querySelector("#box-user-create").hidden = true;
        document.querySelector("#box-user-update").hidden = false;
    }
    onSubmit() {
        this.formEl.addEventListener("submit", (event) => {
            event.preventDefault();
            let btn = this.formEl.querySelector("[type=submit]");
            btn.disabled = true;

            let values = this.getValues(this.formEl);
            if (!values) {
                btn.disabled = false;
                return false;
            }

            this.getphoto(this.formEl).then(
                (content) => {
                    values.photo = content;
                    this.addLine(values);
                    this.formEl.reset();
                    btn.disabled = false;
                },
                (e) => {
                    console.error(e);
                });
        });

    }

    getValues(formEl) {

        let user = {};
        let isValid = true;
        [...formEl.elements].forEach(function (field, index) {

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add("has-error");
                isValid = false;
            }

            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            }
            else if (field.name == "admin") {
                user[field.name] = field.checked;
            }
            else {
                user[field.name] = field.value;
            }
        });
        if (!isValid) {
            return false;
        }
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    }

    getphoto(formEl) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item => {
                if (item.name === "photo") {
                    return item;
                }
            });

            let file = elements[0].files[0];

            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (e) => {
                reject(e);
            };
            if (file) {
                fileReader.readAsDataURL(file);
            } else { resolve('dist/img/boxed-bg.jpg'); }

        });
    }

    addLine(dataUser) {

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
        <td>
            <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
        </td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${dataUser.admin ? "Sim" : "Não"}</td>
        <td>${dataUser.register.toLocaleString()}</td>
        <td>
            <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
    `;

        this.addEventsTR(tr);

        this.tableEl.appendChild(tr);

        this.updateCount();
    }
    updateCount() {
        let numberUsers = 0;
        let numberAdmin = 0;
        [...this.tableEl.children].forEach(tr => {
            numberUsers++;

            if (JSON.parse(tr.dataset.user)._admin) { numberAdmin++; }
        });
        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
        //document.getElementById("number-users").innerHTML = eval(parseInt(document.getElementById("number-users").innerHTML) + 1);
    }
    addEventsTR(tr) {
        tr.querySelector(".btn-edit").addEventListener("click", e => {
            let json = JSON.parse(tr.dataset.user);
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
            for (let name in json) {
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {
                    if (field.type == "file") continue;

                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name]
                    }
                    field.value = json[name];
                }
            }
            this.formUpdateEl.querySelector("photo").src = json._photo;
            this.showPanelUpdate();
        });
    }
}