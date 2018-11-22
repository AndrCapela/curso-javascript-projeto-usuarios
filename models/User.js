class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date
    }
    get name() {
        return this._name;
    }
    get id() {
        return this._id;
    }
    set name(value) {
        this._name = value;
    }
    get gender() {
        return this._gender;
    }
    set gender(value) {
        this._gender = value;
    }
    get birth() {
        return this._birth;
    }
    set birth(value) {
        this._birth = value;
    }
    get country() {
        return this._country;
    }
    set country(value) {
        this._country = value;
    }
    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
    get password() {
        return this._password;
    }
    set password(value) {
        this._password = value;
    }
    get photo() {
        return this._photo;
    }
    set photo(value) {
        this._photo = value;
    }
    get admin() {
        return this._admin;
    }
    set admin(value) {
        this._admin = value;
    }
    get register() {
        return this._register;
    }

    loadFromJSON(json) {
        for (let name in json) {
            switch (name) {
                case "_register":
                    this[name] = new Date(json[name]);
                    break;
                default:
                    this[name] = json[name];
            }

        }
    }
    getnewID() {
        if (!window.id) window.id = 0;
        id++;
        return id;
    }

    save() {
        let users = User.getUsersStorage();
        if (this.id > 0) {
            users.map(u => {
                if (u._id == this.id) {
                    Object.assign(u, this);
                }
                return u;
            });

        }
        else {
            this._id = this.getnewID();
            users.push(this);
        }
        localStorage.setItem("users", JSON.stringify(users));
    }

    static getUsersStorage() {
        let users = [];
        //if (sessionStorage.getItem("users")) {
        if (localStorage.getItem("users")) {
            users = JSON.parse(localStorage.getItem("users"));
            //users = JSON.parse(sessionStorage.getItem("users"));
        }
        return users;
    }
    remove() {
        let users = User.getUsersStorage();
        users.forEach((userData, index) => {
            if (this._id == userData._id) {
                users.splice(index, 1);
            }
        });
        localStorage.setItem("users", JSON.stringify(users));
    }
}