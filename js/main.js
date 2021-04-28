let app = new Vue({
    el: "#vueApp",
    data: {
        tempTitle: "",
        tempCategory: 0,
        tempBody: "",
        signedIn: true,
        currUser: "James",
        currentArticle: "",
        result: [],
        responseAvailable: false,
        apiKey: JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE0LCJleHAiOjE2MjAwNTY0OTJ9.rqP6jqxEnt952uLUfgQknc5H0X8mQnxK4Gdy8fbyKbM'),
    },
    methods: {
        updateTitle() {
            this.tempTitle = this.currentArticle.title
            this.tempCategory = this.currentArticle.category_id;
            this.tempBody = this.currentArticle.body;     
        },
        /*
        async getArticles() {
            // Default options are marked with *
            const response = await fetch("http://206.189.202.188:2513/api/articles", {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                //mode: 'cors', // no-cors, *cors, same-origin
                //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                //credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    'Authenication': this.apiKey
                },
                
            });
            return response.json(); // parses JSON response into native JavaScript objects
        },*/
          
        // async getArticles() {
        //     fetch("http://206.189.202.188:2513/api/articles",
        //         {
        //             "method": "GET",
        //         })
        //     .then(response=> {
        //         console.log(response.body);
        //     })
        //     .then(res => res.json())
        //     .then(data => this.result = data)
        //     .catch(err=> {
        //         console.log(err);
        //     })
        async getArticles() {
            await fetch("http://206.189.202.188:2513/api/articles")
            .then(res => res.json())
            .then(data => this.result = data)
        },

        async editArticle() {
            console.log("Here");
            let _headers = new Headers();
            _headers.append("Content-Type", "application/json");
            _headers.append("Authorization", "Bearer " + this.apiKey);
            const data = { "title": "SD" }
            await fetch("http://206.189.202.188:2513/api/articles/edit/" + this.currentArticle.id, { 
                method: "POST",
                //mode: 'cors',
                headers: _headers,
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => this.result = data)
        },

        viewArticle(temp) {
            console.log(temp);
            this.currentArticle = temp;
        }
    },
    beforeMount() {
        this.getArticles();
            // .then(result => {
            //     console.log(result);
            // });
    },
    watch: {
        currentArticle: {
            handler(item) {
                localStorage.currentArticle = JSON.stringify(item);
            }
        }
    },
    mounted() {
        if (localStorage.currentArticle) {
            this.currentArticle = JSON.parse(localStorage.currentArticle);
        }
    }
});
