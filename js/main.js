let app = new Vue({
    el: "#vueApp",
    data: {
        tempTitle: "",
        tempCategory: "",
        tempBody: "",
        signedIn: false,
        currUser: "",
        password: "",
        currentArticle: "",
        result: [],
        responseAvailable: false,
        apiKey: "",
        resp: "",
    },
    methods: {
        async login() {
            let _headers = { "Content-Type": "application/json" }
            const data = { "username": this.currUser, 
                           "password": this.password }
            this.password = "";

            await fetch("http://206.189.202.188:2513/api/users/token", { 
                method: "POST",
                headers: _headers,
                body: JSON.stringify(data)
            })
            .then(res => {
                if (res.status != 200) {
                    alert("Incorrect Username or Password");
                    return;
                } else {
                    return res.json();
                }
            })
            .then(data => this.result = data)

            this.apiKey = this.result.data.token;
            this.signedIn = true;
            console.log("password = ");
            window.location.href = "index.html"
        },

        logout() {
            console.log("Logout");
            this.signedIn = false;
            this.apiKey = "";
            this.currUser = "";
            localStorage.clear();
        },

        // updateTitle() {
        //     this.tempTitle = this.currentArticle.title
        //     this.tempCategory = this.currentArticle.category_id;
        //     this.tempBody = this.currentArticle.body;     
        // },
       
        async getArticles() {
            await fetch("http://206.189.202.188:2513/api/articles")
            .then(res => res.json())
            .then(data => this.result = data)
        },

        async editArticle() {
            let _headers = { "Content-Type": "application/json", "Authorization": "Bearer " + this.apiKey }
            const data = { "title": this.currentArticle.title, 
                           "category_id": this.currentArticle.category_id,
                           "body": this.currentArticle.body }

            await fetch("http://206.189.202.188:2513/api/articles/edit/" + this.currentArticle.id, { 
                method: "POST",
                headers: _headers,
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => this.result = data)
            window.location.href = "index.html"
        },

        async postArticle() {
            if (this.apiKey == "") {
                console.log("Please Log In");
                return;
            } else {
                let _headers = { "Content-Type": "application/json", "Authorization": "Bearer " + this.apiKey }
                const data = { "title": this.tempTitle, 
                               "category_id": this.tempCategory,
                               "body": this.tempBody }

                await fetch("http://206.189.202.188:2513/api/articles/add", { 
                    method: "POST",
                    headers: _headers,
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => this.result = data)
                window.location.href = "index.html"
            }
        },

        async deleteArticle() {
            let _headers = { "Content-Type": "application/json", "Authorization": "Bearer " + this.apiKey }
            await fetch("http://206.189.202.188:2513/api/articles/delete/" + this.currentArticle.id, { 
                method: "DELETE",
                headers: _headers,
            })
            .then(res => res.json())
            .then(data => this.result = data)
            window.location.href = "index.html"

        },

        viewArticle(temp) {
            console.log(temp);
            this.currentArticle = temp;
        }
    },
    beforeMount() {
        this.getArticles();
    },
    watch: {
        currentArticle: {
            handler(item) {
                localStorage.currentArticle = JSON.stringify(item);
            }
        },

        currUser: {
            handler(item) {
                localStorage.currUser = JSON.stringify(item);
            }
        },

        apiKey: {
            handler(item) {
                localStorage.apiKey = JSON.stringify(item);
            }
        },

        signedIn: {
            handler(item) {
                localStorage.signedIn = JSON.stringify(item);
            }
        }
    },
    mounted() {
        if (localStorage.currentArticle) {
            this.currentArticle = JSON.parse(localStorage.currentArticle);
        }

        if (localStorage.currUser) {
            this.currUser = JSON.parse(localStorage.currUser);
        }

        if (localStorage.apiKey) {
            this.apiKey = JSON.parse(localStorage.apiKey);
        }

        if (localStorage.signedIn) {
            this.signedIn = JSON.parse(localStorage.signedIn);
        }
    }
});
