const app = Vue.createApp({
    data() {
        return {
            company: 'Fine',
            api: 'https://script.google.com/macros/s/AKfycbz34HP4dcHqCUqAiCqAn22CFjeUVV1bo3U95611CVVvNdPE2YwcSQ4RewVn3m-bZhym/exec?submit=1',
            loged: false,
            logedIn: false,
            openCamera: false,
            preview: false,
            username: '',
            useremail: '',
            usernumber: '',
            imageURI: '',
            terms: false,
            editTools: true,
            spinner: false,
            dir: 'rtl',
            lang: 'arb',
            count: ''

        }
    },
    mounted() {
        var swiper = new Swiper('.swiper', {
            pagination: {
                el: '.swiper-pagination',
                type: 'progressbar',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

    },
    methods: {
        
        back() {

            location.href = 'index.html'
        },

        getCred(e) {
            console.log(e)
            this.username = e.name
            this.useremail = e.email
            this.usernumber = e.number

            this.startWebcam()
        },

        setLang(lang) {
            this.lang = lang
            if (this.lang == 'arb') this.dir = 'rtl'
            else this.dir = 'ltr'
        },

        trancate(text, size) {
            // it trancate n number of words
            // var n = 20
            // var text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non neque nesciunt et. Exercitationem quam corrupti officia expedita aspernatur eveniet fugiat repudiandae quos? Harum omnis molestias eos quia, in illum incidunt exercitationem, enim possimus quasi laboriosam ut! Alias provident consequatur dicta.'
            // console.log(text.split(' ',20))
            if (text.split(' ').length < size) return text
            else {

                var words = text.split(' ', size)
                var trancatedText = ''
                words.forEach(word => {
                    trancatedText += word + ' '
                })
                trancatedText += ' ...'
                // console.log(trancatedText)
                return trancatedText
            }
        },

        isArabic(text) {
            var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
            result = pattern.test(text);
            return result;
        },
        isEng(text) {

            var pattern = /[A-z]/gi;
            result = pattern.test(text);
            return result;
        },
        isRus(text) {

            var pattern = /[\u0400-\u04FF]/gi;
            result = pattern.test(text);
            return result;
        },
        tarjem(text, lang) {

            var res;
            // var lang = 'arb'
            // console.log('tarjem')
            // var text = `привет e ;; hello world ;; e السلام عليكم `
            if (lang == 'arb') {
                var demo = text.split(';;')
                demo.forEach(e => {
                    if (this.isArabic(e)) res = e
                })
            } else {
                if (lang == 'eng') {

                    var demo = text.split(';;')
                    demo.forEach(e => {
                        if (this.isEng(e)) res = e
                    })
                } else {
                    if (lang == 'rus') {

                        var demo = text.split(';;')
                        demo.forEach(e => {
                            if (this.isRus(e)) res = e
                        })
                    }
                }
            }
            return res
        },
        share() {
            this.spinner = true
            fetch(this.api, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify({
                    name: this.username,
                    email: this.useremail,
                    number: this.usernumber,
                    src64: this.imageURI

                })
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.status) {
                        alert('تم ارسال الصور بنجاح ، الرجاء التحقق من بريدك')
                        this.spinner = false;
                        location.reload()
                    } else {
                        alert('Invalid Email Address')
                        this.spinner = false;
                        location.reload()
                    }
                }).catch(e => {
                    alert('شبكة ضعيفة الرجاء المحاولة مجددا')
                    console.log(e)

                    this.spinner = false;
                    location.reload()
                })


        },
        async print() {
            this.editTools = !this.editTools
            await window.print()

            // location.reload()
            // this.share()
        },
        focus() {
            document.querySelector('.inp').blur()
        },
        async startCounter() {

            this.count = 5

            var INV = setInterval(() => {
                if (this.count == 1) { clearInterval(INV); this.capture() }
                this.count--;
            }, 1000)
        },
        capture() {
            // preload shutter audio clip

            var shutter = new Audio();
            shutter.autoplay = true;
            shutter.src = navigator.userAgent.match(/Firefox/) ? 'shutter.ogg' : './assets/shutter.mp3';

            // play sound effect
            shutter.play();
            // this.preview = !this.preview

            // take snapshot and get image data
            Webcam.snap((data_uri) => {

                this.imageURI = data_uri
                // console.log(this.imageURI)
                sessionStorage.setItem('name', this.username)
                sessionStorage.setItem('email', this.useremail)
                sessionStorage.setItem('number', this.usernumber)
                sessionStorage.setItem('img', this.imageURI)

                location.href = 'Preview.html'
                // display results in page
                // document.getElementById('results').innerHTML =
                //     `<img class="w-75 shadow" src="' + data_uri + '"/>`;
            });
        },
        startWebcam() {
            if (this.username && this.useremail && this.usernumber) {
                this.openCamera = true
            }
        }
    }
})

app.component('Navbar', {
    template:
        /*html */
        `
    
    <header class="w-100 px-4 py-2 shadow d-flex justify-content-between align-items-center ">
        <div class="">
            <img src="./assets/ios/1024.png" alt="logo" class="img-fluid" width="60"  ondblclick="alert('version 2.2')" >
        </div>
        <slot></slot>
    </header>
    `,
    props: ['name']
})


app.component('camera', {
    template:
        /*html*/
        `
       
    <section class="container my-4">
        <div class="row justify-content-center px-3 gap-3">

            <div class="col-md-10 col-lg-5 col-12 shadow p-3 pb-0 rounded" dir="rtl"  style="background-color:#2C256D;">
                <!-- <div id="camera" class="w-100 h-800px"></div> -->
                <div class="ratio ratio-1x1">
                    <div class="object-fit-cover d-flex justify-content-center pb-3" id="camera"></div>
                </div>


                <div class="d-flex justify-content-between align-items-center flex-column bg-light">
                    
                </div>
                <slot name="cam"></slot>
            </div>

        </div>
    </section>
    `,
    mounted() {

        Webcam.set({
            // width: 560,
            // height: 700,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.attach('#camera');
    }

})

app.component('swiper', {
    
    template:
        /*html*/
        `

        <style scoped>
        .name::placeholder {
            color: white !important;
            opacity: 1 !important;
        }
    </style>

        
    <div class="swiper">
    
        <div class="swiper-wrapper" style="border-radius:20px;">








            <div class="swiper-slide">

            <div class="row justify-content-center my-3 px-2">
            <img src="./assets/Fine-logo.png" alt="hero" class="col-md-5 col-10 img-fluid" style="width:120px; height:100px;">

           
        </div>
                <div style="background-color: #2C256D; padding: 20px; margin-top: 100px ;  border-radius:30px !important;" class=" h-300px w-500px mx-auto px-3 py-5 rounded d-flex justify-content-center align-items-center flex-column gap-2 "
                    :dir="dir"   >
                    <input  @keyup="able(username)" @keyup.right="slideNext(username)" @keyup.enter="slideNext(username)" type="text" v-model="username"
                        class="name inp w-100 my-2 empty border-bottom border-white p-3 fs-3"
                        :placeholder="tarjem('Enter Full Name ;; ادخل الاسم الكامل',lang)"  style="color: white; "  >
                
                    
                    <button class="btn btn-success w-50 p-3 fs-5" @click="slideNext(username)" style="background-color:#EC9787; border-radius:20px"><i class="bi"></i>
                    {{tarjem('Next;;التالي',lang)}}
                </button>
                </div>
            </div>







            <div class="swiper-slide">


            <div class="row justify-content-center my-3 px-2">
            <img src="./assets/Fine-logo.png" alt="hero" class="col-md-5 col-10 img-fluid" style="width:120px; height:100px;">

           
        </div>
                <div style="background-color: #2C256D; padding: 20px; margin-top: 100px ; border-radius:30px !important;" class=" h-300px w-500px mx-auto px-3 py-5 rounded d-flex justify-content-center align-items-center flex-column gap-2 "
                    :dir="dir">

                    <input @keyup="able(useremail)" @keyup.right="slideNext(useremail)" @keyup.enter="slideNext(useremail)" type="email" required v-model="useremail"
                        class="inp w-100 my-2 empty border-bottom border-white p-3 fs-3 align-items-center"
                        :placeholder="tarjem('Enter Your Email;;ادخل بريدك الالكتروني',lang)"   style="color: white; ">
                   
                        <button @click="slideNext(useremail)" class="btn  w-50 p-3 fs-5 align-items-center"    style="background-color:#EC9787; border-radius:20px; color: white;"><i class="bi "></i>
                            {{tarjem('Next;;التالي',lang)}}
                        </button>
                        
                        <button @click="slidePrev(useremail)" class="btn btn-outline-light w-50 p-3 fs-5 align-items-center"style="border-radius:20px;">
                            {{tarjem('Previous;;السابق',lang)}}
                            <i class="bi "></i>
                        </button>
                </div>
            </div>










            <div class="swiper-slide">


            <div class="row justify-content-center my-3 px-2">
            <img src="./assets/Fine-logo.png" alt="hero" class="col-md-5 col-10 img-fluid" style="width:120px; height:100px;">

           
        </div>
                <div style="background-color: #2C256D; padding: 20px; margin-top: 100px ; border-radius:30px !important;" class=" h-300px w-500px mx-auto px-3 py-5 rounded d-flex justify-content-center align-items-center flex-column gap-2 "
                :dir="dir">
                    <input @keyup.enter="startWebcam" type="number" v-model="usernumber"
                        class="inp w-100 my-2 empty border-bottom border-white p-3 fs-3"
                        :placeholder="tarjem('Enter Your Number;;ادخل رقم هاتفك',lang)">
                    <button class="w-50 btn  p-3 fs-5" @click="startWebcam"  style="background-color:#EC9787; border-radius:20px; color: white;" >
                        {{tarjem('Take a Selfie;;التقط صورة',lang)}} </button>

                    <div class="swiper-button-prev my-3 w-100">
                        <button class="btn w-50 p-3 fs-5 btn-outline-light" style="border-radius:20px;">
                            {{tarjem('Previous;;السابق',lang)}}
                            <i class="bi "></i>
                        </button>
                    </div>

                </div>
            </div>

        </div>
    </div>

 
    `

    ,

    
    mounted() {

        var swiper = new Swiper('.swiper', {

            spaceBetween: 15,
            allowTouchMove: false,
            keyboard: {
                // enabled: true,
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'progressbar',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });


    },
    data() {
        return {
            dis: true,
            username: '',
            useremail: '',
            usernumber: '',
            cur: 'username'

        }
    },
    methods: {

        startWebcam() {
            this.$emit('cred', {
                name: this.username,
                email: this.useremail,
                number: this.usernumber
            })
        },

        slideNext(x) {
            if (x != '') document.querySelector('.swiper').swiper.slideNext()
            this.dis = true

        },
        slidePrev(x) {
            // if (x != '') document.querySelector('.swiper').swiper.slidePrev()
            document.querySelector('.swiper').swiper.slidePrev()
            this.dis = false
        },
        able(x) {
            if (x != '') {
                this.dis = false
            } else this.dis = true
        },


        isArabic(text) {
            var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
            result = pattern.test(text);
            return result;
        },
        isEng(text) {

            var pattern = /[A-z]/gi;
            result = pattern.test(text);
            return result;
        },
        isRus(text) {

            var pattern = /[\u0400-\u04FF]/gi;
            result = pattern.test(text);
            return result;
        },
        tarjem(text, lang) {

            var res;
            // var lang = 'arb'
            // console.log('tarjem')
            // var text = `привет e ;; hello world ;; e السلام عليكم `
            if (lang == 'arb') {
                var demo = text.split(';;')
                demo.forEach(e => {
                    if (this.isArabic(e)) res = e
                })
            } else {
                if (lang == 'eng') {

                    var demo = text.split(';;')
                    demo.forEach(e => {
                        if (this.isEng(e)) res = e
                    })
                } else {
                    if (lang == 'rus') {

                        var demo = text.split(';;')
                        demo.forEach(e => {
                            if (this.isRus(e)) res = e
                        })
                    }
                }
            }
            return res
        }
    },
    props: ['lang', 'dir'],
    emits: ['cred']

})

app.component('spinner', {
    template:
        /*html*/
        `
    
    <section v-if="spin" :dir="dir" class="z-200 w-100 h-100 bg-glass position-fixed top-0 start-0 d-flex justify-content-center align-items-center">
        <div class="w-50 h-25 p-3 d-flex justify-content-center align-items-center flex-column gap-3">
            <div class="spinner-grow text-light-green" role="status"></div>
            <slot></slot>
        </div>
    </section>
    `,
    props: ['spin', 'dir']
})
app.mount('#app')