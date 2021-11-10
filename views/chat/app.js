const app = Vue.component('app', {
    template: `
        <div class="app">
            <div class="app__header">
                <div class="app__header__title">
                    <h1>Chat</h1>
                </div>
                <div class="app__header__user">
                    <div class="app__header__user__name">
                        <h2>{{ user.name }}</h2>
                    </div>
                    <div class="app__header__user__avatar">
                        <img :src="user.avatar" alt="">
                    </div>
                </div>
            </div>
            <div class="app__body">
                <div class="app__body__messages">
                    <div class="app__body__messages__list">
                        <div class="app__body__messages__list__item" v-for="message in messages">
                            <div class="app__body__messages__list__item__user">
                                <div class="app__body__messages__list__item__user__avatar">
                                    <img :src="message.user.avatar" alt="">
                                </div>
                                <div class="app__body__messages__list__item__user__name">
                                    <h3>{{ message.user.name }}</h3>
                                </div>
                            </div>
                            <div class="app__body__messages__list__item__message">
                                <p>{{ message.message }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="app__body__form">
                    <div class="app__body__form__input">
                        <input type="text" v-model="message" @keyup.enter="sendMessage">
                    </div>
                    <div class="app__body__form__button">
                        <button @click="sendMessage">Send</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            user: {
                name: '',
                avatar: ''
            },
            messages: [],
            message: ''
        }
    },
    created() {
        this.getUser();
        this.getMessages();
    },
    methods: {
        getUser() {
            axios.get('/api/user')
                .then(response => {
                    this.user = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        getMessages() {
            axios.get('/api/messages')
                .then(response => {
                    this.messages = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        sendMessage() {
            axios.post('/api/messages', {
                message: this.message
            })
                .then(response => {
                    this.messages.push(response.data);
                    this.message = '';
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
});